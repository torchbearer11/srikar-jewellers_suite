const { db } = require('./firebase-admin');

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    try {
        console.log("Fetching CRM collections from Firestore...");
        
        // Clear dailyUpdates
        const dailyUpdatesSnapshot = await db.collection('dailyUpdates').get();
        if (dailyUpdatesSnapshot.size > 0) {
            const batch1 = db.batch();
            dailyUpdatesSnapshot.docs.forEach(doc => batch1.delete(doc.ref));
            await batch1.commit();
        }
        
        // Clear customers
        const customersSnapshot = await db.collection('customers').get();
        if (customersSnapshot.size > 0) {
            const batch2 = db.batch();
            customersSnapshot.docs.forEach(doc => batch2.delete(doc.ref));
            await batch2.commit();
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'Insta CRM data cleared successfully!' })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
};
