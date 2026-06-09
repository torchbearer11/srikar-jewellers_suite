const { db } = require('./firebase-admin');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { id, data } = JSON.parse(event.body);
    if (!id) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Customer ID is required.' }) };
    }

    await db.collection('customers').doc(id).update(data);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Customer updated successfully.' }),
    };
  } catch (error) {
    console.error('Error updating customer:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Failed to update customer: ${error.message}` }),
    };
  }
};
