import { BlogPost } from "../models/blog.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { deleteCloudinaryAsset } from "../utils/cloudinaryHelper.js";

const parseJsonFields = (body) => {
    for (const field of ["tableOfContents", "faqs"]) {
        if (typeof body[field] === "string") {
            try {
                body[field] = JSON.parse(body[field]);
            } catch {
                delete body[field];
            }
        }
    }
};

export const createBlogPost = asyncHandler(async (req, res, next) => {
    if (req.file) {
        req.body.coverImageUrl = req.file.path;
    }
    parseJsonFields(req.body);
    if (!req.body.coverImageUrl) {
        return next(new AppError("Cover image is required", 400));
    }
    if (typeof req.body.readTimeMinutes === "string") {
        req.body.readTimeMinutes = parseInt(req.body.readTimeMinutes, 10);
    }

    try {
        const newPost = await BlogPost.create(req.body);
        return res.status(201).json({
            success: true,
            message: "Blog post created successfully",
            data: newPost,
        });
    } catch (err) {
        if (req.file) {
            await deleteCloudinaryAsset(req.file.filename || req.file.path);
        }
        throw err;
    }
});

export const getBlogPosts = asyncHandler(async (req, res, next) => {
    let filter = {};

    if (req.adminId) {
        if (req.query.status) {
            filter.status = req.query.status;
        }
    } else {
        filter.status = "published";
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
        BlogPost.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
        BlogPost.countDocuments(filter),
    ]);

    return res.status(200).json({
        success: true,
        data: posts,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    });
});

export const getBlogPostById = asyncHandler(async (req, res, next) => {
    const filter = { _id: req.params.id };
    if (!req.adminId) {
        filter.status = "published";
    }
    const post = await BlogPost.findOne(filter);

    if (!post) {
        return next(new AppError("Blog post not found", 404));
    }
    return res.status(200).json({ success: true, data: post });
});

export const updateBlogPost = asyncHandler(async (req, res, next) => {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
        if (req.file) {
            await deleteCloudinaryAsset(req.file.filename || req.file.path);
        }
        return next(new AppError("Blog post not found", 404));
    }

    if (req.file) {
        // Destroy old cover image when a new one is uploaded
        if (post.coverImageUrl) {
            await deleteCloudinaryAsset(post.coverImageUrl);
        }
        req.body.coverImageUrl = req.file.path;
    }

    parseJsonFields(req.body);
    if (typeof req.body.readTimeMinutes === "string") {
        req.body.readTimeMinutes = parseInt(req.body.readTimeMinutes, 10);
    }
    Object.assign(post, req.body);
    await post.save();
    return res
        .status(200)
        .json({ success: true, message: "Blog post updated", data: post });
});

export const deleteBlogPost = asyncHandler(async (req, res, next) => {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) {
        return next(new AppError("Blog post not found", 404));
    }

    if (post.coverImageUrl) {
        await deleteCloudinaryAsset(post.coverImageUrl);
    }

    return res
        .status(200)
        .json({ success: true, message: "Blog post deleted" });
});
