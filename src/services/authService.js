import { responseModal, frontSendErrorResponse } from "../utils/sendResponse";
import statusCodes from "../utils/statusCodes";
import models from "../models";
import messageConstants from "../utils/messageConstants";
import { hash, hash_compare } from "../utils/hashing";
import { isValidInteger, isValidString } from "../utils/validation"
import { userTable } from "../utils/tableEnums";
import sendEmail from "../utils/sendEmail";
import { Sequelize } from "sequelize";
import random from "../utils/random";


const Op = Sequelize.Op;
const { users, application_roles, applications } = models;

export class AuthService {
    /**
     * Summary: This method is used to log admin user in to the system.
     * @param req
     * @param res
     * @returns {Promise<{tokens: {token: undefined|*, refreshToken: undefined|*}, user: Model | Attributes<M>}|*>}
     */
    async login(req, res) {
        try {
            var input = req.body;
            const { email, password, client_id, client_secret } = input;
            let options = { email: email.toLowerCase().trim(), deletedAt: null, }
            let includes = [{
                model: application_roles,
                as: 'application_roles',
                include: [
                    {
                        model: applications,
                        as: 'applications',
                        where: { client_id: client_id, client_secret: client_secret },
                    }
                ]
            }];

            let user = await users.findOne({
                where: options,
                include: includes,
            });

            if (user == null) {
                return responseModal(false, statusCodes.CODE_404, messageConstants.USER_DOES_NOT_EXISTS);
            }

            if (user['status'] == userTable.USER_STATUS_IN_ACTIVE) {
                return responseModal(false, statusCodes.CODE_401, messageConstants.USER_ACCOUNT_NOT_ACTIVATED);
            }

            if (user && !user.application_roles) {
                return responseModal(false, statusCodes.CODE_401, messageConstants.INVALID_CLIENT_ID_OR_CLIENT_SECRET);
            }

            const checkPassword = hash_compare(hash(password), user.password);

            if (!checkPassword) {
                return responseModal(false, statusCodes.CODE_401, messageConstants.INCORRECT_PASSWORD);
            }
            const expireTime = input.keep_me_login ? {} : { expiresIn: "24h" }
            const tokens = await user.generateJWT(expireTime);

            var newToken = {
                user_id: user.id,
                token: tokens.token
            };

            // await user_device_infos.create(newToken);

            return responseModal(true, statusCodes.CODE_200, messageConstants.LOGIN_SUCCESSFULLY, { user: user.toJSON(), tokens });

        } catch (e) {
            console.log(e);
            // Return error response
            return responseModal(false, statusCodes.CODE_500, e);
        }
    }
    /**
     * Summary: This method is used to generate the OTP
     * @param {*} length 
     * @returns 
     */
    async generateOTP(length = 8) {
        const digits = '0123456789';
        let otp = '';
        for (let i = 0; i < length; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }
        return otp;
    }
    /**
    * Summary: This method is used to forgot password mail sent by email
    * @param {*} req
    * @param {*} res
    * @returns 
    */
    async forgotPassword(req, res) {
        try {
            var input = req.body;
            const { email } = input;

            let options = { email: email.toLowerCase().trim(), deletedAt: null, }

            // Get user by email
            const userDetails = await users.findOne({
                where: options,
            });

            if (userDetails == null) {
                return responseModal(false, statusCodes.CODE_404, messageConstants.USER_DOES_NOT_EXISTS_FORGOT);
            }

            if (userDetails['status'] == userTable.USER_STATUS_IN_ACTIVE) {
                return responseModal(false, statusCodes.CODE_403, messageConstants.USER_ACCOUNT_NOT_ACTIVATED);
            }

            const roleId = userDetails.application_role_id;
            let sendEmailData = {
                subject: messageConstants.EMAIL_FORGOT_PASSWORD_VERIFY_ACCOUNT,
                templateName: "forgot-password-verification-template.ejs",
                emailToUser: userDetails.email
            };
            const plainTextToken = random(40);
            const link = process.env.SITE_REDIRECT_URL + "/reset-password?email=" + userDetails.dataValues.email + "&token=" + plainTextToken;
            let emailTemplateReplaceData = {};
            emailTemplateReplaceData["name"] = userDetails.dataValues.name;
            emailTemplateReplaceData["link"] = link;
            sendEmail.generateHtmlForEmail(sendEmailData, emailTemplateReplaceData);

            await users.update({ reset_password_token: plainTextToken }, {
                where: {
                    id: userDetails.id,
                }
            });
            return responseModal(true, statusCodes.CODE_200, messageConstants.FORGOT_PASSWORD_SUCCESSFULLY, { email: userDetails.email });

        } catch (e) {
            // Return error
            console.log('e', e);
            return responseModal(false, statusCodes.CODE_500, e);
        }
    }
    /**
    * Summary: This method is used to resend otp sent by email
    * @param {*} req
    * @param {*} res
    * @returns 
    */
    async resendOTP(req, res) {
        try {
            var input = req.body;
            const { email, client_id, client_secret } = input;

            let options = { email: email.toLowerCase().trim(), deletedAt: null, }
            let includes = [{
                model: application_roles,
                as: 'application_roles',
                include: [
                    {
                        model: applications,
                        as: 'applications',
                        where: { client_id: client_id, client_secret: client_secret },
                    }
                ]
            }];

            // Get user by email
            const userDetails = await users.findOne({
                where: options,
                include: includes,
            });

            if (userDetails == null) {
                return responseModal(false, statusCodes.CODE_404, messageConstants.USER_DOES_NOT_EXISTS_FORGOT);
            }

            if (userDetails['status'] == userTable.USER_STATUS_IN_ACTIVE) {
                return responseModal(false, statusCodes.CODE_403, messageConstants.USER_ACCOUNT_NOT_ACTIVATED);
            }

            if (userDetails && !userDetails.application_roles) {
                return responseModal(false, statusCodes.CODE_401, messageConstants.INVALID_CLIENT_ID_OR_CLIENT_SECRET);
            }

            const roleId = userDetails.application_role_id;
            if (roleId === 1 || roleId === 2) { // User or Washer role_id
                const otp = await this.generateOTP(); // Implement this function to generate OTP
                const otpExpiryTime = new Date(Date.now() + 5 * 60 * 1000);
                const formattedOtp = otp.split('').join(' '); // Format OTP as individual characters separated by spaces

                let sendEmailData = {
                    subject: messageConstants.EMAIL_FORGOT_PASSWORD_OTP,
                    templateName: "forgot-password-otp-template.ejs",
                    emailToUser: userDetails.email
                };
                let emailTemplateReplaceData = {};
                emailTemplateReplaceData["name"] = userDetails.dataValues.name;
                emailTemplateReplaceData["otp"] = formattedOtp;
                sendEmail.generateHtmlForEmail(sendEmailData, emailTemplateReplaceData);

                await users.update({ otp: otp, otp_expire_time: otpExpiryTime }, {
                    where: {
                        id: userDetails.id,
                    }
                });
                return responseModal(true, statusCodes.CODE_200, messageConstants.OTP_RESENT_SUCCESSFULLY, { email: userDetails.email });
            }

        } catch (e) {
            // Return error
            return responseModal(false, statusCodes.CODE_500, e);
        }
    }
    // /**
    //* Summary: This method is used to generate the Token
    //* @param {*} length 
    //* @returns 
    //*/
    // async generateToken() {
    //   return crypto.randomBytes(20).toString('hex');
    // }
    // async generateToken(length = 36) {
    //     const random = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    //     let token = '';
    //     for (let i = 0; i < length; i++) {
    //         token += random[Math.floor(Math.random() * 36)];
    //     }
    //     return token;
    // }
    /**
    * Summary: This method is used to reset password by email
    * @param {*} req
    * @param {*} res
    * @returns 
    */
    async resetPassword(req, res) {
        try {
            const { token, password } = req.body;
            const options = { reset_password_token: token.toLowerCase().trim(), deleted_at: null };

            // Get user by email
            const userDetails = await users.findOne({
                where: options,
                logger: true
            });

            if (!userDetails) {
                return responseModal(false, statusCodes.CODE_404, messageConstants.USER_DOES_NOT_EXISTS_FORGOT);
            }

            if (userDetails.status === 'I') {
                return responseModal(false, statusCodes.CODE_403, messageConstants.USER_ACCOUNT_NOT_ACTIVATED);
            }

            await users.update({ password: hash(password), reset_password_token: null }, {
                where: { id: userDetails.id }
            });

            return responseModal(true, statusCodes.CODE_200, messageConstants.RESET_PASSWORD_SUCCESSFULLY);

        } catch (e) {
            console.log(e);
            return responseModal(false, statusCodes.CODE_500, e);
        }
    }
    /**
   * Summary: This method is used to Register A New user for system
   * @param {*} req
   * @param {*} res
   * @returns 
   */
    async register(req, res) {
        try {
            const { email, password, name, contact_number, status, application_role_id } = req.body;

            // Access the uploaded file using `req.file`
            const profile_image = req.file ? `${req.file.filename}` : '';
            // Check if the email already exists
            const existingUser = await users.findOne({ where: { email } });
            if (existingUser) {
                return responseModal(false, statusCodes.CODE_409, messageConstants.EMAIL_ALREADY_REGISTERED);
            }

            // Hash the password
            const hashedPassword = await hash(password);

            // Create the new user
            const newUser = await users.create({
                email,
                password: hashedPassword,
                name,
                contact_number,
                status,
                application_role_id,
                profile_image,
                created_at: new Date(),
                updated_at: new Date()
            });
            return responseModal(true, statusCodes.CODE_200, messageConstants.REGISTER_SUCCESSFULLY, newUser);
        } catch (e) {
            console.log(e);
            return responseModal(false, statusCodes.CODE_500, messageConstants.COULD_NOT_PERFORM_ACTION);
        }
    }

}