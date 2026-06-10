const { db } = require('./firebase-admin');

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    try {
        const { password } = JSON.parse(event.body);
        
        // Get settings/auth doc
        const authDoc = await db.collection('settings').doc('auth').get();
        let correctPassword = 'srikar123'; // Default fallback
        
        if (authDoc.exists) {
            const data = authDoc.data();
            if (data && data.stockPassword) {
                correctPassword = data.stockPassword;
            }
        }
        
        const isMatch = (password === correctPassword);
        return {
            statusCode: 200,
            body: JSON.stringify({ success: isMatch, valid: isMatch })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
};
