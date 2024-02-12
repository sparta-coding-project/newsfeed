//인가는 어차피 미들웨어 타고 갔다 오실거니 관련 모듈 다운로드는 필요 없을 것 같음
// - [ ]  **게시물 CRUD 기능**
//     - 게시물 작성, 조회, 수정, 삭제 기능
//         - 게시물 조회를 제외한 나머지 기능들은 전부 인가(Authorization) 개념이 적용되어야 하며 이는 JWT와 같은 토큰으로 검증이 되어야 할 것입니다.
//         - 예컨대, 내가 작성한 글을 남이 삭제할 수는 없어야 하고 오로지 본인만 삭제할 수 있어야겠죠?
//     - 게시물 작성, 수정, 삭제 시 새로고침 기능
//         - 프론트엔드에서 게시물 작성, 수정 및 삭제를 할 때마다 조회 API를 다시 호출하여 자연스럽게 최신의 게시물 내용을 화면에 보여줄 수 있도록 해야 합니다!
import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();
//게시물 작성 API(근데 이거 한 게시물에 사진 여러장 어떻게 넣지?)
router.post("/postView", authMiddleware, async (req, res, next) => {
  try {
    const { userId, nickname } = req.locals.user;
    const { title, content, photos } = req.body;

    const photosJson = JSON.stringify(photos);
    const post = await prisma.posts.create({
      data: {
        userId: +userId,
        title,
        author: nickname,
        content,
        photos: photosJson,
      },
    });

    return res.status(303).render("post");
  } catch (error) {
    next(error);
  }
});

//게시물 조회 API
router.get("/postView/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await prisma.posts.findFirst({
      where: {
        postId: +postId,
      },
      select: {
        title: true,
        author: true,
        content: true,
        photos: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!post) {
      return res
        .status(404)
        .json({ message: "해당 게시물이 존재하지 않습니다." });
    }

    return res.status(200).json({ data: post });
  } catch (error) {
    next(error);
  }
});
//게시물 수정 API
router.patch("/postView/:postId", authMiddleware, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = req.locals.user;
    const { title, content, photos } = req.body;

    const photosJson = JSON.stringify(photos);

    const post = await prisma.posts.update({
      where: {
        postId: +postId,
        userId: +userId,
      },
      data: {
        title,
        content,
        photos: photosJson,
      },
      select: {
        title: true,
        content: true,
        photos: true,
        updatedAt: true,
      },
    });

    if (!post)
      return res.status(404).json({ message: "게시물 수정에 실패하였습니다." });

    return res.status(303).render("post", { path: post.postId });
  } catch (error) {
    next(error);
  }
});
//게시물 삭제 API
router.delete("/postView/:postId", authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.locals.user;
    const { postId } = req.params;

    const post = await prisma.posts.findFirst({
      where: {
        postId: +postId,
        userId: +userId,
      },
    });

    if (!post)
      return res.status(404).json({ message: "게시물을 찾을 수 없습니다." });

    await prisma.posts.delete({
      where: {
        postId: +postId,
        userId: +userId,
      },
    });

    return res.status(303).render("newsfeed", {
      message: "게시물이 삭제되었습니다.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
