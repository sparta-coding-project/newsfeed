import express from "express";
import { prisma } from "../utils/prisma/index.js";

const router = express.Router();

router.get('/newsfeed', async (req, res, next) => {
    try {
        const newsfeed = await prisma.posts.findMany({
            select: {
                postId: true,
                title: true,
                author: true,
                content: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return res.status(200).json({ data: newsfeed });
    } catch (error) {
        next(error);
    }
});

export default router;