import {PromoCode} from '../modle/promoCode.modle.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';

// Create a new promo code
 const createPromoCode = asyncHandler(async (req, res) => {
  const { code, discount, expiryDate } = req.body;
  if (!code || discount === undefined) {
    throw new ApiError(400, {}, 'Code and discount are required fields');
  }
  const promoCode = new PromoCode({ code, discount, expiryDate });
  await promoCode.save();
  res.json(new ApiResponse(200 , promoCode , 'Promo Code created successfully'))
});

// Get all promo codes
 const getPromoCodes = asyncHandler(async (req, res) => {
  const promoCodes = await PromoCode.find();
  res.json(new ApiResponse(200 , promoCodes , 'Promo Code retrive successfully'))
});

// Update a promo code
 const updatePromoCode = asyncHandler(async (req, res) => {
  const promoCode = await PromoCode.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!promoCode) {
    throw new ApiError(404, {}, 'Promo code not found');
  }
  res.json(new ApiResponse(200 , promoCode , 'Promo Code updated successfully'))
});

// Delete a promo code
 const deletePromoCode = asyncHandler(async (req, res) => {
  const promoCode = await PromoCode.findByIdAndDelete(req.params.id);
  if (!promoCode) {
    throw new ApiError(404, {}, 'Promo code not found');
  }
  res.json(new ApiResponse(200 , promoCode , 'Promo Code deleted successfully'))
});

export { createPromoCode , getPromoCodes , updatePromoCode , deletePromoCode } 