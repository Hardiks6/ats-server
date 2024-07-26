import express from "express";
import { AuthController } from '../controllers/authController';
import { authValidator, handleValidationErrors } from "../middlewares/apiValidation";
import { validate } from "../middlewares/validate";
import upload from "../utils/multerConfig";

const router = express.Router();
const authController = new AuthController();

router.post("/login", [authValidator("login"), validate], authController.login);
router.post('/forgot-password', [authValidator("forgotPassword"), validate], authController.forgotPassword);
router.post("/reset-password", [authValidator("resetPassword"),validate], authController.resetPassword);
router.post("/register",upload.single('profile_image'), [authValidator("registerUser"),validate], authController.register);

export default router; 