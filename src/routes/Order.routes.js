import Router from "express"
import {verifyJWT} from "../middlewere/Auth.middlewere.js"
import { placeOrder , verify} from '../controllers/Order.controller.js'

const orderRouter = Router();

orderRouter.route("/placeOrder").post(verifyJWT , placeOrder) ;
orderRouter.route("/verify-payment").post(verifyJWT , verify) ;

export default orderRouter