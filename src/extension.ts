import * as vscode from "vscode";
import { spawn } from "child_process";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  let disposableAddPage = vscode.commands.registerCommand(
    "hygen-code-generator.addPage",
    (uri: vscode.Uri) => {
      generateCode("page", uri);
    }
  );

  let disposableAddComponent = vscode.commands.registerCommand(
    "hygen-code-generator.addComponent",
    (uri: vscode.Uri) => {
      generateCode("component", uri);
    }
  );

  context.subscriptions.push(disposableAddPage, disposableAddComponent);
}

function generateCode(type: "page" | "component", uri: vscode.Uri) {
  const targetPath = uri.fsPath;
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
  const workspaceRoot = workspaceFolder?.uri.fsPath || "";

  const relativeTargetPath = path.relative(workspaceRoot, targetPath);

  vscode.window
    .showInputBox({ prompt: `Enter the name of the ${type}:` })
    .then((name) => {
      if (!name) {
        vscode.window.showErrorMessage("Name is required.");
        return;
      }

      if (type === "component") {
        vscode.window
          .showQuickPick(["Yes", "No"], {
            placeHolder: "Will this component have nested files?",
          })
          .then((hasNested) => {
            if (hasNested === undefined) {
              return;
            }

            const hasNestedFlag = hasNested === "Yes";

            runHygenCommand(type, name, relativeTargetPath, {
              hasNested: hasNestedFlag,
            });
          });
      } else {
        runHygenCommand(type, name, relativeTargetPath);
      }
    });
}

function runHygenCommand(
  type: "page" | "component",
  name: string,
  targetPath: string,
  options: { hasNested?: boolean } = {}
) {
  // Use the path to 'hygen.js' directly from 'hygen' module
  const hygenPath = path.join(
    __dirname,
    "node_modules",
    "hygen",
    "bin",
    "hygen.js"
  );

  const args = [
    hygenPath,
    type,
    "new",
    "--name",
    name,
    "--routePath",
    targetPath,
    "--templates",
    path.join(__dirname, "_templates"),
  ];

  if (type === "component" && options.hasNested !== undefined) {
    args.push("--hasNested", options.hasNested ? "true" : "false");
  }

  const workspaceFolders = vscode.workspace.workspaceFolders;
  const workspaceRoot = workspaceFolders ? workspaceFolders[0].uri.fsPath : "";

  const hygenProcess = spawn(process.execPath, args, {
    cwd: workspaceRoot,
    stdio: "inherit",
  });

  hygenProcess.on("error", (error) => {
    vscode.window.showErrorMessage(`Hygen error: ${error.message}`);
  });

  hygenProcess.on("close", (code) => {
    if (code === 0) {
      vscode.window.showInformationMessage(
        `Successfully added ${type}: ${name}`
      );
    } else {
      vscode.window.showErrorMessage(`Hygen exited with code ${code}`);
    }
  });
}
