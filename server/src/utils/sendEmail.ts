import nodemailer from "nodemailer";

export async function sendEmail(to: string, html: string): Promise<void> {
  // const testAccount = await nodemailer.createTestAccount();
  // console.log(testAccount)

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "fqshmtdgc7fm2jes@ethereal.email",
      pass: "wR3amJu1A11pKUSE47"
    },
  });

  let info = await transporter.sendMail({
    from: 'My Social Media App',
    to: to,
    subject: "Change Password",
    html: html
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}