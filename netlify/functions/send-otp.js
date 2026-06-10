const { db } = require('./firebase-admin');
const nodemailer = require('nodemailer');

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    try {
        // Generate random 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes expiration

        // Save to Firestore
        await db.collection('settings').doc('otp').set({
            code: otpCode,
            expiresAt: expiresAt
        });

        const targetEmail = 'srikar122.punnam@gmail.com';

        // Check if SMTP credentials are provided
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
        const smtpPort = parseInt(process.env.SMTP_PORT || '587');

        let emailSent = false;
        let infoMessage = "";

        if (smtpUser && smtpPass) {
            try {
                const transporter = nodemailer.createTransport({
                    host: smtpHost,
                    port: smtpPort,
                    secure: smtpPort === 465,
                    auth: {
                        user: smtpUser,
                        pass: smtpPass
                    }
                });

                await transporter.sendMail({
                    from: `"Srikar Jewellers Admin" <${smtpUser}>`,
                    to: targetEmail,
                    subject: "Srikar Jewellers Business Suite - OTP Access Code",
                    text: `Your One-Time Password (OTP) to access the Srikar Jewellers Business Suite is: ${otpCode}. This code is valid for 5 minutes.`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #dcca87; padding: 20px; border-radius: 8px;">
                            <h2 style="color: #0c0c0c; text-align: center; border-bottom: 2px solid #dcca87; padding-bottom: 10px;">Srikar Jewellers Business Suite</h2>
                            <p style="font-size: 16px; color: #333;">Hello,</p>
                            <p style="font-size: 16px; color: #333;">You have requested access to the Business Suite. Please use the following One-Time Password (OTP) to log in:</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #dcca87; background: #0c0c0c; padding: 10px 20px; border-radius: 4px; border: 1px solid #dcca87;">${otpCode}</span>
                            </div>
                            <p style="font-size: 14px; color: #666; text-align: center;">This code is valid for 5 minutes. If you did not request this code, please ignore this email.</p>
                        </div>
                    `
                });
                emailSent = true;
                infoMessage = "OTP sent successfully to email.";
            } catch (mailError) {
                console.error("Failed to send email:", mailError);
                infoMessage = "OTP generated but email sending failed. Error: " + mailError.message;
            }
        } else {
            infoMessage = "OTP generated. Please configure SMTP_USER and SMTP_PASS in Netlify to receive it via email.";
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                success: true, 
                emailSent: emailSent, 
                message: infoMessage,
                otp: (!smtpUser || !smtpPass) ? otpCode : null 
            })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
};
