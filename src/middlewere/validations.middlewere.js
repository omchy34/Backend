import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"

const validate = (schema) => asyncHandler(async (req, res, next) => {
    try {
        const parsedBody = await schema.parseAsync(req.body);
        req.body = parsedBody;
        next();
    } catch (err) {
         res.json(
             new ApiError(400 , {},
              err.errors[0].message
            )
        )
    }
});

export { validate };
