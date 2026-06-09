const { db } = require('./firebase-admin');

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    try {
        const data = JSON.parse(event.body);
        const boxId = data.boxNo.toString();
        
        const boxData = {
            boxNo: parseInt(data.boxNo),
            totalWeight: parseFloat(data.totalWeight),
            boxWeight: parseFloat(data.boxWeight),
            lastManualUpdate: new Date().toISOString()
        };

        await db.collection('stock').doc(boxId).set(boxData, { merge: true });
        return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
};
