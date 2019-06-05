"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
// import * as path from 'path';
const migrationFolder = Date.now();
const fs = require("fs");
const DBMigrate = require("db-migrate");
const projectName = vscode_1.workspace.rootPath;
function activate(context) {
    context.subscriptions.push(vscode_1.commands.registerCommand('samples.BoxInput', () => __awaiter(this, void 0, void 0, function* () {
        const numberTask = yield vscode_1.window.showInputBox({
            value: 'LW-',
            valueSelection: [3, 4],
            placeHolder: 'Number task'
        });
        createFileMigration(String(numberTask));
    })));
}
exports.activate = activate;
function createFileMigration(numberTask) {
    return __awaiter(this, void 0, void 0, function* () {
        const optionCwd = { cwd: projectName };
        const dbm = DBMigrate.getInstance(true, optionCwd, () => { });
        yield dbm.create(numberTask, migrationFolder);
        openFileUpSql(String(projectName), numberTask);
    });
}
exports.createFileMigration = createFileMigration;
function openFileUpSql(projectName, numberTask) {
    const path = projectName + '/migrations/' + migrationFolder + '/sqls';
    fs.readdir(path, (err, files) => {
        if (err) {
            vscode_1.window.showInformationMessage(path);
        }
        if (files) {
            let fileName = files.find(fileName => /-up\.sql/.test(fileName));
            if (fileName != undefined) {
                let pathFile = String(path + '\\' + fileName);
                vscode_1.workspace.openTextDocument(pathFile).then(doc => {
                    vscode_1.window.showTextDocument(doc);
                });
            }
            else {
                vscode_1.window.showInformationMessage('File is not found!');
            }
        }
    });
}
//# sourceMappingURL=extension.js.map