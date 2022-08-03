// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')
const fs = require('fs')
const { requireFromString } = require('module-from-string')
const u = require('./src/utils.js')
const socket = require('./src/socket.js')
const uploadToProlibu = require('./src/upload.js')
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "prolibu-custom-object" is now active!')
	let syncController = vscode.commands.registerCommand('prolibu-custom-object.syncController', async function () {
		try {
			let wfolder = vscode.workspace.workspaceFolders[0]
			let modelUri = vscode.Uri.joinPath(wfolder.uri, 'model.js')
			let controllerUri = vscode.Uri.joinPath(wfolder.uri, 'controller.js')
			let attributesUri = vscode.Uri.joinPath(wfolder.uri, 'attributes.json')

			if (!fs.existsSync(modelUri.fsPath)) return vscode.window.showErrorMessage('Please create file model.js in root folder')
			if (!fs.existsSync(controllerUri.fsPath)) return vscode.window.showErrorMessage('Please create file controller.js in root folder')
			if (!fs.existsSync(attributesUri.fsPath)) return vscode.window.showErrorMessage('Please create file attributes.json in root folder')

			let modelContent = Buffer.from(await vscode.workspace.fs.readFile(modelUri)).toString('utf8')
			let controllerContent = Buffer.from(await vscode.workspace.fs.readFile(controllerUri)).toString('utf8')
			let attributesContent = Buffer.from(await vscode.workspace.fs.readFile(attributesUri)).toString('utf8')

			if (!/module\.exports[ ]*=[ ]*{/g.test(modelContent)) return vscode.window.showErrorMessage('Please exposed as a module your file model.js using module.exports')
			if (!/module\.exports[ ]*=[ ]*{/g.test(controllerContent)) return vscode.window.showErrorMessage('Please exposed as a module your file controller.js using module.exports')

			let model = requireFromString(modelContent)
			let controller = requireFromString(controllerContent)
			let attributes = attributesContent

			let credentials = u.getCredentials({ vscode })
			let code = u.getCode({ vscode, model, controller, attributes })

			socket({ credentials })

			let result = null

			if (Array.isArray(credentials)) {
				const dataList = []
				for (let index = 0; index < credentials.length; index++) {
					let { data } = await uploadToProlibu({ credentials: credentials[index], code })
					vscode.window.showInformationMessage(data.toString())
					dataList.push(data)
				}
				result = dataList
			} else {
				let { data } = await uploadToProlibu({ credentials, code })
				result = data
			}

			setTimeout(() => {
				vscode.window.showInformationMessage('Sync ' + result.toString() + '.')
			}, 15000);
		} catch (err) {
			vscode.window.showErrorMessage(err)
		}
	
	})
	context.subscriptions.push(syncController)
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
