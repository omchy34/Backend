import Router from "express"
import {verifyJWT , verifyAdminJWT} from "../middlewere/Auth.middlewere.js"
import { placeOrder , verify , SuccessOrder , GetAllOrders, DeleteOrder} from '../controllers/Order.controller.js'

const orderRouter = Router();

orderRouter.route("/placeOrder").post(verifyJWT , placeOrder) ;
orderRouter.route("/verify-payment").post(verifyJWT , verify) ;
orderRouter.route("/SuccessOrder").post(verifyJWT , SuccessOrder) ;
orderRouter.route("/GetAllOrders").get(verifyAdminJWT , GetAllOrders) ;
orderRouter.route("/DeleteOrder/:requestId").delete( verifyAdminJWT , DeleteOrder) ;

export default orderRouter