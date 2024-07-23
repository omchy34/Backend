import Router from "express"
import {verifyJWT} from "../middlewere/Auth.middlewere.js"
import { placeOrder , verify , SuccessOrder , GetAllOrders} from '../controllers/Order.controller.js'

const orderRouter = Router();

orderRouter.route("/placeOrder").post(verifyJWT , placeOrder) ;
orderRouter.route("/verify-payment").post(verifyJWT , verify) ;
orderRouter.route("/SuccessOrder").post(verifyJWT , SuccessOrder) ;
orderRouter.route("/GetAllOrders").get(GetAllOrders) ;

export default orderRouter