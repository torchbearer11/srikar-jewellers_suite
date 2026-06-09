const { db } = require('./firebase-admin');

exports.handler = async function(event) {
    try {
        const stockSnapshot = await db.collection('stock').get();
        const stock = stockSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return {
            statusCode: 200,
            body: JSON.stringify({ stock }),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
};
