const { db } = require('./firebase-admin');

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    try {
        const data = JSON.parse(event.body);
        const saleData = {
            itemName: data.itemName || '',
            boxNo: data.boxNo ? parseInt(data.boxNo) : null,
            grossWeight: parseFloat(data.grossWeight),
            netWeight: data.netWeight ? parseFloat(data.netWeight) : null,
            salesPerson: data.salesPerson || '',
            date: data.date || '',
            timestamp: new Date().toISOString()
        };
        const docRef = await db.collection('sales').add(saleData);
        return { statusCode: 200, body: JSON.stringify({ id: docRef.id }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
};
