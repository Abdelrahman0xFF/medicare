import { deleteCloudinaryAsset } from "../utils/cloudinaryHelper.js";

export const validateRequest = (validatorFunction) => {
    return async (req, res, next) => {
        const { error, value } = validatorFunction(req.body);
        if (error) {
            if (req.file) {
                await deleteCloudinaryAsset(req.file.filename || req.file.path);
            }
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }
        req.body = value;
        next();
    };
};
