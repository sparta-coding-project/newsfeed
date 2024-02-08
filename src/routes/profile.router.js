import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

//프로필 조회
router.get('/profile', authMiddleware, async (req, res, next) => {
    try {
        const { userId } = req.locals.user;

        const user = await prisma.users.findFirst({
            where: { userId: +userId },
            select: {
                userId: true,
                username: true,
                nickname: true,
                email: true,
                age: true,
                introduction: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return res.status(200).json({ data: user });

    } catch (err) {
        next(err);
    }
})

//프로필 수정
router.patch('/profile', authMiddleware, async (req, res, next) => {
    try {
        const { userId } = req.locals.user;
        const { username, nickname, age, introduction, password, password2 } = req.body;

        if (password !== password2) {
            return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
        }

        const name = await prisma.users.findFirst({
            where: { username: username },
        });

        if (name) {
            return res.status(400).json({ message: "이미 존재하는 이름입니다." });
        }

        const profile = await prisma.users.findFirst({
            where: { userId: +userId },
        });

        if (!profile) {
            return res.status(404).json({ message: "내 정보 조회에 실패하였습니다." });
        }

        await prisma.users.update({
            data: {
                username,
                nickname,
                age,
                introduction,
                password,
            },
            where: {
                userId: +userId,
            },
        });

        return res.status(200).json({ message: "프로필 수정이 완료되었습니다." });

    } catch (err) {
        next(err);
    }
})

export default router;