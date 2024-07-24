import express from "express";
import { AuthController } from '../controllers/authController';
import { authValidator, handleValidationErrors } from "../middlewares/apiValidation";
import { validate } from "../middlewares/validate";

const router = express.Router();
const authController = new AuthController();

router.post("/login", [authValidator("login"), validate], authController.login);


export default router;