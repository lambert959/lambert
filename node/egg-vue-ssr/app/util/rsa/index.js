const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

function generateKeys () {
  try {
    if (fs.readFileSync(path.resolve(__dirname, './private.cer'))) return
  } catch (e) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicExponent: 0x10001,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8', // 用于存储私钥信息的标准语法标准
        format: 'pem', // base64 编码的 DER 证书格式
        cipher: 'aes-256-cbc', // 加密算法和操作模式
        passphrase: ''
      }
    })
    // console.log(privateKey)
    fs.writeFileSync(path.resolve(__dirname, './private.cer'), privateKey)
    fs.writeFileSync(path.resolve(__dirname, './public.cer'), publicKey)
    console.log('生成密钥....')
  }
}

function encrypt (plain) {
  const publicKey = fs.readFileSync(path.resolve(__dirname, './public.cer'), 'utf8')
  const buffer = Buffer.from(plain, 'utf8')
  return crypto.publicEncrypt({
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_PADDING
  }, buffer).toString('base64')
}

function decrypt (cipher) {
  const privateKey = fs.readFileSync(path.resolve(__dirname, './private.cer'), 'utf8')
  const buffer = Buffer.from(cipher, 'base64')
  const plain = crypto.privateDecrypt({
    key: privateKey.toString(),
    padding: crypto.constants.RSA_PKCS1_PADDING,
    passphrase: ''
  }, buffer)
  return plain.toString('utf8')
}

module.exports = {
  generateKeys,
  encrypt,
  decrypt
}
