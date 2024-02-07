//인가는 어차피 미들웨어 타고 갔다 오실거니 관련 모듈 다운로드는 필요 없을 것 같음
// - [ ]  **게시물 CRUD 기능**
//     - 게시물 작성, 조회, 수정, 삭제 기능
//         - 게시물 조회를 제외한 나머지 기능들은 전부 인가(Authorization) 개념이 적용되어야 하며 이는 JWT와 같은 토큰으로 검증이 되어야 할 것입니다.
//         - 예컨대, 내가 작성한 글을 남이 삭제할 수는 없어야 하고 오로지 본인만 삭제할 수 있어야겠죠?
//     - 게시물 작성, 수정, 삭제 시 새로고침 기능
//         - 프론트엔드에서 게시물 작성, 수정 및 삭제를 할 때마다 조회 API를 다시 호출하여 자연스럽게 최신의 게시물 내용을 화면에 보여줄 수 있도록 해야 합니다!
import express from "express";
import { prisma } from "../utils/prisma/index.js";
const router = express.Router();
//게시물 작성 API
router.post("/postView", authMiddleware, async (req, res, next) => {
  try {
    const { id, name } = req.locals.user; //id = users 테이블의Id
    const { title, content, photo1, photo2, photo3, photo4 } = req.body;
    const post = await prisma.posts.create({
      data: {
        id: +id,
        title,
        author: name,
        content,
      },
    });
    const photos = await prisma.photos.create({
      data: {
        postId: +post.id,
        photo1,
        photo2,
        photo3,
        photo4,
      },
    });
    return res.status(201).json({
      message: "게시물 작성이 완료되었습니다.",
      data: {
        title: post.title,
        author: post.author,
        photo1: photos.photo1,
        photo2: photos.photo2,
        photo3: photos.photo3,
        photo4: photos.photo4,
        createdAt: post.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});
//게시물 조회 API
router.get("/postView/:id", async (req, res, next) => {
  try {
    //뉴스피드의 유저id가 아니라 포스트id를 타고 가도록 해야 함
    const { id } = req.params; //posts의 id

    const post = await prisma.resume.findFirst({
      where: {
        id: +id,
      },
      select: {
        title: true,
        content: true,
        photos: {
          select: {
            photo1: true,
            photo2: true,
            photo3: true,
            photo4: true,
          },
        },
        createdAt: true,
      },
    });
    if (!post)
      return res
        .status(404)
        .json({ error: "해당 게시물이 존재하지 않습니다." });
    return res.status(200).json({
      message: "게시물이 조회되었습니다.",
      data: {
        title: post.title,
        author: post.author,
        photos: {
          photo1: post.photo1,
          photo2: post.photo2,
          photo3: post.photo3,
          photo4: post.photo4,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});
//게시물 수정 API
router.put("/postView/:id", authMiddleware, async (req, res, next) => {
  try {
    //postId와 userId 필요
    const { id } = req.params; //Posts 테이블의 id
    const { userId } = req.locals.user; //Users 테이블의 id
    const { title, content, photo1, photo2, photo3, photo4 } = req.body;

    const post = await prisma.posts.update({
      where: {
        id: +id,
        userId: +userId,
      },
      data: {
        title,
        content,
      },
    });
    const photos = await prisma.photos.update({
      where: {
        postId: +id,
      },
      data: {
        photo1,
        photo2,
        photo3,
        photo4,
      },
    });
    if (!resume)
      return res.status(404).json({ error: "게시물 수정에 실패하였습니다." });

    return res.status(201).json({
      message: "게시물 수정이 완료되었습니다.",
      data: {
        title: post.title,
        content: post.content,
        photo1: photos.photo1,
        photo2: photos.photo2,
        photo3: photos.photo3,
        photo4: photos.photo4,
      },
    });
  } catch (error) {
    next(error);
  }
});
//게시물 삭제 API
router.delete("/postView/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.locals.user; //Users테이블의 id
    const { postId } = req.params; //Posts테이블의 id
    const post = await prisma.resume.delete({
      where: {
        id: +postId,
        userId: id,
      },
    });
    if (!post)
      return res.status(404).json({ error: "게시물을 삭제할 수 없습니다." });
    return res.status(200).json({ message: "게시물이 삭제되었습니다." });
  } catch (error) {
    next(error);
  }
});
export default router;
