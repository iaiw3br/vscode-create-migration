/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtensionContext, commands, window, workspace } from 'vscode';
import * as fs from 'fs';
import DBMigrate = require('db-migrate');

const projectName = workspace.rootPath;
const confMigration = workspace.getConfiguration("CreateMigration");
const prefix = confMigration.get("prefixTask");
const autoRun = confMigration.get("autoRun");

export function activate(context: ExtensionContext) {
	context.subscriptions.push(commands.registerCommand('samples.BoxInput', async () => {
		const numberTask = await window.showInputBox({
			value: `${prefix}`,
			valueSelection: [3, 4],
			placeHolder: 'Number task'
		});

		if (numberTask != undefined) {
			createFileMigration(String(numberTask));
		} else {
			window.showInformationMessage('Migration not created');
		}

	}));
}

export async function createFileMigration(numberTask: string) {

	const optionCwd = { cwd: projectName };
	const dbm = DBMigrate.getInstance(true, optionCwd, () => {});
	
	await dbm.create(numberTask);

	if ( autoRun ) {
		DBMigrateUp();
	}

	openFileUpSql();
}

async function DBMigrateUp() {

	const driver = confMigration.get("driver");
	const database = confMigration.get("dataBase");
	const host = confMigration.get("host");
	const user = confMigration.get("user");
	const password = confMigration.get("password");

	const dbmigrate = DBMigrate.getInstance(true, {
		config: {
			dev:{
				driver,
				database,
				host,
				password,
				user,
				multipleStatements: true
			},
		},
		cwd: projectName
	}, () => {});

	await dbmigrate.up()
	
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
