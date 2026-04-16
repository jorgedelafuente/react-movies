import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const metricsPath = resolve(projectRoot, 'metrics', 'metrics.json');
const outputPath = resolve(projectRoot, 'metrics', 'dashboard.html');

const JS_BUDGET_BYTES = 500 * 1024; // 500 KB

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

function formatBytes(n) {
   if (!n) return '0 B';
   if (n < 1024) return `${n} B`;
   if (n < 1024 * 1024) return `${(n / 1024).toFixed(2)} KB`;
   return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function stripHash(name) {
   return name.replace(/(-[A-Za-z0-9]{6,12})(\.(?:js|css))$/, '$2');
}

function formatDate(iso) {
   if (!iso) return 'N/A';
   return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short',
   }).format(new Date(iso));
}

function htmlEscape(str) {
   return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
}

function getLatest(metrics) {
   return metrics.length > 0 ? metrics[metrics.length - 1] : null;
}

// ---------------------------------------------------------------------------
// Chart data builders
// ---------------------------------------------------------------------------

function buildBundleChartData(metrics) {
   const labels = metrics.map(e => e.date_full);
   const jsData = metrics.map(e => +(e.bundle.totalJsSizeBytes / 1024).toFixed(2));
   const cssData = metrics.map(e => +(e.bundle.totalCssSizeBytes / 1024).toFixed(2));
   const versionChanges = [];
   for (let i = 1; i < metrics.length; i++) {
      if (metrics[i].version !== metrics[i - 1].version) {
         versionChanges.push({ index: i, version: metrics[i].version });
      }
   }
   return { labels, jsData, cssData, versionChanges };
}

function buildChunkBarData(latest) {
   if (!latest) return { labels: [], data: [], colors: [] };
   const sorted = [...latest.bundle.chunks].sort((a, b) => b.sizeBytes - a.sizeBytes);
   return {
      labels: sorted.map(c => stripHash(c.name)),
      data: sorted.map(c => +(c.sizeBytes / 1024).toFixed(2)),
      colors: sorted.map(c => (c.type === 'js' ? '#3b82f6' : '#22c55e')),
   };
}

function buildComponentRankingData(latest) {
   if (!latest) return { labels: [], data: [] };
   const sorted = [...latest.components].sort((a, b) => b.totalUsages - a.totalUsages);
   return {
      labels: sorted.map(c => c.importedAs),
      data: sorted.map(c => c.totalUsages),
   };
}

function buildComponentTableRows(latest) {
   if (!latest) return [];
   return latest.components.map(c => {
      const allProps = new Set();
      c.usages.forEach(u => u.props.forEach(p => allProps.add(p)));
      const shortName = c.component.split('/').pop();
      return {
         component: c.component,
         shortName,
         importedAs: c.importedAs,
         totalUsages: c.totalUsages,
         fileCount: c.usages.length,
         files: c.usages.map(u => u.file),
         propsUnion: [...allProps].sort().join(', ') || '—',
      };
   });
}

function buildPropFrequencyTable(latest) {
   if (!latest) return [];
   const freq = new Map();
   for (const c of latest.components) {
      for (const u of c.usages) {
         for (const p of u.props) {
            freq.set(p, (freq.get(p) ?? 0) + 1);
         }
      }
   }
   return [...freq.entries()]
      .map(([prop, count]) => ({ prop, count }))
      .sort((a, b) => b.count - a.count);
}

function buildGitHubChartData(metrics) {
   const valid = metrics.filter(e => e.github !== null);
   if (valid.length < 2) return null;
   return {
      labels: valid.map(e => e.date_full),
      uniqueViews: valid.map(e => e.github.views14d.unique),
      uniqueClones: valid.map(e => e.github.clones14d.unique),
   };
}

function buildSpecVsProdStats(latest) {
   if (!latest) return [];
   return latest.components.map(c => {
      let prodUsages = 0;
      let specUsages = 0;
      for (const u of c.usages) {
         if (/\.spec\.tsx?$/.test(u.file)) {
            specUsages += u.props.length > 0 ? 1 : 1;
         } else {
            prodUsages += 1;
         }
      }
      return { importedAs: c.importedAs, prodUsages, specUsages };
   }).filter(r => r.specUsages > 0 || r.prodUsages > 0);
}

function buildImportHeavyFiles(latest) {
   if (!latest) return [];
   const fileCounts = new Map();
   for (const c of latest.components) {
      for (const u of c.usages) {
         fileCounts.set(u.file, (fileCounts.get(u.file) ?? 0) + 1);
      }
   }
   return [...fileCounts.entries()]
      .map(([file, componentCount]) => ({ file, componentCount }))
      .sort((a, b) => b.componentCount - a.componentCount);
}

// ---------------------------------------------------------------------------
// HTML fragment builders
// ---------------------------------------------------------------------------

function buildKpiCard(label, value, subtitle, extraClass = '') {
   return `
      <div class="kpi-card ${extraClass}">
         <div class="kpi-value">${htmlEscape(String(value))}</div>
         <div class="kpi-label">${htmlEscape(label)}</div>
         ${subtitle ? `<div class="kpi-subtitle">${htmlEscape(subtitle)}</div>` : ''}
      </div>`;
}

function buildPlaceholder(message) {
   return `<div class="placeholder">${htmlEscape(message)}</div>`;
}

function buildChartCard(id, title, height = 300) {
   return `
      <div class="chart-card">
         <h3>${htmlEscape(title)}</h3>
         <canvas id="${id}" height="${height}"></canvas>
      </div>`;
}

function buildSectionHeader(title, id) {
   return `<h2 id="${id}" class="section-header">${htmlEscape(title)}</h2>`;
}

// ---------------------------------------------------------------------------
// Section builders
// ---------------------------------------------------------------------------

function buildHeaderSection(metrics, latest) {
   if (!latest) {
      return `
         <header class="site-header">
            <div class="header-inner">
               <div class="header-title"><h1>react-movies</h1></div>
               <div class="header-meta"><span>No data collected yet</span></div>
            </div>
         </header>`;
   }
   return `
      <header class="site-header">
         <div class="header-inner">
            <div class="header-title">
               <h1>react-movies</h1>
               <span class="version-badge">v${htmlEscape(latest.version ?? '?')}</span>
            </div>
            <div class="header-meta">
               <span>Last updated: ${htmlEscape(formatDate(latest.date_full))}</span>
               <span>${metrics.length} data point${metrics.length === 1 ? '' : 's'} collected</span>
            </div>
         </div>
         <nav class="header-nav">
            <a href="#bundle">Bundle</a>
            <a href="#components">Components</a>
            <a href="#github">GitHub</a>
            <a href="#history">History</a>
         </nav>
      </header>`;
}

function buildKpiRow(latest) {
   if (!latest) return '';
   const jsBytes = latest.bundle.totalJsSizeBytes;
   const jsPct = jsBytes / JS_BUDGET_BYTES;
   const jsClass = jsPct >= 1 ? 'danger' : jsPct >= 0.9 ? 'warning' : '';
   const jsBudgetNote = jsClass ? `${Math.round(jsPct * 100)}% of ${formatBytes(JS_BUDGET_BYTES)} budget` : '';
   const totalUsages = latest.components.reduce((s, c) => s + c.totalUsages, 0);
   return `
      <section class="kpi-row">
         ${buildKpiCard('JS Bundle', formatBytes(jsBytes), jsBudgetNote, jsClass)}
         ${buildKpiCard('CSS Bundle', formatBytes(latest.bundle.totalCssSizeBytes))}
         ${buildKpiCard('Components Tracked', latest.components.length)}
         ${buildKpiCard('Total Usages', totalUsages)}
      </section>`;
}

function buildBundleSection(metrics) {
   const trendChart = metrics.length >= 2
      ? buildChartCard('chart-bundle-trend', 'Bundle size over time')
      : `<div class="chart-card"><h3>Bundle size over time</h3>${buildPlaceholder('Not enough data — need at least 2 data points')}</div>`;

   return `
      ${buildSectionHeader('Bundle', 'bundle')}
      ${trendChart}
      ${buildChartCard('chart-chunks', 'Chunk breakdown (latest build)')}`;
}

function buildComponentDetailTable(rows) {
   if (rows.length === 0) return buildPlaceholder('No component data');
   const trs = rows.map(r => `
      <tr>
         <td><code>${htmlEscape(r.component)}</code></td>
         <td><strong>${htmlEscape(r.importedAs)}</strong></td>
         <td class="num">${r.totalUsages}</td>
         <td class="num">${r.fileCount}</td>
         <td class="props-cell">${htmlEscape(r.propsUnion)}</td>
      </tr>`).join('');
   return `
      <div class="table-wrap">
         <table>
            <thead><tr>
               <th>Component</th><th>Imported As</th>
               <th class="num">Usages</th><th class="num">Files</th><th>Props Used</th>
            </tr></thead>
            <tbody>${trs}</tbody>
         </table>
      </div>`;
}

function buildSpecTable(stats) {
   const relevant = stats.filter(r => r.specUsages > 0);
   if (relevant.length === 0) return buildPlaceholder('No components found in spec files');
   const trs = relevant.map(r => `
      <tr>
         <td><strong>${htmlEscape(r.importedAs)}</strong></td>
         <td class="num">${r.prodUsages}</td>
         <td class="num">${r.specUsages}</td>
      </tr>`).join('');
   return `
      <div class="table-wrap">
         <table>
            <thead><tr><th>Component</th><th class="num">Prod Files</th><th class="num">Spec Files</th></tr></thead>
            <tbody>${trs}</tbody>
         </table>
      </div>`;
}

function buildPropFreqTableHtml(rows) {
   if (rows.length === 0) return buildPlaceholder('No prop data');
   const trs = rows.slice(0, 20).map(r => `
      <tr>
         <td><code>${htmlEscape(r.prop)}</code></td>
         <td class="num">${r.count}</td>
      </tr>`).join('');
   return `
      <div class="table-wrap">
         <table>
            <thead><tr><th>Prop</th><th class="num">Times Used</th></tr></thead>
            <tbody>${trs}</tbody>
         </table>
      </div>`;
}

function buildImportHeavyTableHtml(rows) {
   if (rows.length === 0) return buildPlaceholder('No data');
   const trs = rows.slice(0, 15).map(r => `
      <tr>
         <td><code>${htmlEscape(r.file)}</code></td>
         <td class="num">${r.componentCount}</td>
      </tr>`).join('');
   return `
      <div class="table-wrap">
         <table>
            <thead><tr><th>File</th><th class="num">Component Imports</th></tr></thead>
            <tbody>${trs}</tbody>
         </table>
      </div>`;
}

function buildComponentsSection(latest) {
   const tableRows = buildComponentTableRows(latest);
   const specStats = buildSpecVsProdStats(latest);
   const propFreq = buildPropFrequencyTable(latest);
   const importHeavy = buildImportHeavyFiles(latest);

   return `
      ${buildSectionHeader('Components', 'components')}
      <div class="chart-card">
         <h3>Usage ranking</h3>
         ${latest ? `<canvas id="chart-component-rank" height="${Math.max(200, (latest.components.length * 30))}"></canvas>` : buildPlaceholder('No data')}
      </div>
      <div class="chart-card">
         <h3>Component details</h3>
         ${buildComponentDetailTable(tableRows)}
      </div>
      <div class="two-col">
         <div class="chart-card">
            <h3>Spec vs. production usage</h3>
            ${buildSpecTable(specStats)}
         </div>
         <div class="chart-card">
            <h3>Most used props</h3>
            ${buildPropFreqTableHtml(propFreq)}
         </div>
      </div>
      <div class="chart-card">
         <h3>Most import-heavy files</h3>
         ${buildImportHeavyTableHtml(importHeavy)}
      </div>`;
}

function buildGitHubSection(metrics, latest) {
   if (!latest?.github) {
      return `
         ${buildSectionHeader('GitHub', 'github')}
         <div class="chart-card">${buildPlaceholder('GitHub data unavailable — GITHUB_TOKEN / GITHUB_REPOSITORY not set during collection')}</div>`;
   }
   const g = latest.github;
   const ghChartData = buildGitHubChartData(metrics);
   const viewsChart = ghChartData
      ? buildChartCard('chart-gh-views', 'Unique page views over time')
      : `<div class="chart-card"><h3>Unique page views over time</h3>${buildPlaceholder('Not enough data points with GitHub metrics')}</div>`;
   const clonesChart = ghChartData
      ? buildChartCard('chart-gh-clones', 'Unique clones over time')
      : `<div class="chart-card"><h3>Unique clones over time</h3>${buildPlaceholder('Not enough data points with GitHub metrics')}</div>`;

   return `
      ${buildSectionHeader('GitHub', 'github')}
      <section class="kpi-row">
         ${buildKpiCard('Stars', g.stars)}
         ${buildKpiCard('Forks', g.forks)}
         ${buildKpiCard('Open Issues', g.openIssues)}
         ${buildKpiCard('Contributors', g.contributorCount)}
         ${buildKpiCard('Repo Size', formatBytes(g.sizeKb * 1024))}
      </section>
      <div class="two-col">
         ${viewsChart}
         ${clonesChart}
      </div>`;
}

function buildHistorySection(metrics) {
   if (metrics.length === 0) {
      return `
         ${buildSectionHeader('History', 'history')}
         <div class="chart-card">${buildPlaceholder('No data collected yet')}</div>`;
   }
   const rows = [...metrics].reverse();
   const trs = rows.map(e => {
      const totalUsages = e.components?.reduce((s, c) => s + c.totalUsages, 0) ?? '—';
      const stars = e.github?.stars ?? '—';
      return `
         <tr>
            <td>${htmlEscape(formatDate(e.date_full))}</td>
            <td>${htmlEscape(e.version ?? '—')}</td>
            <td class="num">${htmlEscape(formatBytes(e.bundle?.totalJsSizeBytes ?? 0))}</td>
            <td class="num">${htmlEscape(formatBytes(e.bundle?.totalCssSizeBytes ?? 0))}</td>
            <td class="num">${e.components?.length ?? '—'}</td>
            <td class="num">${totalUsages}</td>
            <td class="num">${stars}</td>
         </tr>`;
   }).join('');
   return `
      ${buildSectionHeader('History', 'history')}
      <div class="chart-card">
         <div class="table-wrap">
            <table>
               <thead><tr>
                  <th>Date / Time</th><th>Version</th>
                  <th class="num">JS</th><th class="num">CSS</th>
                  <th class="num">Components</th><th class="num">Usages</th><th class="num">Stars</th>
               </tr></thead>
               <tbody>${trs}</tbody>
            </table>
         </div>
      </div>`;
}

// ---------------------------------------------------------------------------
// CSS
// ---------------------------------------------------------------------------

function buildCSS() {
   return `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
   --bg: #f8fafc; --surface: #ffffff; --border: #e2e8f0;
   --text: #0f172a; --text-muted: #64748b;
   --accent: #3b82f6; --accent-g: #22c55e;
   --shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
   --radius: 0.5rem;
}
@media (prefers-color-scheme: dark) {
   :root {
      --bg: #0f172a; --surface: #1e293b; --border: #334155;
      --text: #f1f5f9; --text-muted: #94a3b8;
      --shadow: 0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3);
   }
}

body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); line-height: 1.5; }
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
code { font-family: ui-monospace, monospace; font-size: 0.85em; background: rgba(99,102,241,0.1); padding: 0.1em 0.3em; border-radius: 3px; word-break: break-all; }

.site-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 1rem 1.5rem; position: sticky; top: 0; z-index: 10; box-shadow: var(--shadow); }
.header-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; }
.header-title { display: flex; align-items: center; gap: 0.75rem; }
.header-title h1 { font-size: 1.25rem; font-weight: 700; }
.header-meta { display: flex; gap: 1rem; font-size: 0.8rem; color: var(--text-muted); flex-wrap: wrap; }
.header-nav { max-width: 1200px; margin: 0.5rem auto 0; display: flex; gap: 1.25rem; font-size: 0.875rem; }
.version-badge { background: var(--accent); color: #fff; border-radius: 999px; padding: 0.2rem 0.65rem; font-size: 0.8rem; font-weight: 600; }

.container { max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem; }

.section-header { font-size: 1.25rem; font-weight: 700; margin: 2.5rem 0 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid var(--border); }

.kpi-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
.kpi-card { background: var(--surface); border-radius: var(--radius); padding: 1.25rem; box-shadow: var(--shadow); }
.kpi-value { font-size: 1.75rem; font-weight: 700; color: var(--accent); line-height: 1.2; }
.kpi-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-top: 0.25rem; }
.kpi-subtitle { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem; }
.kpi-card.warning .kpi-value { color: #f59e0b; }
.kpi-card.danger .kpi-value { color: #ef4444; }

.chart-card { background: var(--surface); border-radius: var(--radius); padding: 1.5rem; box-shadow: var(--shadow); margin-bottom: 1.5rem; }
.chart-card h3 { font-size: 0.9rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 1rem; }

.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
@media (max-width: 768px) { .two-col { grid-template-columns: 1fr; } }

.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
th { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); padding: 0.6rem 0.75rem; text-align: left; border-bottom: 2px solid var(--border); }
td { padding: 0.6rem 0.75rem; border-bottom: 1px solid var(--border); vertical-align: top; }
tbody tr:last-child td { border-bottom: none; }
tbody tr:hover td { background: rgba(99,102,241,0.04); }
.num { text-align: right; font-variant-numeric: tabular-nums; }
.props-cell { font-size: 0.8rem; color: var(--text-muted); max-width: 300px; }

.placeholder { padding: 2rem; text-align: center; color: var(--text-muted); font-size: 0.875rem; border: 2px dashed var(--border); border-radius: var(--radius); }
`;
}

// ---------------------------------------------------------------------------
// Init script (chart initialization)
// ---------------------------------------------------------------------------

function buildInitScript(bundleData, chunkData, componentData, ghChartData) {
   const safeJSON = obj => JSON.stringify(obj);

   return `
(function() {
   const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
   Chart.defaults.color = dark ? '#e2e8f0' : '#374151';
   Chart.defaults.borderColor = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

   function shortDate(iso) {
      if (!iso) return '';
      const d = new Date(iso);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'UTC' });
   }

   // --- Bundle trend chart ---
   const trendCanvas = document.getElementById('chart-bundle-trend');
   if (trendCanvas) {
      const bundleData = ${safeJSON(bundleData)};
      const versionChanges = bundleData.versionChanges;
      new Chart(trendCanvas, {
         type: 'line',
         data: {
            labels: bundleData.labels,
            datasets: [
               {
                  label: 'JS (KB)',
                  data: bundleData.jsData,
                  borderColor: '#3b82f6',
                  backgroundColor: 'rgba(59,130,246,0.1)',
                  tension: 0.3,
                  fill: true,
                  pointRadius: 4,
               },
               {
                  label: 'CSS (KB)',
                  data: bundleData.cssData,
                  borderColor: '#22c55e',
                  backgroundColor: 'rgba(34,197,94,0.1)',
                  tension: 0.3,
                  fill: true,
                  pointRadius: 4,
               }
            ]
         },
         options: {
            responsive: true,
            interaction: { mode: 'index', intersect: false },
            plugins: {
               legend: { position: 'top' },
               tooltip: { callbacks: { label: ctx => ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(2) + ' KB' } }
            },
            scales: {
               x: { ticks: { callback: (_, i) => shortDate(bundleData.labels[i]) } },
               y: { title: { display: true, text: 'Size (KB)' }, beginAtZero: false }
            }
         },
         plugins: [{
            id: 'versionLines',
            afterDraw(chart) {
               if (!versionChanges.length) return;
               const ctx2 = chart.ctx;
               const xScale = chart.scales.x;
               const yScale = chart.scales.y;
               ctx2.save();
               versionChanges.forEach(vc => {
                  const x = xScale.getPixelForValue(vc.index);
                  ctx2.beginPath();
                  ctx2.setLineDash([4, 4]);
                  ctx2.strokeStyle = dark ? '#f59e0b' : '#d97706';
                  ctx2.lineWidth = 1.5;
                  ctx2.moveTo(x, yScale.top);
                  ctx2.lineTo(x, yScale.bottom);
                  ctx2.stroke();
                  ctx2.fillStyle = dark ? '#f59e0b' : '#d97706';
                  ctx2.font = '11px system-ui';
                  ctx2.fillText('v' + vc.version, x + 4, yScale.top + 14);
               });
               ctx2.restore();
            }
         }]
      });
   }

   // --- Chunk breakdown bar chart ---
   const chunksCanvas = document.getElementById('chart-chunks');
   if (chunksCanvas) {
      const chunkData = ${safeJSON(chunkData)};
      new Chart(chunksCanvas, {
         type: 'bar',
         data: {
            labels: chunkData.labels,
            datasets: [{
               label: 'Size (KB)',
               data: chunkData.data,
               backgroundColor: chunkData.colors,
            }]
         },
         options: {
            responsive: true,
            plugins: {
               legend: { display: false },
               tooltip: { callbacks: { label: ctx => ctx.parsed.y.toFixed(2) + ' KB' } }
            },
            scales: {
               y: { title: { display: true, text: 'Size (KB)' }, beginAtZero: true }
            }
         }
      });
   }

   // --- Component usage ranking (horizontal bar) ---
   const rankCanvas = document.getElementById('chart-component-rank');
   if (rankCanvas) {
      const compData = ${safeJSON(componentData)};
      new Chart(rankCanvas, {
         type: 'bar',
         data: {
            labels: compData.labels,
            datasets: [{
               label: 'Total usages',
               data: compData.data,
               backgroundColor: '#6366f1',
            }]
         },
         options: {
            indexAxis: 'y',
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
               x: {
                  title: { display: true, text: 'Total usages' },
                  beginAtZero: true,
                  ticks: { precision: 0 }
               }
            }
         }
      });
   }

   // --- GitHub charts ---
   const ghData = ${safeJSON(ghChartData)};
   if (ghData) {
      const viewsCanvas = document.getElementById('chart-gh-views');
      if (viewsCanvas) {
         new Chart(viewsCanvas, {
            type: 'line',
            data: {
               labels: ghData.labels,
               datasets: [{
                  label: 'Unique views',
                  data: ghData.uniqueViews,
                  borderColor: '#8b5cf6',
                  backgroundColor: 'rgba(139,92,246,0.1)',
                  tension: 0.3,
                  fill: true,
                  pointRadius: 4,
               }]
            },
            options: {
               responsive: true,
               plugins: {
                  legend: { position: 'top' },
                  tooltip: { callbacks: { label: ctx => 'Views: ' + ctx.parsed.y } }
               },
               scales: {
                  x: { ticks: { callback: (_, i) => shortDate(ghData.labels[i]) } },
                  y: { beginAtZero: true, ticks: { precision: 0 } }
               }
            }
         });
      }
      const clonesCanvas = document.getElementById('chart-gh-clones');
      if (clonesCanvas) {
         new Chart(clonesCanvas, {
            type: 'line',
            data: {
               labels: ghData.labels,
               datasets: [{
                  label: 'Unique clones',
                  data: ghData.uniqueClones,
                  borderColor: '#f59e0b',
                  backgroundColor: 'rgba(245,158,11,0.1)',
                  tension: 0.3,
                  fill: true,
                  pointRadius: 4,
               }]
            },
            options: {
               responsive: true,
               plugins: {
                  legend: { position: 'top' },
                  tooltip: { callbacks: { label: ctx => 'Clones: ' + ctx.parsed.y } }
               },
               scales: {
                  x: { ticks: { callback: (_, i) => shortDate(ghData.labels[i]) } },
                  y: { beginAtZero: true, ticks: { precision: 0 } }
               }
            }
         });
      }
   }
})();
`;
}

// ---------------------------------------------------------------------------
// Main document assembler
// ---------------------------------------------------------------------------

function buildDocument(metrics) {
   const latest = getLatest(metrics);

   const bundleData = buildBundleChartData(metrics);
   const chunkData = buildChunkBarData(latest);
   const componentData = buildComponentRankingData(latest);
   const ghChartData = buildGitHubChartData(metrics);

   return `<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>react-movies — Metrics Dashboard</title>
   <style>${buildCSS()}</style>
</head>
<body>

${buildHeaderSection(metrics, latest)}

<main class="container">

${buildKpiRow(latest)}

${buildBundleSection(metrics)}

${buildComponentsSection(latest)}

${buildGitHubSection(metrics, latest)}

${buildHistorySection(metrics)}

</main>

<script>const METRICS = ${JSON.stringify(metrics)};</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.4/chart.umd.min.js"></script>
<script>${buildInitScript(bundleData, chunkData, componentData, ghChartData)}</script>

</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

async function main() {
   let metrics = [];
   try {
      metrics = JSON.parse(await readFile(metricsPath, 'utf8'));
   } catch {
      console.warn('[dashboard] metrics.json not found — generating empty dashboard');
   }

   const html = buildDocument(metrics);
   await writeFile(outputPath, html, 'utf8');
   console.log('[dashboard] written → metrics/dashboard.html');
}

main().catch(err => {
   console.error('[dashboard] fatal:', err);
   process.exit(1);
});
