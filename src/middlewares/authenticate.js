import {userTable} from "../utils/tableEnums";

var express = require("express");
const passport = require("passport");
var jwt = require("jwt-simple");

import model from "../models";
import { frontSendErrorResponse } from "../utils/sendResponse";
import messageConstants from "../utils/messageConstants";
import statusCodes from "../utils/statusCodes";
import { verifyUserAccountStatus, tokenBlacklist } from "../utils/commonFunctions";

const { users } = model;

// Middleware function to authenticate requests using JWT
module.exports = (req, res, next) => {
    // Authenticate using Passport's JWT strategy named "jwt"
    passport.authenticate("jwt", async function (err, user, info) {
        if (err) return next(err);

        // Check for missing or invalid authorization header
        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith('Bearer ')) {
            return frontSendErrorResponse(res, statusCodes.CODE_401, messageConstants.UNAUTHORIZED_ACCESS);
        }

        const token = authorization.slice(7); // Extract token from Bearer header

        // Check if token is blacklisted (e.g., revoked)
        if (tokenBlacklist.has(token)) {
            return frontSendErrorResponse(res, statusCodes.CODE_401, messageConstants.UNAUTHORIZED_ACCESS);
        }

        // User object not found from the JWT payload
        if (!user) {
            return frontSendErrorResponse(res, statusCodes.CODE_401, messageConstants.UNAUTHORIZED_ACCESS);
        }

        if (user.status == userTable.USER_STATUS_IN_ACTIVE) {
            return frontSendErrorResponse(res, statusCodes.CODE_401, messageConstants.ACCOUNT_INACTIVE);
        }

        // Verify user account verification
        const verifyAccountStatus = await verifyUserAccountStatus(user);
        if (verifyAccountStatus.status == false) {
            return frontSendErrorResponse(res, statusCodes.CODE_401, verifyAccountStatus.message);
        }

        // Attach the authenticated user to the request object
        req.user = user;
        next();
    })(req, res, next);
};
