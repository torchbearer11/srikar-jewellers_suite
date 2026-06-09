const { db } = require('./firebase-admin');

exports.handler = async function(event, context) {
  try {
    const customersSnapshot = await db.collection('customers').get();
    const customers = customersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const updatesSnapshot = await db.collection('dailyUpdates').get();
    const dailyUpdates = updatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return {
      statusCode: 200,
      body: JSON.stringify({ customers, dailyUpdates }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
  }
};
