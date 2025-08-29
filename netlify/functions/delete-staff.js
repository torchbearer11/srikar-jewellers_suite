const { db } = require('./firebase-admin');

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    try {
        const { id } = JSON.parse(event.body);
        await db.collection('staff').doc(id).delete();
        return { statusCode: 200, body: JSON.stringify({ message: 'Deleted' }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
};
