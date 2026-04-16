import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { resolve, join, extname } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const projectRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');

// ---------------------------------------------------------------------------
// Section A — Bundle metrics
// ---------------------------------------------------------------------------

async function collectBundleMetrics() {
   const assetsDir = join(projectRoot, 'dist', 'assets');
   const entries = await readdir(assetsDir);

   const chunks = [];
   for (const name of entries) {
      const ext = extname(name).replace('.', '');
      if (ext !== 'js' && ext !== 'css') continue;
      const filePath = join(assetsDir, name);
      const { size } = await stat(filePath);
      chunks.push({ name, sizeBytes: size, type: ext });
   }

   const totalJsSizeBytes = chunks
      .filter((c) => c.type === 'js')
      .reduce((sum, c) => sum + c.sizeBytes, 0);
   const totalCssSizeBytes = chunks
      .filter((c) => c.type === 'css')
      .reduce((sum, c) => sum + c.sizeBytes, 0);

   return { totalJsSizeBytes, totalCssSizeBytes, chunks };
}

// ---------------------------------------------------------------------------
// Section B — Component import metrics (TypeScript AST)
// ---------------------------------------------------------------------------

// Aggregation map: key = `componentPath::importedAs`
const aggregated = new Map();

async function parseFile(relPath) {
   const absPath = resolve(projectRoot, relPath);
   const content = await readFile(absPath, 'utf8');

   const scriptKind = relPath.endsWith('.tsx')
      ? ts.ScriptKind.TSX
      : ts.ScriptKind.TS;

   const sourceFile = ts.createSourceFile(
      relPath,
      content,
      ts.ScriptTarget.ESNext,
      /*setParentNodes*/ true,
      scriptKind
   );

   // Step 1: collect @/components/* import declarations
   // Map: localName -> { componentPath, importedAs }
   const localComponentMap = new Map();

   function visitImports(node) {
      if (ts.isImportDeclaration(node)) {
         if (node.importClause?.isTypeOnly) {
            ts.forEachChild(node, visitImports);
            return;
         }
         const modulePath = node.moduleSpecifier.text;
         if (!modulePath.startsWith('@/components/')) {
            ts.forEachChild(node, visitImports);
            return;
         }
         const clause = node.importClause;
         if (!clause) return;

         // Default import: `import Button from '@/components/...'`
         if (!clause.isTypeOnly && clause.name) {
            localComponentMap.set(clause.name.text, {
               componentPath: modulePath,
               importedAs: clause.name.text,
            });
         }

         // Named imports: `import { Input } from '@/components/...'`
         if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
            for (const el of clause.namedBindings.elements) {
               if (!el.isTypeOnly) {
                  // `import { Foo as Bar }` → importedAs = 'Foo', local = 'Bar'
                  const importedAs = el.propertyName
                     ? el.propertyName.text
                     : el.name.text;
                  localComponentMap.set(el.name.text, {
                     componentPath: modulePath,
                     importedAs,
                  });
               }
            }
         }
      }
      ts.forEachChild(node, visitImports);
   }
   visitImports(sourceFile);

   if (localComponentMap.size === 0) return;

   // Step 2: collect JSX usages of those components
   function visitJSX(node) {
      const isJsxElement =
         ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node);

      if (isJsxElement) {
         const tagName = node.tagName.getText(sourceFile);
         const info = localComponentMap.get(tagName);
         if (info) {
            const props = [];
            for (const attr of node.attributes.properties) {
               if (ts.isJsxAttribute(attr)) {
                  props.push(
                     ts.isIdentifier(attr.name)
                        ? attr.name.text
                        : attr.name.getText(sourceFile)
                  );
               }
               // JsxSpreadAttribute intentionally skipped
            }

            const key = `${info.componentPath}::${info.importedAs}`;

            if (!aggregated.has(key)) {
               aggregated.set(key, {
                  component: info.componentPath,
                  importedAs: info.importedAs,
                  perFile: new Map(),
               });
            }

            const entry = aggregated.get(key);
            if (!entry.perFile.has(relPath)) {
               entry.perFile.set(relPath, { count: 0, propsSet: new Set() });
            }
            const fileEntry = entry.perFile.get(relPath);
            fileEntry.count += 1;
            for (const p of props) fileEntry.propsSet.add(p);
         }
      }
      ts.forEachChild(node, visitJSX);
   }
   visitJSX(sourceFile);
}

function buildComponentMetrics() {
   const result = [];
   for (const { component, importedAs, perFile } of aggregated.values()) {
      let totalUsages = 0;
      const usages = [];
      for (const [file, { count, propsSet }] of perFile.entries()) {
         totalUsages += count;
         usages.push({ file, props: [...propsSet].sort() });
      }
      result.push({ component, importedAs, totalUsages, usages });
   }
   result.sort((a, b) => a.component.localeCompare(b.component));
   return result;
}

async function collectComponentMetrics() {
   // Use glob from node:fs/promises (Node 22+)
   const { glob } = await import('node:fs/promises');
   const sourceFiles = [];
   for await (const relPath of glob('src/**/*.{tsx,ts}', {
      cwd: projectRoot,
   })) {
      sourceFiles.push(relPath);
   }
   await Promise.all(sourceFiles.map(parseFile));
   return buildComponentMetrics();
}

// ---------------------------------------------------------------------------
// Section C — GitHub API metrics
// ---------------------------------------------------------------------------

async function collectGitHubMetrics() {
   const token = process.env.GITHUB_TOKEN;
   const repository = process.env.GITHUB_REPOSITORY;

   if (!token || !repository) {
      console.warn(
         '[metrics] GITHUB_TOKEN or GITHUB_REPOSITORY not set — skipping GitHub metrics',
      );
      return null;
   }

   const [owner, repo] = repository.split('/');
   const base = `https://api.github.com/repos/${owner}/${repo}`;
   const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
   };

   const [repoData, clonesData, viewsData, contributorsData] =
      await Promise.all([
         fetch(base, { headers }).then((r) => r.json()),
         fetch(`${base}/traffic/clones`, { headers }).then((r) => r.json()),
         fetch(`${base}/traffic/views`, { headers }).then((r) => r.json()),
         fetch(`${base}/stats/contributors`, { headers }).then((r) => r.json()),
      ]);

   return {
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      openIssues: repoData.open_issues_count,
      watchers: repoData.watchers_count,
      sizeKb: repoData.size,
      clones14d: {
         total: clonesData.count ?? 0,
         unique: clonesData.uniques ?? 0,
      },
      views14d: {
         total: viewsData.count ?? 0,
         unique: viewsData.uniques ?? 0,
      },
      // /stats/contributors returns 202 while computing — Array.isArray guard
      contributorCount: Array.isArray(contributorsData)
         ? contributorsData.length
         : 0,
   };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
   const now = new Date();
   const date = now.toISOString().slice(0, 10);
   const date_full = now.toISOString();

   const { version } = JSON.parse(
      await readFile(join(projectRoot, 'package.json'), 'utf8'),
   );

   console.log(`[metrics] collecting bundle metrics...`);
   const bundle = await collectBundleMetrics();

   console.log(`[metrics] collecting component import metrics...`);
   const components = await collectComponentMetrics();

   console.log(`[metrics] collecting github metrics...`);
   const github = await collectGitHubMetrics();

   const entry = { date, date_full, version, bundle, components, github };

   const metricsPath = join(projectRoot, 'metrics', 'metrics.json');
   let existing;
   try {
      existing = JSON.parse(await readFile(metricsPath, 'utf8'));
   } catch {
      existing = [];
   }
   existing.push(entry);
   await writeFile(
      metricsPath,
      JSON.stringify(existing, null, 2) + '\n',
      'utf8'
   );

   console.log(`[metrics] done. Appended entry for ${date}.`);
}

main().catch((err) => {
   console.error('[metrics] fatal:', err);
   process.exit(1);
});
