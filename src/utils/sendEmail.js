const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hoteleriafinal@gmail.com',
        pass: '12345678'
    }
});

const sendEmail = (to, subject, text, html) => {
    const mailOptions = {
        from: 'hoteleriafinal@gmail.com',
        to,
        subject,
        text,
        html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar el correo:', error);
        } else {
            console.log('Correo enviado:' + info.response);
        }
    });
};

module.exports = sendEmail;
