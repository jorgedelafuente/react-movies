import * as t from "@babel/types";
import babel__default from "@babel/core";
import _generate from "@babel/generator";
import * as template from "@babel/template";
import { deadCodeElimination } from "babel-dead-code-elimination";
import { splitPrefix } from "../constants.js";
import { parseAst } from "./ast.js";
let generate = _generate["default"];
if (!generate) {
  generate = _generate;
}
function compileCodeSplitReferenceRoute(opts) {
  const ast = parseAst(opts);
  if (!ast) {
    throw new Error(
      `Failed to compile ast for compileCodeSplitReferenceRoute() for the file: ${opts.filename}`
    );
  }
  babel__default.traverse(ast, {
    Program: {
      enter(programPath, programState) {
        const state = programState;
        const splitUrl = `${splitPrefix}:${opts.filename}?${splitPrefix}`;
        let existingCompImportPath = null;
        let existingLoaderImportPath = null;
        programPath.traverse(
          {
            CallExpression: (path) => {
              if (!t.isIdentifier(path.node.callee)) {
                return;
              }
              if (!(path.node.callee.name === "createRoute" || path.node.callee.name === "createFileRoute")) {
                return;
              }
              if (t.isCallExpression(path.parentPath.node)) {
                const options = resolveIdentifier(
                  path,
                  path.parentPath.node.arguments[0]
                );
                let found = false;
                const hasImportedOrDefinedIdentifier = (name) => {
                  return programPath.scope.hasBinding(name);
                };
                if (t.isObjectExpression(options)) {
                  options.properties.forEach((prop) => {
                    if (t.isObjectProperty(prop)) {
                      if (t.isIdentifier(prop.key)) {
                        if (prop.key.name === "component") {
                          const value = prop.value;
                          if (t.isIdentifier(value)) {
                            existingCompImportPath = getImportSpecifierAndPathFromLocalName(
                              programPath,
                              value.name
                            ).path;
                            removeIdentifierLiteral(path, value);
                          }
                          if (!hasImportedOrDefinedIdentifier(
                            "lazyRouteComponent"
                          )) {
                            programPath.unshiftContainer("body", [
                              template.statement(
                                `import { lazyRouteComponent } from '@tanstack/react-router'`
                              )()
                            ]);
                          }
                          if (!hasImportedOrDefinedIdentifier(
                            "$$splitComponentImporter"
                          )) {
                            programPath.unshiftContainer("body", [
                              template.statement(
                                `const $$splitComponentImporter = () => import('${splitUrl}')`
                              )()
                            ]);
                          }
                          prop.value = template.expression(
                            `lazyRouteComponent($$splitComponentImporter, 'component')`
                          )();
                          programPath.pushContainer("body", [
                            template.statement(
                              `function DummyComponent() { return null }`
                            )()
                          ]);
                          found = true;
                        } else if (prop.key.name === "loader") {
                          const value = prop.value;
                          if (t.isIdentifier(value)) {
                            existingLoaderImportPath = getImportSpecifierAndPathFromLocalName(
                              programPath,
                              value.name
                            ).path;
                            removeIdentifierLiteral(path, value);
                          }
                          if (!hasImportedOrDefinedIdentifier("lazyFn")) {
                            programPath.unshiftContainer("body", [
                              template.smart(
                                `import { lazyFn } from '@tanstack/react-router'`
                              )()
                            ]);
                          }
                          if (!hasImportedOrDefinedIdentifier(
                            "$$splitLoaderImporter"
                          )) {
                            programPath.unshiftContainer("body", [
                              template.statement(
                                `const $$splitLoaderImporter = () => import('${splitUrl}')`
                              )()
                            ]);
                          }
                          prop.value = template.expression(
                            `lazyFn($$splitLoaderImporter, 'loader')`
                          )();
                          found = true;
                        }
                      }
                    }
                    programPath.scope.crawl();
                  });
                }
                if (found) {
                  programPath.pushContainer("body", [
                    template.statement(`function TSR_Dummy_Component() {}`)()
                  ]);
                }
              }
            }
          },
          state
        );
        if (existingCompImportPath || existingLoaderImportPath) {
          programPath.traverse({
            ImportDeclaration(path) {
              if (path.node.specifiers.length > 0) return;
              if (path.node.source.value === existingCompImportPath || path.node.source.value === existingLoaderImportPath) {
                path.remove();
              }
            }
          });
        }
      }
    }
  });
  deadCodeElimination(ast);
  return generate(ast, {
    sourceMaps: true,
    minified: process.env.NODE_ENV === "production"
  });
}
const splitNodeTypes = ["component", "loader"];
function compileCodeSplitVirtualRoute(opts) {
  const ast = parseAst(opts);
  if (!ast) {
    throw new Error(
      `Failed to compile ast for compileCodeSplitVirtualRoute() for the file: ${opts.filename}`
    );
  }
  babel__default.traverse(ast, {
    Program: {
      enter(programPath, programState) {
        const state = programState;
        const splitNodesByType = {
          component: void 0,
          loader: void 0
        };
        programPath.traverse(
          {
            CallExpression: (path) => {
              if (!t.isIdentifier(path.node.callee)) {
                return;
              }
              if (!(path.node.callee.name === "createRoute" || path.node.callee.name === "createFileRoute")) {
                return;
              }
              if (t.isCallExpression(path.parentPath.node)) {
                const options = resolveIdentifier(
                  path,
                  path.parentPath.node.arguments[0]
                );
                if (t.isObjectExpression(options)) {
                  options.properties.forEach((prop) => {
                    if (t.isObjectProperty(prop)) {
                      splitNodeTypes.forEach((type) => {
                        if (t.isIdentifier(prop.key)) {
                          if (prop.key.name === type) {
                            splitNodesByType[type] = prop.value;
                          }
                        }
                      });
                    }
                  });
                  options.properties = [];
                }
              }
            }
          },
          state
        );
        splitNodeTypes.forEach((splitType) => {
          let splitNode = splitNodesByType[splitType];
          if (!splitNode) {
            return;
          }
          while (t.isIdentifier(splitNode)) {
            const binding = programPath.scope.getBinding(splitNode.name);
            splitNode = binding == null ? void 0 : binding.path.node;
          }
          if (splitNode) {
            if (t.isFunctionDeclaration(splitNode)) {
              programPath.pushContainer(
                "body",
                t.variableDeclaration("const", [
                  t.variableDeclarator(
                    t.identifier(splitType),
                    t.functionExpression(
                      splitNode.id || null,
                      // Anonymize the function expression
                      splitNode.params,
                      splitNode.body,
                      splitNode.generator,
                      splitNode.async
                    )
                  )
                ])
              );
            } else if (t.isFunctionExpression(splitNode) || t.isArrowFunctionExpression(splitNode)) {
              programPath.pushContainer(
                "body",
                t.variableDeclaration("const", [
                  t.variableDeclarator(
                    t.identifier(splitType),
                    splitNode
                  )
                ])
              );
            } else if (t.isImportSpecifier(splitNode) || t.isImportDefaultSpecifier(splitNode)) {
              programPath.pushContainer(
                "body",
                t.variableDeclaration("const", [
                  t.variableDeclarator(
                    t.identifier(splitType),
                    splitNode.local
                  )
                ])
              );
            } else if (t.isCallExpression(splitNode)) {
              const outputSplitNodeCode = generate(splitNode).code;
              const splitNodeAst = babel__default.parse(outputSplitNodeCode);
              if (!splitNodeAst) {
                throw new Error(
                  `Failed to parse the generated code for "${splitType}" in the node type "${splitNode.type}"`
                );
              }
              const statement = splitNodeAst.program.body[0];
              if (!statement) {
                throw new Error(
                  `Failed to parse the generated code for "${splitType}" in the node type "${splitNode.type}" as no statement was found in the program body`
                );
              }
              if (t.isExpressionStatement(statement)) {
                const expression = statement.expression;
                programPath.pushContainer(
                  "body",
                  t.variableDeclaration("const", [
                    t.variableDeclarator(t.identifier(splitType), expression)
                  ])
                );
              } else {
                throw new Error(
                  `Unexpected expression type encounter for "${splitType}" in the node type "${splitNode.type}"`
                );
              }
            } else {
              console.info("Unexpected splitNode type:", splitNode);
              throw new Error(`Unexpected splitNode type ☝️: ${splitNode.type}`);
            }
          }
          programPath.node.body = programPath.node.body.filter((node) => {
            return node !== splitNode;
          });
          programPath.pushContainer("body", [
            t.exportNamedDeclaration(null, [
              t.exportSpecifier(
                t.identifier(splitType),
                t.identifier(splitType)
              )
            ])
          ]);
        });
        programPath.traverse({
          ExportNamedDeclaration(path) {
            if (path.node.declaration) {
              if (t.isVariableDeclaration(path.node.declaration)) {
                path.replaceWith(
                  t.importDeclaration(
                    path.node.declaration.declarations.map(
                      (decl) => t.importSpecifier(
                        t.identifier(decl.id.name),
                        t.identifier(decl.id.name)
                      )
                    ),
                    t.stringLiteral(
                      opts.filename.split(`?${splitPrefix}`)[0]
                    )
                  )
                );
              }
            }
          }
        });
      }
    }
  });
  deadCodeElimination(ast);
  return generate(ast, {
    sourceMaps: true,
    minified: process.env.NODE_ENV === "production"
  });
}
function getImportSpecifierAndPathFromLocalName(programPath, name) {
  let specifier = null;
  let path = null;
  programPath.traverse({
    ImportDeclaration(importPath) {
      const found = importPath.node.specifiers.find(
        (targetSpecifier) => targetSpecifier.local.name === name
      );
      if (found) {
        specifier = found;
        path = importPath.node.source.value;
      }
    }
  });
  return { specifier, path };
}
function resolveIdentifier(path, node) {
  if (t.isIdentifier(node)) {
    const binding = path.scope.getBinding(node.name);
    if (binding) {
      const declarator = binding.path.node;
      if (t.isObjectExpression(declarator.init)) {
        return declarator.init;
      } else if (t.isFunctionDeclaration(declarator.init)) {
        return declarator.init;
      }
    }
    return void 0;
  }
  return node;
}
function removeIdentifierLiteral(path, node) {
  if (t.isIdentifier(node)) {
    const binding = path.scope.getBinding(node.name);
    if (binding) {
      binding.path.remove();
    }
  }
}
export {
  compileCodeSplitReferenceRoute,
  compileCodeSplitVirtualRoute
};
//# sourceMappingURL=compilers.js.map
