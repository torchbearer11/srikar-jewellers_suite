const { db } = require('./firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { id, note } = JSON.parse(event.body);
    if (!id || !note) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Order ID and note are required.' }) };
    }

    const orderRef = db.collection('orders').doc(id);
    await orderRef.update({
      customerNotes: FieldValue.arrayUnion(note)
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Note added successfully.' }),
    };
  } catch (error) {
    console.error('Error adding order note:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Failed to add note: ${error.message}` }),
    };
  }
};
