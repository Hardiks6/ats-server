import { AuthService } from "../services/authService";
import { frontSendErrorResponse, frontSendSuccessResponse } from "../utils/sendResponse";
import messageConstants from "../utils/messageConstants";
import statusCodes from "../utils/statusCodes";
import { isValidString } from "../utils/validation";

const authService = new AuthService();

export class AuthController {

    /**
    * Summary: This method is used to login user into system.
    * @param {*} req 
    * @param {*} res 
    */
    async login(req, res) {
        try {
            // Call service to login user and handle response
            var output = await authService.login(req, res);

            if (output == null) {
                return frontSendErrorResponse(res, statusCodes.CODE_500, messageConstants.COULD_NOT_PERFORM_ACTION);
            }

            if (output["status"] == false) {
                return frontSendErrorResponse(res, output["code"], output["message"]);
            }

            return frontSendSuccessResponse(res, output["code"], output["data"], output["message"]);

        } catch (e) {
            console.log("e #22050636", e);
            return frontSendErrorResponse(res, statusCodes.CODE_500, messageConstants.COULD_NOT_PERFORM_ACTION);
        }
    }
    /**
    * Summary: This function is used for the forgot password
    * @param {*} req
    * @param {*} res
    * @returns
    */
    async forgotPassword(req, res) {
        var input = req.body;
        try {
            if (input == null || !isValidString(input.email)) {
                return frontSendErrorResponse(res, statusCodes.CODE_422, messageConstants.INVALID_PARAMETERS);
            }
            var output = await authService.forgotPassword(req, res);
            if (output == null)
                return frontSendErrorResponse(res, statusCodes.CODE_500, messageConstants.COULD_NOT_PERFORM_ACTION);

            if (output["status"] == false)
                return frontSendErrorResponse(res, output["code"], output["message"]);

            // Return response
            return frontSendSuccessResponse(res, output["code"], output["data"], output["message"]);

        } catch (e) {
            console.log('e', e);
            return frontSendErrorResponse(res, statusCodes.CODE_500, messageConstants.COULD_NOT_PERFORM_ACTION);
        }
    }
    /**
    * Summary: This function is used for the resend OTP
    * @param {*} req
    * @param {*} res
    * @returns
    */
    async resendOTP(req, res) {
        var input = req.body;
        try {
            if (input == null || !isValidString(input.email)) {
                return frontSendErrorResponse(res, statusCodes.CODE_422, messageConstants.INVALID_PARAMETERS);
            }
            var output = await authService.resendOTP(req, res);
            if (output == null)
                return frontSendErrorResponse(res, statusCodes.CODE_500, messageConstants.COULD_NOT_PERFORM_ACTION);

            if (output["status"] == false)
                return frontSendErrorResponse(res, output["code"], output["message"]);

            // Return response
            return frontSendSuccessResponse(res, output["code"], output["data"], output["message"]);

        } catch (e) {
            return frontSendErrorResponse(res, statusCodes.CODE_500, messageConstants.COULD_NOT_PERFORM_ACTION);
        }
    }
    /**
    * Summary: This function is used for the reset new password
    * @param {*} req
    * @param {*} res
    * @returns
    */
    async resetPassword(req, res) {
        try {
            const { token } = req.body;

            if (!token) {
                return frontSendErrorResponse(res, statusCodes.CODE_422, messageConstants.INVALID_PARAMETERS);
            }

            const output = await authService.resetPassword(req, res);

            if (!output) {
                return frontSendErrorResponse(res, statusCodes.CODE_500, messageConstants.COULD_NOT_PERFORM_ACTION);
            }

            if (!output.status) {
                return frontSendErrorResponse(res, output.code, output.message);
            }

            return frontSendSuccessResponse(res, output.code, output.data, output.message);
        } catch (e) {
            return frontSendErrorResponse(res, statusCodes.CODE_500, messageConstants.COULD_NOT_PERFORM_ACTION);
        }
    }
    /**
    * Summary: This method is used to Register A New user into system.
    * @param {*} req 
    * @param {*} res 
    */
    async register(req, res) {
        try {
            const response = await authService.register(req, res);

            if (response.success) {
                return frontSendSuccessResponse(res, response.code, response.message, response.data);
            } else {
                return frontSendErrorResponse(res, response.code, response.message);
            }
        } catch (e) {
            // console.log("Regiter", e);
            return frontSendErrorResponse(res, statusCodes.CODE_500, messageConstants.COULD_NOT_PERFORM_ACTION);
        }
    }


}