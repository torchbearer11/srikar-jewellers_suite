const { db } = require('./firebase-admin');

exports.handler = async function(event, context) {
  try {
    const data = JSON.parse(event.body);
    const docRef = await db.collection('customers').add(data);
    return { statusCode: 200, body: JSON.stringify({ id: docRef.id }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
  }
};
