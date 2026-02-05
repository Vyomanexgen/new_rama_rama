// Quick test script to verify Firestore attendance read/write
// Run this in browser console to test Firestore connectivity

import { auth, db } from './firebase';
import { collection, query, where, getDocs, doc, setDoc, Timestamp } from 'firebase/firestore';

async function testFirestore() {
    console.log("=".repeat(50));
    console.log("FIRESTORE ATTENDANCE TEST");
    console.log("=".repeat(50));

    const user = auth.currentUser;

    if (!user) {
        console.error("❌ No user logged in!");
        return;
    }

    console.log("✅ User logged in:", user.uid);
    console.log();

    // Test 1: Write attendance
    console.log("TEST 1: Writing test attendance record...");
    const testDate = new Date().toISOString().split("T")[0];
    const testDocId = `${user.uid}_${testDate}`;

    try {
        await setDoc(doc(db, "attendance", testDocId), {
            uid: user.uid,
            date: testDate,
            status: "present",
            location: { lat: 13.082680, lng: 80.270718 },
            distanceFromOffice: 10,
            time: Timestamp.now()
        }, { merge: true });

        console.log("✅ Write successful!");
        console.log("   Document ID:", testDocId);
    } catch (err) {
        console.error("❌ Write failed:", err.message);
        return;
    }

    console.log();

    // Test 2: Read attendance
    console.log("TEST 2: Reading attendance records...");

    try {
        const q = query(
            collection(db, "attendance"),
            where("uid", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        console.log("✅ Read successful!");
        console.log("   Number of records:", snapshot.docs.length);

        snapshot.docs.forEach(doc => {
            console.log("   -", doc.id, ":", doc.data());
        });

    } catch (err) {
        console.error("❌ Read failed:", err.message);
        console.error("   Error code:", err.code);
    }

    console.log();
    console.log("=".repeat(50));
    console.log("TEST COMPLETE");
    console.log("=".repeat(50));
}

// Export for use in console
window.testFirestore = testFirestore;

console.log("Test loaded! Run: testFirestore()");
