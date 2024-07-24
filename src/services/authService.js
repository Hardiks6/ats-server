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
import { sendNotification } from "../utils/sendNotification";

const Op = Sequelize.Op;
const { users, application_roles, applications } = models;

export class AuthService {

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

}