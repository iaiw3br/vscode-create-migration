/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtensionContext, commands, window, workspace } from 'vscode';
// import * as path from 'path';
const migrationFolder = Date.now();
import * as fs from 'fs';
import DBMigrate = require('db-migrate');
const projectName = workspace.rootPath;


export function activate(context: ExtensionContext) {
	context.subscriptions.push(commands.registerCommand('samples.BoxInput', async () => {
		const numberTask = await window.showInputBox({
			value: 'LW-',
			valueSelection: [3, 4],
			placeHolder: 'Number task'
		});
		createFileMigration(String(numberTask));
	}));
}

export async function createFileMigration(numberTask: string) {

	const optionCwd = { cwd: projectName };
	const dbm = DBMigrate.getInstance(true, optionCwd, () => { });
	await dbm.create(numberTask, migrationFolder);
	openFileUpSql(String(projectName), numberTask);
}

function openFileUpSql(projectName: string, numberTask: string) {

	const path = projectName + '/migrations/' + migrationFolder + '/sqls';

	fs.readdir(path, (err: Error, files: string[]) => {

		if (err) {
			window.showInformationMessage(path);
		}
		if (files) {
			let fileName = files.find(fileName =>
				/-up\.sql/.test(fileName)
			);

			if (fileName != undefined) {
				let pathFile = String(path + '\\' + fileName);
				workspace.openTextDocument(pathFile).then(doc => {
					window.showTextDocument(doc);
				});
			} else {
				window.showInformationMessage('File is not found!');
			}
		}
	});
}
