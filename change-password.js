const { db } = require('./firebase-admin');

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    try {
        const { currentPassword, newPassword } = JSON.parse(event.body);

        let correctPassword = 'srikar123';
        const docRef = db.collection('settings').doc('auth');
        const doc = await docRef.get();
        if (doc.exists) {
            const data = doc.data();
            if (data.stockPassword) {
                correctPassword = data.stockPassword;
            }
        }

        if (currentPassword !== correctPassword) {
            return { statusCode: 401, body: JSON.stringify({ success: false, message: 'Current password incorrect' }) };
        }

        await docRef.set({ stockPassword: newPassword }, { merge: true });
        return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
};
