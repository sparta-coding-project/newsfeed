import nodemailer from "nodemailer";
import { createEmailToken } from "./token.js";

// const emailCodeGenerator = () => {
//   const codes = "abcdefghijklmnopqrstuvwxyz0123456789";
//   let result = "";
//   for (let i = 0; i < 6; i++) {
//     result += codes[parseInt(Math.random() * codes.length)];
//   }
//   return result;
// };

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: "qgx99098@gmail.com",
    pass: "mtpwuluyrofkxhse",
  },
});


export const emailCodeTransporter = (code) => {

  const mailOptions = {
    from: "qgx99098@gmail.com", // 발신자
    to: "qgx99098@gmail.com", // 수신자
    subject: "Hello from Nodemailer", // 제목
    text: `http://localhost:3002/api/emailValid?code=${code}`, // 본문
  };
  

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
