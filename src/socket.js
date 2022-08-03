
const vscode = require('vscode')
const io = require('socket.io-client')

module.exports = function ({ credentials }) {

  function subscribe ({ credential, outputChannel }) {
    const url = `ws://${credential.domain}`
    const accessToken = credential.apiKey
    const socket = io(url)

    socket.on('connect_error', (err, payload) => {
      console.log('roge socket connect_error --->', err, payload)
    })
    
    socket.on('connect', () => {
      console.log('roge socket connect --->')
    })

    /* execFile(chromium.path, [url], err => {
      console.log('Hello Google!', err);
    }) */

    /* console.log('credential ------>', credential)
    
    
    socket.on('connect_error', (err, payload) => {
      console.log('roge socket connect_error --->', err, payload)
    })

    socket.on('connect', () => {
      console.log('roge socket  connect --->')
      /* if (accessToken) {
        this.socketio.emit('authenticate', { accessToken })
        socket.on('debugTool', payload => {
          console.log('payload ------>', payload)
          outputChannel.show()
          outputChannel.appendLine('alkshsdv -----> iansusbds ---->')
        })
      } */ 
    // }) 
    // console.log(socket)
  }
  
  for (let i = 0; i < credentials.length; i++) {
    const credential = credentials[i]
    const outputChannel = vscode.window.createOutputChannel(credential.domain)
    outputChannel.appendLine(`subscribe socket to https://${credential.domain}`)
    subscribe({ credential, outputChannel })
  }
} 


