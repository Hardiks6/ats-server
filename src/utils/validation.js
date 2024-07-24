/**
 * Summary: This function is used to check if input is valid integer or not.
 * @param {*} input
 * @returns
 */

export const isValidInteger = (input) => {
    if (!isNumber(input) && !Number.isInteger(input) && (!Number.isInteger(parseInt(input)) || isNaN(parseInt(input))))
        return false;

        return true;
};

/**
 * Summary: This function is used to check if input is valid float or not.
 * @param {*} input
 * @returns
 */
export const isValidFloat = (input) => {
    if ((typeof input != 'number' && typeof parseFloat(input) != 'number') || isNaN(input))
        return false;

    return true;
};

/**
 * Summary: This function is used to check if input is valid string or not.
 * @param {*} input
 * @returns
 */
export const isValidString = (input) => {
    if (typeof input != "string" || input == "" || input == null || input == 'undefined' || typeof input == undefined)
        return false;

    return true;
};

/**
 * Summary: This function is used to check if input has valid data or not.
 * @param input
 * @returns {boolean}
 */
export const isValidValue = (input) => {
    if (input == "" || input == null || input == 'undefined' || typeof input == undefined)
        return false;

    return true;
};

/**
 * Summary: This function is used to check if input is valid date or not.
 * @param {*} input
 * @returns
 */
export const isValidDate = (input) => {
    if (typeof input != "string" || input == "" || input == null || input == 'undefined' || typeof input == undefined)
        return false;

    return true;
};

/**
 * Summary: This function is used to check if input is valid object or not.
 * @param {*} input
 * @returns
 */
export const isValidObject = (input) => {
    if (typeof input != 'object')
        return false;

    return true;
};

/**
 * Summary: This function is used to check if input object is empty or not.
 * @param {*} input
 * @returns
 */
export const isEmptyObject = (input) => {
    if (typeof input == 'object' && Object.keys(input).length < 1)
        return true;

    return false;
};

/**
 * Summary: This function is used to check if input is valid array or not.
 * @param {*} input
 * @returns
 */
export const isValidArray = (input) => {
    if (Array.isArray(input))
        return true;

    return false;
};

/**
 * Summary: This function is used to check if input array is empty or not.
 * @param {*} input
 * @returns
 */
export const isEmptyArray = (input) => {
    if (Array.isArray(input) && input.length < 1)
        return true;

    return false;
};

/**
 * Summary: This function is used to check if input is valid number or not.
 * @param {*} input
 * @returns
 */
export const isNumber = (input) => {
    return /^\d$/.test(input);
}

/**
 * Summary: This function is used to check if input is valid boolean or not.
 * @param {*} input
 * @returns
 */
export const isValidBoolean = (input) => {
    if (input == true || input == "true" || input == false || input == "false")
        return true;

    return false;
};

/**
 * Summary: This method is used to validate ABN number based on input.
 * @param {*} input
 * @returns
 */
export const isValidABN = (input) => {
    // Validate input data
    if (!input) return false;

    // Strip non-alphanumeric characters
    const abn = input.toString().replace(/[^a-z\d]/gi, "");

    // Set weights
    const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

    // Check if length is 11 digits
    if (abn.length !== 11) return false;

    // Apply ato check method
    let sum = 0;
    for (let position = 0; position < weights.length; position += 1) {
        const weight = weights[position];
        const digit = parseInt(abn[position], 10) - (position ? 0 : 1);
        sum += weight * digit;
    }

    // Get sum
    const checksum = sum % 89;

    // Return output
    return checksum == 0;
}

/**
 * Summary: This method is used to check if input is valid australian number or not.
 * @param {*} input
 * @returns
 */
export const isValidAustralianNumber = (input) => {
    // Validate input data
    if (!input) return false;

    // Regex for phone number
    var phoneno =
        /^\+(?:\+?(61))?[ ]?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

    // Validate phone number
    if (input.match(phoneno)) return true;
    else return false;
}

/**
 * Summary: This method is used to check if input is valid password or not.
 * @param {*} input
 * @returns
 */
export const isPasswordValid = (input) => {
    // Validate input data
    if (!input) return false;

    // Regex for valid password
    var password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&-:`^_()\[\]=,{}|; "<>~/\\\\])[A-Za-z\d@$#!%*?&-: "`^_()\[\]={}|~;,<>/\\\\]{8,}$/;
      

    // Validate password
    if (input.match(password)) return true;
    else return false;
}
