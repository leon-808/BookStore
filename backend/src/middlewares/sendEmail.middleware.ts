import "dotenv/config";
import nodemailer from "nodemailer";
import { User } from "../models/user.model";

const { EMAIL_ADMIN_ADDRESS, EMAIL_ADMIN_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: EMAIL_ADMIN_ADDRESS,
    pass: EMAIL_ADMIN_PASSWORD,
  },
});

export const sendEmail = async (email: User, token: string) => {
  const mailOptions = {
    from: EMAIL_ADMIN_ADDRESS,
    to: EMAIL_ADMIN_ADDRESS + "@gmail.com",
    subject:
      "요청하신 계정에 대한 비밀번호 초기화를 진행할 수 있는 링크입니다.",
    html: `<a href="http://localhost:3000/users/reset?token=${token}" target="_self">비밀번호 초기화</a>`,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw error;
    }
  });
};
