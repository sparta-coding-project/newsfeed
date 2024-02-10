import { prisma } from "../utils/prisma/index.js";
import { generateTokens } from "../utils/token.js";
import { checkPW } from "../utils/bcrypt.js";
import { createEmailToken, verifyToken } from "../utils/token.js";
import { emailCodeTransporter } from "../utils/nodemailer.js";

// const signup = async (req, res) => {
//   try {
//     const { username, nickname, email, age, introduction, password } = req.body;

//     const user = await prisma.users.findFirst({
//       where: {
//         username,
//         email,
//       },
//     });

//     if (user) {
//       return res.status(400).json({ message: "존재하는 유저입니다." });
//     } else {
//       await prisma.users.create({
//         data: {
//           username,
//           nickname,
//           email,
//           age,
//           introduction,
//           password: await encryptPW(password),
//         },
//       });
//       return res.status(201).json({ message: "회원 가입이 완료되었습니다." });
//     }
//   } catch (error) {
//     return res.status(400).json({ message: error });
//   }
// };

const signin = async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.users.findFirst({
    where: {
      username,
    },
  });

  if (user) {
    if (checkPW(password, user.password)) {
      const tokens = await generateTokens(res, { userId: user.userId });
      return res
        .status(200)
        .json({ message: "로그인이 완료되었습니다.", data: tokens });
    } else {
      return res.status(401).json({ message: "비밀번호가 틀렸습니다." });
    }
  } else {
    return res.status(401).json({ message: "존재하지 않는 사용자입니다." });
  }
};

const signout = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({ message: "로그아웃 되었습니다." });
  } catch (error) {
    return res.status(400).json({ message: "로그아웃에 실패했습니다.", error });
  }
};

const signup = async (req, res) => {
  try {
    const { username, nickname, password, email, age, introduction } = req.body;

    const user = await prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (user) {
      return res.status(403).json({message: "존재하는 사용자입니다."})
    } else {
      const valid = await prisma.valid.findFirst({
        where:{
          email
        }
      })
      if (valid){
        const code = createEmailToken(req.body)
        await prisma.valid.update({
          where:{
            email: email
          },
          data: {
            code,
          }
        })
        emailCodeTransporter(code);
      } else {
        const code = createEmailToken(req.body);

        await prisma.valid.create({
          data:{
            email,
            code: code
          }
        });
        emailCodeTransporter(code);
      }
      return res.status(201).json({message: "이메일을 발송했습니다."})
    }

  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: error });
  }
};

const emailValid = async (req, res) => {
  try {
    const { code } = req.query;

    const user = verifyToken(code);

    const valid = await prisma.valid.findFirst({
      where: {
        email: user.email,
        code,
      },
    });

    if (valid) {
      await prisma.users.create({
        data: {
          username: user.username,
          nickname: user.nickname,
          email: user.email,
          age: user.age,
          introduction: user.introduction,
          password: user.password,
        },
      });
      return res
        .status(201)
        .json({ message: "회원가입이 완료되었습니다. 로그인해주세요." });
    } else {
      return res.status(401).json({ message: "잘못된 접근입니다." });
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: error });
  }
};

export default {
  signup,
  emailValid,
  signin,
  signout,
};
