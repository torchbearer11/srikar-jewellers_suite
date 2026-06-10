const { db } = require('./firebase-admin');

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    try {
        const { otp } = JSON.parse(event.body);
        
        // Fetch from Firestore settings/otp
        const otpDoc = await db.collection('settings').doc('otp').get();
        if (!otpDoc.exists) {
            return { statusCode: 400, body: JSON.stringify({ valid: false, message: 'No OTP has been generated.' }) };
        }
        
        const { code, expiresAt } = otpDoc.data();
        const now = new Date().toISOString();
        
        if (now > expiresAt) {
            return { statusCode: 400, body: JSON.stringify({ valid: false, message: 'OTP code has expired.' }) };
        }
        
        const isValid = (otp && otp.trim() === code);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ valid: isValid })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
};
