import mailgun from 'mailgun.js';
import config from '../../config.json';

const mg = mailgun.client({
    username: 'api',
    key: config.mail.key
});

export function sendMail(recipients, subject, text) {
    if (!Array.isArray(recipients)) {
        recipients = [recipients];
    }
    return Promise.all(recipients.map(to => {
        return mg.messages.create(config.mail.domain, {
            from: config.mail.sender,
            'h:Reply-To': config.mail.replyTo,
            to,
            subject,
            text
        });
    })).catch(() => {
        throw new Error('Failed to send an email.');
    });
}

export function sendConfirmationToken(recipient, token) {
    let recipients = [recipient];
    let subject = 'Confirm your email address';
    let text = `Hello!

Someone registered on the MSOE Ticket Exchange with your email address. If this was you, please confirm your email address by visiting this link:

https://${config.domain}/verify-email?token=${token}&accept=true

If this was not you, we will discard this account in 24 hours. You may also discard the account immediately by visiting this link:

https://${config.domain}/verify-email?token=${token}&accept=false

Thank you,

${config.mail.signature}
MSOE Ticket Exchange`;
    return sendMail(recipients, subject, text);
}

export function sendAuthenticationToken(recipient, token) {
    let recipients = [recipient];
    let subject = 'Your login link';
    let text = `Hello!

To finish logging into your MSOE Ticket Exchange account, please visit this link:

https://${config.domain}/complete-login?token=${token}

If you did not make this login attempt, someone else has guessed your password. Please visit https://${config.domain}/login to log in and change your password immediately.

Thank you,

${config.mail.signature}
MSOE Ticket Exchange`;
    return sendMail(recipients, subject, text);
}
