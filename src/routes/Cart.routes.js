import { Router } from "express";
import { AddToCart, RemoveFromCart , GetCart } from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewere/Auth.middlewere.js";

const CartItemRouter = Router();

CartItemRouter.route("/AddToCart").post(verifyJWT, AddToCart);
CartItemRouter.route("/RemoveFromCart").post(verifyJWT, RemoveFromCart);
CartItemRouter.route("/GetCart").get(verifyJWT, GetCart); // Changed to GET

export default CartItemRouter ;
