import crypto from 'crypto';

/**
 * This function will create a password hash we will decrypt passowrd to random string
 * @param string
 * @returns {string}
 */
export const hash = (string) => crypto.createHash('sha256').update(string).digest('base64');

/**
 * This function will compare hash string which we have created
 * @param first_item
 * @param second_item
 * @returns {boolean}
 */
export const hash_compare = (first_item, second_item) => Object.is(first_item, second_item);
