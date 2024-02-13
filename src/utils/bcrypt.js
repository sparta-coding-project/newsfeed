import bcrypt from 'bcrypt';

const saltRound = 15

/**
 * encrypt PW
 * @param {String} pw 
 * @returns {String} hashed PW
 */
export const encryptPW = async (pw) => {
    return await bcrypt.hash(pw, saltRound)
}

/**
 * check PW
 * @param {String} pw 
 * @param {String} hash 
 * @returns {Boolean}
 */

export const checkPW = async (pw, hash) => {
    return await bcrypt.compare(pw, hash);
}