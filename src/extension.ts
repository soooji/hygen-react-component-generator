import * as vscode from "vscode";
import { exec } from "child_process";
import * as path from "path";
import hygen from "hygen";
import { spawn } from "child_process";

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
  // Get the path of the selected directory
  const targetPath = uri.fsPath;

  // Get the relative path from the workspace root
  const workspaceRoot = vscode.workspace.rootPath || "";
  const relativeTargetPath = path.relative(workspaceRoot, targetPath);

  // Prompt the user for the name
  vscode.window
    .showInputBox({ prompt: `Enter the name of the ${type}:` })
    .then((name) => {
      if (!name) {
        vscode.window.showErrorMessage("Name is required.");
        return;
      }

      if (type === "component") {
        // Prompt for 'hasNested'
        vscode.window
          .showQuickPick(["Yes", "No"], {
            placeHolder: "Will this component have nested files?",
          })
          .then((hasNested) => {
            if (hasNested === undefined) {
              return;
            }

            const hasNestedFlag = hasNested === "Yes";

            // Run Hygen command
            runHygenCommand(type, name, relativeTargetPath, {
              hasNested: hasNestedFlag,
            });
          });
      } else {
        // For pages
        // Run Hygen command
        runHygenCommand(type, name, relativeTargetPath);
      }
    });
}
function runHygenCommand(
  type: "page" | "component",
  name: string,
  targetPath: string,
  options: any = {}
) {
  // Path to the local hygen binary
  const hygenPath = path.join(__dirname, "..", "node_modules", ".bin", "hygen");

  // Build the arguments array
  const args = [
    type,
    "new",
    "--name",
    name,
    "--routePath",
    targetPath,
    "--templates",
    path.join(__dirname, "..", "_templates"),
  ];

  if (type === "component" && options.hasNested !== undefined) {
    args.push("--hasNested", options.hasNested);
  }

  // Execute hygen as a child process
  const hygenProcess = spawn(hygenPath, args, {
    cwd: vscode.workspace.rootPath,
    stdio: "inherit",
    shell: true,
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

function buildHygenCommand(
  type: "page" | "component",
  name: string,
  targetPath: string,
  options: any
) {
  // Escape spaces in paths
  const escapedTargetPath = targetPath.replace(/(\s+)/g, "\\$1");

  // Relative path from the workspace root
  const relativeTargetPath = path.relative(
    vscode.workspace.rootPath || "",
    escapedTargetPath
  );

  // Build the command with arguments
  let cmd = `hygen ${type} new --name "${name}" --routePath "${relativeTargetPath}"`;

  if (type === "component" && options.hasNested !== undefined) {
    cmd += ` --hasNested ${options.hasNested}`;
  }

  return cmd;
}
