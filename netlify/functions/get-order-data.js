const { db } = require('./firebase-admin');

exports.handler = async function(event, context) {
  try {
    const ordersSnapshot = await db.collection('orders').get();
    const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // You might want to handle archived orders differently, e.g., in a separate collection
    const archivedOrdersSnapshot = await db.collection('archivedOrders').get();
    const archivedOrders = archivedOrdersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return {
      statusCode: 200,
      body: JSON.stringify({ orders, archivedOrders }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
  }
};
