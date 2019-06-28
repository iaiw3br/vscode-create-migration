/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtensionContext, commands, window, workspace } from 'vscode';
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
		
		if ( numberTask != undefined ) { 
			createFileMigration(String(numberTask));
		} else {
			window.showInformationMessage('Migration not created');
		}
		
	}));
}

export async function createFileMigration(numberTask: string) {

	const optionCwd = { cwd: projectName };
	const dbm = DBMigrate.getInstance(true, optionCwd, () => { });
	await dbm.create(numberTask);
	openFileUpSql();
}

function openFileUpSql() {

	const pathSql = projectName + '/migrations/sqls';

	fs.readdir(pathSql, (err: Error, files: string[]) => {

		if (files) {
			for (let i = files.length - 1; i >= 0; i--) {
				let fileName = /-up\.sql/.test(files[i])

				if (fileName) {
					let pathFile = String(pathSql + '/' + files[i]);
					workspace.openTextDocument(pathFile).then(doc => {
						window.showTextDocument(doc);
					});
					break;
				}
			}
		}
	});
}
