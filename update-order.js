const { db } = require('./firebase-admin');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { id, updates } = JSON.parse(event.body);
    if (!id) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Order ID is required.' }) };
    }
    
    // If the status is being set to 'Delivered', add a timestamp.
    if (updates.status === 'Delivered') {
      updates.deliveredDate = new Date().toISOString();
    }

    await db.collection('orders').doc(id).update(updates);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Order updated successfully.' }),
    };
  } catch (error) {
    console.error('Error updating order:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Failed to update order: ${error.message}` }),
    };
  }
};
