const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    },
    logger: true,
    debug: true  
});

// Function to send an email
const sendEmail = (to, subject, text) => {
    try {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text
    };

    return transporter.sendMail(mailOptions);
} catch (ex) {
    console.log('ex', ex);
}
};

module.exports = { sendEmail };
