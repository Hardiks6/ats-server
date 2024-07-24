/**
 * This file is used to define method to validate data and handle error in middleware.
 */
import {validationResult} from 'express-validator';
import {middlewareValidationError} from "../utils/sendResponse";
import messageConstants from '../utils/messageConstants';
import statusCodes from '../utils/statusCodes';

/**
 * Summary: This works as middleware to handle validation result for specific request.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error = {};
        errors.array().map((err) => error[err.path] = err.msg);
        return middlewareValidationError(res, statusCodes.CODE_422, messageConstants.INVALID_PARAMETERS, error);
    }
    return next();
};