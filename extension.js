// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')
const u = require('./src/utils.js')
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
			const _process = u.loadEnv({ vscode })
			const _code = u.getCode({ vscode })

			const credentials = {
				domain: _process.env.PROLIBU_ACCOUNT,
				apiKey: _process.env.PROLIBU_API_KEY,
				secrect: _process.env.PROLIBU_SECRET,
			}
			const { data } = await uploadToProlibu({ credentials, code: _code })
			vscode.window.showInformationMessage('Sync ' + data + '.')
			return true
		} catch (err) {
			vscode.window.showErrorMessage(err)
			return false
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
