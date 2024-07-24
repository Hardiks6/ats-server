import models from '../models';
import messageConstants from './messageConstants';
import statusCodes from "../utils/statusCodes";
import { responseModal } from './sendResponse';

const {notifications} = models;
export const sendNotification = async (content) => {
  try {
    const createNotification = await notifications.create(content);
    return createNotification;
  } catch (error) {
    return responseModal(false, statusCodes.CODE_500, messageConstants.COULD_NOT_PERFORM_ACTION, error)
  }
};