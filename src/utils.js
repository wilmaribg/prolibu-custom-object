const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

function isValidateEnvConfig(envParams) {
	if (!envParams['PROLIBU_SECRET']) return { msg: `Missing required key PROLIBU_SECRET in .env file` }
	if (!envParams['PROLIBU_ACCOUNT']) return { msg: `Missing required key PROLIBU_ACCOUNT in .env file` }
	if (!envParams['PROLIBU_API_KEY']) return { msg: `Missing required key PROLIBU_API_KEY in .env file` }
	return { isValid: true }
}

function loadEnv(context) {
  const { vscode } = context
  const rootPath = vscode.workspace.rootPath 
  const envPath = path.join(rootPath, '.env') 
  const envConfig = dotenv.parse(fs.readFileSync(envPath))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
  const { msg, isValid } = isValidateEnvConfig(process.env)
  if (!isValid) return vscode.window.showErrorMessage(msg)
  return process
}


function getCredentials(context) {
  const _env = loadEnv(context)
  return  {
    domain: _env.env.PROLIBU_ACCOUNT,
    apiKey: _env.env.PROLIBU_API_KEY,
    secrect: _env.env.PROLIBU_SECRET,
  }
}

function getCode (context) {
  const { model, controller, attributes } = context
  const code = []

  code.push({
    type: 'attributes',
    keyname: 'attributes',
    content: attributes
  })

  const modelKeys = Object.keys(model)
  for (let index = 0; index < modelKeys.length; index++) {
    const key = modelKeys[index]
    code.push({
      type: "model",
      keyname: key,
      content: 'moduleExport = ' + model[key].toString()
    })
  }
  const controllerKeys = Object.keys(controller)
  for (let index = 0; index < controllerKeys.length; index++) {
    const key = controllerKeys[index]
    code.push({
      type: "controller",
      keyname: key,
      content: 'moduleExport = ' + controller[key].toString()
    })
  }
  return code
}

module.exports = {
  getCode,
  loadEnv,
  getCredentials
}