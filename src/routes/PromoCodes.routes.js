import { Router } from "express";
import { createPromoCode, getPromoCodes, updatePromoCode, deletePromoCode } from "../controllers/PromoCodes.Controller.js";

const PromoRouter = Router();

PromoRouter.post('/promoCodes', createPromoCode); // Create a new promo code
PromoRouter.get('/promoCodes', getPromoCodes); // Get all promo codes (use GET for fetching)
PromoRouter.put('/promoCodes/:id', updatePromoCode); // Update a promo code
PromoRouter.delete('/promoCodes/:id', deletePromoCode); // Delete a promo code

export default PromoRouter;
