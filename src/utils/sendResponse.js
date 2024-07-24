import { isEmptyObject, isValidObject } from "./validation";
import messageConstants from "./messageConstants";

/**
 * Summary: This function will return form of service error response. This is used to return response from service to controller so that response from service can easily managed.
 * @param errorMessage
 * @param data
 * @returns {*}
 */
export const frontServiceErrorResponse = (message, data = null, code = null) => {
    return responseModal(false, code, message, data);
}

/**
 * Summary: This function will send success response to API call.
 * @param res
 * @param code
 * @param data
 * @param message
 * @returns {*}
 */
export const frontSendSuccessResponse = (res, code, data, message = "Successful") => {
    return res.status(code).send(responseModalSuccess(true, code, message, data));
}

/**
 * Summary: This function will send error response to API call from front.
 * @param res
 * @param code
 * @param errorMessage
 * @param data
 * @returns {*}
 */
export const frontSendErrorResponse = (res, code, errorMessage, data = null) => {
    return res.status(code).send(responseModal(false, code, errorMessage, data));
}

/**
 * Summary: This function will send error response to API call from front.
 * @param req
 * @param res
 * @param data
 * @returns {*}
 */
export const setPaginationResponseHeader = (res, requestQueryParams, data) => {
    var pageSize = requestQueryParams.pageSize ? requestQueryParams.pageSize : data.pageSize;
    res.set({
        "X-Pagination-Current-Page": data.page ? data.page : 1,
        "X-Pagination-Page-Count": data.totalCount && pageSize ? Math.ceil(data.totalCount / pageSize) : 1,
        "X-Pagination-Per-Page": pageSize ? pageSize: 10,
        "X-Pagination-Total-Count": data.totalCount
    });
    res.header('Access-Control-Expose-Headers', 'X-Pagination-Per-Page, X-Pagination-Current-Page, X-Pagination-Total-Count , X-Pagination-Page-Count'); // Add the headers you want to expose
}

/**
 * Summary: THis function will be used to parse the error message and set the message in string format
 * @param error
 * @returns {string|{}|*}
 */
export const handleTryCatchError = (error) => {
    if (isValidObject(error) && !isEmptyObject(error) && error.name && error.name == "ValidationError") { // Validation through by mongoose
        let errors = {};

        // Go through each error and manage error array
        Object.keys(error.errors).forEach((key) => {
            errors[key] = error.errors[key].message;
        });

        return errors;
    } else if (error && error.name &&
        (error.name == "SequelizeValidationError" ||
            error.name === "SequelizeUniqueConstraintError" ||
            error.name === "SequelizeForeignKeyConstraintError")
    ) {
        return error.errors.map((e) => e.messages);
    } else if (isValidObject(error) && !isEmptyObject(error) && error.name != null && error.name != 'undefined') { // Handle error when some error with name property there
        return messageConstants.COULD_NOT_PERFORM_ACTION;
    } else {
        return error;
    }
}

/**
 * Summary: THis function will used to set the comman response format for all type of responses
 * @param status
 * @param code
 * @param message
 * @param data
 * @returns {{code: *, data: *, message: (string|{}|*), status: *}}
 */
export const responseModal = (status, code, message, data = null) => {
    return {
        status: status,
        code: code,
        message: handleTryCatchError(message),
        data: data
    }
}

export const responseModalSuccess = (status, code, message, data = null) => {
    return {
        status: status,
        code: code,
        message: message,
        data: data
    }
}

/**
 * Summary: This function will be used to handle the validation of API request parameters data
 * @param res
 * @param code
 * @param errorMessage
 * @param data
 * @returns {*}
 */
export const middlewareValidationError = (res, code, errorMessage, data = null) => {
    const errorData = [];

    // Set error in errorData

    if (isValidObject(data) && !isEmptyObject(data)) {
        Object.keys(data).forEach((ele) => {
            errorData.push({ field: ele, message: data[ele] });
        })
    }
    // Set response
    var resData = {
        status: false,
        code: code,
        message: errorData.map(error => error.message).join(', '),
        data: errorData
    };

    // Send response
    return res.status(code).send(resData);
};
