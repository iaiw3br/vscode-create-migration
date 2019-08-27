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
const fs = require("fs");
const DBMigrate = require("db-migrate");
const projectName = vscode_1.workspace.rootPath;
const confMigration = vscode_1.workspace.getConfiguration("CreateMigration");
const prefix = confMigration.get("prefixTask");
const autoRun = confMigration.get("autoRun");
function activate(context) {
    context.subscriptions.push(vscode_1.commands.registerCommand('samples.BoxInput', () => __awaiter(this, void 0, void 0, function* () {
        const numberTask = yield vscode_1.window.showInputBox({
            value: `${prefix}`,
            valueSelection: [3, 4],
            placeHolder: 'Number task'
        });
        if (numberTask != undefined) {
            createFileMigration(String(numberTask));
        }
        else {
            vscode_1.window.showInformationMessage('Migration not created');
        }
    })));
}
exports.activate = activate;
function createFileMigration(numberTask) {
    return __awaiter(this, void 0, void 0, function* () {
        const optionCwd = { cwd: projectName };
        const dbm = DBMigrate.getInstance(true, optionCwd, () => { });
        yield dbm.create(numberTask);
        if (autoRun) {
            DBMigrateUp();
        }
        openFileUpSql();
    });
}
exports.createFileMigration = createFileMigration;
function DBMigrateUp() {
    return __awaiter(this, void 0, void 0, function* () {
        const driver = confMigration.get("driver");
        const database = confMigration.get("dataBase");
        const host = confMigration.get("host");
        const user = confMigration.get("user");
        const password = confMigration.get("password");
        const dbmigrate = DBMigrate.getInstance(true, {
            config: {
                dev: {
                    driver,
                    database,
                    host,
                    password,
                    user,
                    multipleStatements: true
                },
            },
            cwd: projectName
        }, () => { });
        yield dbmigrate.up();
    });
}
function openFileUpSql() {
    const pathSql = projectName + '/migrations/sqls';
    fs.readdir(pathSql, (err, files) => {
        if (files) {
            for (let i = files.length - 1; i >= 0; i--) {
                let fileName = /-up\.sql/.test(files[i]);
                if (fileName) {
                    let pathFile = String(pathSql + '/' + files[i]);
                    vscode_1.workspace.openTextDocument(pathFile).then(doc => {
                        vscode_1.window.showTextDocument(doc);
                    });
                    break;
                }
            }
        }
    });
}
//# sourceMappingURL=extension.js.map