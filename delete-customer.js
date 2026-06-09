const { db } = require('./firebase-admin');
exports.handler = async function(event, context) {
    try {
        const { id } = JSON.parse(event.body);
        await db.collection('customers').doc(id).delete();
        return { statusCode: 200, body: JSON.stringify({ message: 'Deleted' }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
};
