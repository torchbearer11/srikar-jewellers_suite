const { db } = require('./firebase-admin');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const docRef = await db.collection('dailyUpdates').add(data);
    return {
      statusCode: 200,
      body: JSON.stringify({ id: docRef.id }),
    };
  } catch (error) {
    console.error('Error adding daily update:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Failed to add daily update: ${error.message}` }),
    };
  }
};
