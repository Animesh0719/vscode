/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { makeUniversalApp } from 'vscode-universal';
import * as path from 'path';
import * as product from '../../product.json';

async function main() {
	const buildDir = process.env['AGENT_BUILDDIRECTORY'];
	const arch = process.env['VSCODE_ARCH'];

	if (!buildDir) {
		throw new Error('$AGENT_BUILDDIRECTORY not set');
	}

	const appName = product.nameLong + '.app';
	const x64AppPath = path.join(buildDir, 'vscode-x64', appName);
	const arm64AppPath = path.join(buildDir, 'vscode-arm64', appName);
	const x64AsarPath = path.join(x64AppPath, 'Contents', 'Resources', 'app', 'node_modules.asar');
	const arm64AsarPath = path.join(arm64AppPath, 'Contents', 'Resources', 'app', 'node_modules.asar');
	const outAppPath = path.join(buildDir, `VSCode-darwin-${arch}`, appName);

	await makeUniversalApp({
		x64AppPath,
		arm64AppPath,
		x64AsarPath,
		arm64AsarPath,
		filesToSkip: [
			'product.json',
			'Credits.rtf',
			'CodeResources',
			'fsevents.node'
		],
		outAppPath,
		force: true
	});
}

if (require.main === module) {
	main().catch(err => {
		console.error(err);
		process.exit(1);
	});
}