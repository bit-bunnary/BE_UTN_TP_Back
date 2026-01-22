import nodemailer from 'nodemailer';
import ENVIRONMENT from './environment.config.js';

const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: ENVIRONMENT.GMAIL_USER,
        pass: ENVIRONMENT.GMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false /* permite certificados autofirmados en dev FIXME: Esto no tendría que quedar así en teoría */
    }
})


export default mailTransporter