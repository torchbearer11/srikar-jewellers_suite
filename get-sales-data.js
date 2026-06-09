const { db } = require('./firebase-admin');

exports.handler = async function(event) {
    try {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneWeekAgoStr = oneWeekAgo.toISOString().split('T')[0]; // YYYY-MM-DD

        // 1. Purge sales older than 7 days
        const expiredSalesSnapshot = await db.collection('sales')
            .where('date', '<', oneWeekAgoStr)
            .get();

        if (!expiredSalesSnapshot.empty) {
            const batch = db.batch();
            expiredSalesSnapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        }

        // 2. Fetch active sales
        const salesSnapshot = await db.collection('sales').get();
        const sales = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return {
            statusCode: 200,
            body: JSON.stringify({ sales }),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
};
