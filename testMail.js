import mailTransporter from './Config/mail.config.js';
import ENVIRONMENT from './Config/environment.config.js';

async function testMail() {
    try {
        const info = await mailTransporter.sendMail({
            from: ENVIRONMENT.GMAIL_USER,            // tu cuenta Gmail
            to: ENVIRONMENT.GMAIL_USER,              // te envías el mail a vos mismo
            subject: 'Test Nodemailer - Backend',    // asunto del mail
            text: 'Hola, esto es un test de envío de mail desde Node.js', // texto plano
            html: '<p>Hola, <b>esto es un test</b> de envío de mail desde Node.js</p>' // HTML opcional
        });

        console.log('✅ MAIL ENVIADO OK');
        console.log(info); // info incluye detalles del envío
    } catch (error) {
        console.log('❌ ERROR EN SENDMAIL');
        console.log('Código de error:', error.code);
        console.log('Mensaje de Gmail:', error.response);
        console.log('Mensaje completo:', error.message);
    }
}

testMail();