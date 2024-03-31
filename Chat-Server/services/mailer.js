// logic to send emails


const nodemailer = require('nodemailer');

exports.sendGmail = async ({
    from,
    to,
    subject,
    text,
    html,
    attachments
}) => {
    try {
        // Create transporter for Gmail
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            auth: {
                user: 'arijit.saha1373@gmail.com',
                pass: 'zytw yfaw xuwl mfbi'
            }
        });

        // Construct message
        let mailOptions = {
            from: from, // This should be the sender's email address
            to: to,
            subject: subject,
            text: text,
            html,
            attachments
        };

        // Send email
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Re-throw the error for handling in the calling function
    }
};
