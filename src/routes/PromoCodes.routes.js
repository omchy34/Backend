import { Router } from "express";
import { verifyAdminJWT } from "../middlewere/Auth.middlewere.js";
import { createPromoCode, getPromoCodes, updatePromoCode, deletePromoCode } from "../controllers/PromoCodes.Controller.js";

const PromoRouter = Router();

PromoRouter.post('/promoCodes', verifyAdminJWT ,  createPromoCode); // Create a new promo code
PromoRouter.get('/promoCodes', verifyAdminJWT ,  getPromoCodes); // Get all promo codes
PromoRouter.put('/promoCodes/:id',  verifyAdminJWT , updatePromoCode); // Update a promo code
PromoRouter.delete('/promoCodes/:id', verifyAdminJWT ,  deletePromoCode); // Delete a promo code

export default PromoRouter;
