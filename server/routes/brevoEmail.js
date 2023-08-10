const nodemailer = require("nodemailer");
require('dotenv').config();


const brevSMTP = {
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
    },
};
const transporter = nodemailer.createTransport(brevSMTP);

function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendEmail(targetEmail, subject, description){
    await transporter.sendMail({
        from: process.env.BREVO_USER,
        to: targetEmail,
        subject: subject,
        text: description
    })
    transporter.close();
}


module.exports = {transporter, generateVerificationCode, sendEmail};