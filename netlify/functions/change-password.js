const { db } = require('./firebase-admin');

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    try {
        const { currentPassword, newPassword } = JSON.parse(event.body);
        
        // Verify current password first
        const authDoc = await db.collection('settings').doc('auth').get();
        let correctPassword = 'srikar123';
        if (authDoc.exists) {
            const data = authDoc.data();
            if (data && data.stockPassword) {
                correctPassword = data.stockPassword;
            }
        }
        
        if (currentPassword !== correctPassword) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Current password is incorrect.' }) };
        }
        
        // Save new password
        await db.collection('settings').doc('auth').set({ stockPassword: newPassword }, { merge: true });
        return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
};
