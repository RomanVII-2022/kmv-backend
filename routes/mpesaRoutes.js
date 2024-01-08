import MpesaController from "../controllers/mpesaController.js";
import express from "express";

const mpesaRouter = express.Router()
const mpesaController = new MpesaController();

mpesaRouter.post('/send-to-mobile', mpesaController.getToken, mpesaController.stkPush);
mpesaRouter.post('/callback', mpesaController.callbackResponse);

export default mpesaRouter;