import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

//댓글 작성 API
router.post("/postView/:postId", authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { content } = req.body;
    const { postId } = req.params;
    const comment = await prisma.comments.create({
      data: {
        userId: +userId,
        postId: +postId,
        content,
        createdAt: new Date(),
      },
    });
    return res.status(201).redirect(`/api/postView/${postId}`);
  } catch (error) {
    next(error);
  }
});

//댓글 조회 API(게시물 조회 API랑 병합할수도...)
router.get("/postView/:postId", async (req, res, next) => {
  try {
    const data = await prisma.posts.findFirst({
      where: {
        postId: req.params.postId,
      },
      select: {
        comments: {
          select: {
            commentId: true,
            userId: true,
            postId: true,
            content: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!data.comments)
      return res.status(400).json({ message: "댓글이 존재하지 않습니다." });

    return res.status(200).json({ data: data.comments });
  } catch (error) {
    next(error);
  }
});

//댓글 수정 API
router.patch("/postView/:commentId", authMiddleware, async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const isExistComment = await prisma.comments.findFirst({
      where: { commentId: +commentId },
    });
    if (!isExistComment)
      return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
    if (isExistComment.userId !== req.user.userId)
      return res
        .status(401)
        .json({ message: "댓글을 수정할 권한이 없습니다." });

    const modifiedData = await prisma.comments.update({
      data: { content },
      where: { commentId: +commentId },
    });
    return res.status(200).redirect(`/api/postView/${isExistComment.postId}`);
  } catch (error) {
    next(error);
  }
});

//댓글 삭제 API
router.delete(
  "/postView/:commentId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const isExistComment = await prisma.comments.findFirst({
        where: { commentId: +commentId },
      });
      if (!isExistComment)
        return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
      if (isExistComment.userId !== req.user.userId)
        return res
          .status(401)
          .json({ message: "댓글을 삭제할 권한이 없습니다." });
      await prisma.comments.delete({
        where: { commentId: +commentId },
      });
      return res.status(200).redirect(`/api/postView/${isExistComment.postId}`);
    } catch (error) {
      next(error);
    }
  }
);
export default router;
