import MpesaController from "../controllers/mpesaController.js";
import express from "express";

const mpesaRouter = express.Router()
const mpesaController = new MpesaController();

mpesaRouter.get('/send-to-mobile', mpesaController.getMpesaToken);

export default mpesaRouter;