// clear-crm-data.js
const { db } = require('./netlify/functions/firebase-admin');

async function clearCrm() {
    console.log("Fetching CRM collections from Firestore...");
    
    // Clear dailyUpdates
    const dailyUpdatesSnapshot = await db.collection('dailyUpdates').get();
    console.log(`Found ${dailyUpdatesSnapshot.size} daily updates. Deleting...`);
    if (dailyUpdatesSnapshot.size > 0) {
        const batch1 = db.batch();
        dailyUpdatesSnapshot.docs.forEach(doc => batch1.delete(doc.ref));
        await batch1.commit();
        console.log("Deleted all daily update records.");
    }
    
    // Clear customers
    const customersSnapshot = await db.collection('customers').get();
    console.log(`Found ${customersSnapshot.size} customers. Deleting...`);
    if (customersSnapshot.size > 0) {
        const batch2 = db.batch();
        customersSnapshot.docs.forEach(doc => batch2.delete(doc.ref));
        await batch2.commit();
        console.log("Deleted all customer records.");
    }
    
    console.log("Insta CRM data cleared successfully!");
    process.exit(0);
}

clearCrm().catch(err => {
    console.error("Error clearing CRM data:", err);
    process.exit(1);
});
