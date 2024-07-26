import { check, body, validationResult } from "express-validator";
import messageConstants from "../utils/messageConstants";

/**
 * Summary: This method used to validate the auth module APIs requests data
 * @param input
 * @returns
 */
export const authValidator = (input) => {
    switch (input) {
        case "login": {
            return [
                check("email").not().trim().isEmpty().withMessage(messageConstants.EMAIL_REQUIRED).escape().isEmail().withMessage(messageConstants.EMAIL_REQUIRED),
                check("password").not().trim().isEmpty().escape().withMessage(messageConstants.PASSWORD_REQUIRED).withMessage(messageConstants.PASSWORD_REQUIRED),
                check("client_id").not().trim().isEmpty().withMessage(messageConstants.CLIENT_ID_REQUIRED),
                check("client_secret").not().trim().isEmpty().withMessage(messageConstants.CLIENT_SECRET_REQUIRED),
            ];
        }
        case "forgotPassword": {
            return [
                check("email").not().trim().isEmpty().withMessage(messageConstants.EMAIL_REQUIRED).escape().isEmail().withMessage(messageConstants.EMAIL_REQUIRED),
            ];
        }
        case "resetPassword": {
            return [
                check("token").not().trim().isEmpty().withMessage(messageConstants.TOKEN_REQUIRED),
                check("password").not().trim().isEmpty().escape().withMessage(messageConstants.PASSWORD_REQUIRED).isLength({ min: 8 }).withMessage(messageConstants.PASSWORD_MINIMUM_REQUIRED),
            ];
        }
        case "changePassword": {
            return [
                check("email").not().trim().isEmpty().withMessage(messageConstants.EMAIL_REQUIRED).escape().isEmail().withMessage(messageConstants.EMAIL_REQUIRED),
                check("client_id").not().trim().isEmpty().withMessage(messageConstants.CLIENT_ID_REQUIRED),
                check("client_secret").not().trim().isEmpty().withMessage(messageConstants.CLIENT_SECRET_REQUIRED),
            ];
        }
        // case "register": {
        //     return [
        //         check("application_role_id").not().trim().isEmpty().withMessage(messageConstants.APPLICATION_ROLE_NOT_FOUND).custom((value, { req }) => {
        //             req.validationErrors = req.validationErrors || [];
        //             if (value == 1) {
        //                 if (!req.body.email) req.validationErrors.push({ param: "email", msg: "Email field required for customer" });
        //                 if (!req.body.password) req.validationErrors.push({ param: "password", msg: "Password field required for customer" });
        //                 if (!req.body.name) req.validationErrors.push({ param: "name", msg: "Name field required for customer" });
        //                 if (!req.body.contact_number) req.validationErrors.push({ param: "contact_number", msg: "Mobile number is required for customer" });
        //                 if (!req.body.status) req.validationErrors.push({ param: "status", msg: "Status field required for customer" });
        //                 // if (!req.body.address_line_1) req.validationErrors.push({ param: "address_line_1", msg: "Address field required for customer" });
        //             } else if (value == 2) {
        //                 if (!req.body.email) req.validationErrors.push({ param: "email", msg: "Email field required for washer" });
        //                 if (!req.body.password) req.validationErrors.push({ param: "password", msg: "Password field required for washer" });
        //                 if (!req.body.name) req.validationErrors.push({ param: "name", msg: "Name field required for washer" });
        //                 if (!req.body.contact_number) req.validationErrors.push({ param: "contact_number", msg: "Mobile number is required for washer" });
        //                 // if (!req.body.address_line_1) req.validationErrors.push({ param: "address_line_1", msg: "Address field required for washer" });
        //                 // if (!req.body.abn) req.validationErrors.push({ param: "abn", msg: "ABN field required for washer" });
        //                 // if (!req.body.bank_id) req.validationErrors.push({ param: "bank_id", msg: "BSB field required for washer" });
        //                 // if (!req.body.account_name) req.validationErrors.push({ param: "account_name", msg: "Account name field required for washer" });
        //                 // if (!req.body.account_number) req.validationErrors.push({ param: "account_number", msg: "Account number field required for washer" });
        //             } else if (value == 3) {
        //                 if (!req.body.email) req.validationErrors.push({ param: "email", msg: "Email field required for admin" });
        //                 if (!req.body.password) req.validationErrors.push({ param: "password", msg: "Password field required for admin" });
        //                 if (!req.body.name) req.validationErrors.push({ param: "name", msg: "Name field required for admin" });
        //                 if (!req.body.contact_number) req.validationErrors.push({ param: "contact_number", msg: "Mobile number is required for admin" });
        //             }
        //             return true;
        //         }),
        //     ];
        // }
        case "register": {
            return [
                check("email").not().trim().isEmpty().withMessage(messageConstants.EMAIL_REQUIRED),
                check("password").not().trim().isEmpty().withMessage(messageConstants.PASSWORD_REQUIRED),
                check("name").not().trim().isEmpty().withMessage(messageConstants.NAME_REQUIRED),
                check("status").not().trim().isEmpty().withMessage(messageConstants.STATUS_REQUIRED),
                check("profile_iamge").not().isEmpty().withMessage(messageConstants.PROFILE_IMAGE_REQUIRED),
                check("application_role_id").not().trim().isEmpty().withMessage(messageConstants.APPLICATION_ID_REQUIRED),
            ];
        }
        default:
            return [];
    }
};

// Middleware to format errors
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty() || (req.validationErrors && req.validationErrors.length > 0)) {
        const allErrors = errors.array().concat(req.validationErrors || []);
        return res.status(422).json({
            status: false,
            code: 422,
            message: allErrors.map(error => error.msg).join(", "),
            data: allErrors.map(error => ({
                field: error.param,
                message: error.msg
            }))
        });
    }
    next();
};
