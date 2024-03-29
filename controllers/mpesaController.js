import axios from "axios";
import { response } from "express";
import moment from "moment";

class MpesaController {

    getToken = async (request, response, next) => {
        const resp = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        {headers: {authorization: `Basic ${new Buffer.from(`${process.env.CONSUMERKEY}:${process.env.CONSUMERSECRET}`).toString('base64')}`}})
        this.token = resp.data.access_token
        next()
    }

    stkPush = async (request, response, next) => {
        const shortcode = 836969;
        const phone = request.body.phone;
        const amount = request.body.amount;
        const passkey = process.env.PASSKEY;
        const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
        const timestamp = moment().format("YYYYMMDDHHmmss");
        const password = new Buffer.from(shortcode + passkey + timestamp).toString("base64")

        let data = {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: phone,
            PartyB: shortcode,
            PhoneNumber: phone,
            CallBackURL: "https://d8f5-105-163-157-202.ngrok-free.app/mpesa/callback",
            AccountReference: "Test",
            TransactionDesc: "Test",
        };

        const resp = await axios.post(url, data,
            {headers: {authorization: `Bearer ${this.token}`}})

        return response.status(200).json({"message": "Kindly check your phone", "data": resp.data})
    }

    mpesaCallback = (request, response, next) => {
        console.log('hello world')
    }
}
 

export default MpesaController;