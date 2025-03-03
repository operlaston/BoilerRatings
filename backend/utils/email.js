const nodemailer = require("nodemailer");
const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})
const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: '"My App" <${process.env.EMAIL_USER}>',
        to,
        subject,
        text,
    };
    try {
        await transport.sendMail(mailOptions);
        console.log('Email sent to ${to}');
    } catch (error) {
        console.error("Failed to send email");
        throw new Error("Email failed to send");
    }
};

module.exports = sendEmail;