const { db } = require('./firebase-admin');

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    try {
        const { password } = JSON.parse(event.body);
        
        let correctPassword = 'srikar123';
        const doc = await db.collection('settings').doc('auth').get();
        if (doc.exists) {
            const data = doc.data();
            if (data.stockPassword) {
                correctPassword = data.stockPassword;
            }
        }

        if (password === correctPassword) {
            return { statusCode: 200, body: JSON.stringify({ authorized: true }) };
        } else {
            return { statusCode: 401, body: JSON.stringify({ authorized: false, message: 'Incorrect password' }) };
        }
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
};
