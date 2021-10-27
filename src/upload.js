const axios = require('axios').default

module.exports = async function name(params) {
  try {
    const { credentials, code } = params
    const url = `https://${credentials.domain}/v1/customApi/register`
    const headers = { 
      'x-prlbu-secret': credentials.secrect,
      'authorization': 'Bearer ' + credentials.apiKey,
    }
    return await axios.post(url, code, { headers })
  } catch (err) {
    throw err
  }
}