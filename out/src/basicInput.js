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
const vscode = require("vscode");
const DBMigrate = require('db-migrate');
const path = require('path');
const fs = require('fs');
// nameFolder need to add this place file migration
const migrationFolder = Date.now();
// __dirname : C:\TheBestPluginInTheWorld\out
// path.dirname(__dirname) : C:\TheBestPluginInTheWorld
const projectName = path.dirname(__dirname);
function showInputBox() {
    return __awaiter(this, void 0, void 0, function* () {
        const numberTask = yield vscode.window.showInputBox({
            value: 'LW-',
            valueSelection: [3, 4],
            placeHolder: 'Number task'
        });
        createFileMigration(String(numberTask));
    });
}
exports.showInputBox = showInputBox;
function createFileMigration(numberTask) {
    return __awaiter(this, void 0, void 0, function* () {
        // cwd = place, where is folder Migrations
        const optionCwd = { cwd: projectName };
        const dbm = DBMigrate.getInstance(true, optionCwd);
        yield dbm.create(`${numberTask}`, migrationFolder);
        openFileUpSql(projectName, migrationFolder);
    });
}
exports.createFileMigration = createFileMigration;
function openFileUpSql(projectName, migrationFolder) {
    const pathFolder = projectName + '//migrations//' + migrationFolder + '//sqls';
    fs.readdir(pathFolder, (err, files) => {
        let fileName = files.find(fileName => /-up\.sql/.test(fileName));
        if (fileName != undefined) {
            let pathFile = String(pathFolder + '//' + fileName);
            vscode.workspace.openTextDocument(pathFile).then(doc => {
                vscode.window.showTextDocument(doc);
            });
        }
        else {
            vscode.window.showInformationMessage('File is not found');
        }
    });
}
//# sourceMappingURL=basicInput.js.map