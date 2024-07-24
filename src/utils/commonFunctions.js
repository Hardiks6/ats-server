import {userTable} from "./tableEnums";
import messageConstants from "../utils/messageConstants";

/**
 * Summary : This function is used for validate the user account status for API request
 * @param user
 * @returns {Promise<{message: string, status: boolean}>}
 */
export const verifyUserAccountStatus = async user => {
    let isAccountActive = true
    let errorMessage = ''
    if (user.is_verified == userTable.USER_IS_VERIFIED_YES) {
        return {status: isAccountActive, message: errorMessage}
    } else {
        isAccountActive = false
        errorMessage = messageConstants.COULD_NOT_PERFORM_ACTION

        if (user.is_verified == userTable.USER_IS_VERIFIED_NO)
            errorMessage = messageConstants.ACCOUNT_EMAIL_VERIFICATION_PENDING

        return {status: isAccountActive, message: errorMessage}
    }
}

export const tokenBlacklist = new Set()