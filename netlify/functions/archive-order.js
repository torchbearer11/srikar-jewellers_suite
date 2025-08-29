const { db } = require('./firebase-admin');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { id, orderData } = JSON.parse(event.body);
    if (!id || !orderData) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Order ID and data are required.' }) };
    }

    // Reference to the original document in the 'orders' collection
    const originalOrderRef = db.collection('orders').doc(id);
    
    // Reference to the new document in the 'archivedOrders' collection
    const archivedOrderRef = db.collection('archivedOrders').doc(id);

    // Use a batch write to perform the operations atomically
    const batch = db.batch();
    
    // 1. Set the data in the archived collection
    batch.set(archivedOrderRef, orderData);
    
    // 2. Delete the original document from the active collection
    batch.delete(originalOrderRef);

    // Commit the batch
    await batch.commit();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Order archived successfully.' }),
    };
  } catch (error) {
    console.error('Error archiving order:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Failed to archive order: ${error.message}` }),
    };
  }
};
