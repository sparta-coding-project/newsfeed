import nodemailer from "nodemailer";
import { createEmailToken } from "./token.js";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  service: "Naver",
  host: "smtp.naver.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const emailTemplate = (code) => {
  const site = {
    name: "TravAll",
    validUrl: `http://localhost:${process.env.PORT}/api/emailValid?code=${code}`,
  };

  return `<!DOCTYPE html>
  <html lang="ko">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${site.name}이메일 인증</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        text-align: center;
      }
      .logo {
        display: block;
        margin: 0 auto;
        width: 100px;
      }
      .title {
        font-size: 24px;
        font-weight: bold;
      }
      .content {
        margin-top: 20px;
      }
      .message {
        font-size: 16px;
        line-height: 1.5;
      }
      .button {
        margin-top: 20px;
        text-align: center;
      }
      .button a {
        display: inline-block;
        padding: 10px 20px;
        font-size: 16px;
        font-weight: bold;
        color: #fff;
        background-color: #000;
        text-decoration: none;
      }
      .footer {
        margin-top: 20px;
        text-align: center;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://cdn-icons-png.flaticon.com/128/3282/3282340.png" alt="logo" class="logo">
        <h1 class="title">${site.name} 이메일 인증</h1>
      </div>
      <div class="content">
        <p class="message">
          안녕하세요
        </p>
        <p class="message">
          ${site.name}에 가입해 주셔서 감사합니다!
        </p>
        <p class="message">
          계정을 활성화하려면 아래 버튼을 클릭하여 이메일 주소를 인증해 주세요.
        </p>
        <div class="button">
          <a href="${site.validUrl}">이메일 인증하기</a>
        </div>
        <p class="message">
          만약 버튼이 작동하지 않는다면, 아래 링크를 복사하여 주소창에 붙여넣고 엔터를 눌러 주세요.
        </p>
        <p class="message">
          ${site.validUrl}
        </p>
      </div>
      <div class="footer">
        © 2024 ${site.name} All rights reserved.
      </div>
    </div>
  </body>
  </html>`;
};

export const emailCodeTransporter = (code, email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // 발신자
    to: email, // 수신자
    subject: "TravAll 인증 코드 발송", // 제목
    html: emailTemplate(code), // 본문
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
