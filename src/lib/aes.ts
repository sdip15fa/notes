import CryptoJS from 'crypto-js'
export function encrypt(message = '', key = ''){
    const encryptedmessage = CryptoJS.AES.encrypt(message, key);
    return encryptedmessage.toString();
}
export function decrypt(message = '', key = ''){
    const code = CryptoJS.AES.decrypt(message, key);
    const decryptedMessage = code.toString(CryptoJS.enc.Utf8);
    return decryptedMessage;
}