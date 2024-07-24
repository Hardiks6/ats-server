'use strict';
const {Model} = require('sequelize');
import jwt from 'jsonwebtoken';
let tokenList = {};
// const PROTECTED_ATTRIBUTES = ["password", 'otp', 'reset_password_token', 'driver_documents', 'contract_documents'];
const PROTECTED_ATTRIBUTES = ["password"];

module.exports = (sequelize, DataTypes) => {
    class users extends Model {


        /**
         * Summary: Protect some fields
         * @returns {any}
         */
        toJSON() {
            // hide protected fields
            const attributes = { ...this.get() };
            // eslint-disable-next-line no-restricted-syntax
            for (const a of PROTECTED_ATTRIBUTES) {
                delete attributes[a];
            }
            return attributes;
        }

        /**
         * Summary: associate the model relation
         * @param models
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.application_roles, {foreignKey: 'application_role_id', as: 'application_roles'});
        }
    }

    users.init({
        name: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        profile_image: {
            type: DataTypes.STRING
        },
        application_role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reset_password_token: {
            type: DataTypes.STRING
        },
        status: {
            allowNull: false,
            type: DataTypes.ENUM('I', 'P', 'A'),
            defaultValue: "I"
        }
    }, {
        sequelize,
        modelName: 'users',
        paranoid: true
    });

    users.prototype.generateJWT = async function generateJWT(expireTime) {
        let payload = {
            id: this.id,
            email: this.email,
            application_role_id: this.application_role_id
        };

        // Generate an access token
        // If this token is stolen, then they will have access to the account forever and the actual user won't be able to revoke access.
        // To prevent that, we sets expiration time so the token expire after a specific period.
        var token = jwt.sign(payload, process.env.JWT_SECRET_KEY, expireTime)

        // Generate an refresh token
        // We are managing refresh token, so that is user token get expired while he/she is working, we can renew the token to prevent data/work loss for user.
        // This is used to increase usability without damaging any data. The actual token will expire after specific time. After that refresh token will be used to renew it.
        var refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET_KEY,
            { expiresIn: "30d" }
        );

        const response = { token, refreshToken }
        tokenList.refreshToken = response;
        return response;
    }

    return users;
};