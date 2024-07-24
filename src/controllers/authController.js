import { AuthService } from "../services/authService";
import { frontSendErrorResponse, frontSendSuccessResponse } from "../utils/sendResponse";

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
}