// Mock localStorage for Node environment to prevent import errors in mock files
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {}
};

import admin from "firebase-admin";
import { createRequire } from "module";
import { mockSubjects } from "../src/data/subjects.js";
import { mockLessons } from "../src/data/lessons.js";
import { getQuizForLesson } from "../src/data/quizzes.js";

const require = createRequire(import.meta.url);
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function seedData() {
  console.log("Starting Firestore seeding...");

  // 1. Seed Subjects
  console.log("Seeding subjects...");
  for (const subject of mockSubjects) {
    await db.collection("subjects").doc(subject.id).set({ ...subject, isActive: true }, { merge: true });
    console.log(`- Seeded subject: ${subject.id}`);
  }

  const subjectIds = mockSubjects.map(s => s.id);

  // 2. Seed Units Collection
  console.log("Seeding units collection...");
  for (const subjectId of subjectIds) {
    const units = mockLessons[subjectId] || [];
    let order = 1;
    for (const unit of units) {
      const unitDoc = {
        id: unit.unitId,
        subjectId: subjectId,
        title: unit.unitTitle,
        description: "",
        order: order++,
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      await db.collection("units").doc(unit.unitId).set(unitDoc, { merge: true });
      console.log(`- Seeded unit: ${unit.unitId}`);
    }
  }

  // 3. Seed Lessons (Units grouped in lessons collection)
  console.log("Seeding lessons (units)...");
  for (const subjectId of subjectIds) {
    const units = mockLessons[subjectId] || [];
    await db.collection("lessons").doc(subjectId).set({ units, isActive: true }, { merge: true });
    console.log(`- Seeded lessons for subject: ${subjectId}`);
    
    // 4. Seed Quizzes for each lesson inside the units
    for (const unit of units) {
      for (const lesson of unit.lessons) {
        const quiz = getQuizForLesson(lesson.id);
        if (quiz) {
          await db.collection("quizzes").doc(lesson.id).set({ ...quiz, isActive: true }, { merge: true });
          console.log(`  * Seeded quiz for lesson: ${lesson.id}`);
        }
      }
    }
  }

  console.log("Firestore seeding completed successfully!");
}

seedData()
  .then(() => {
    console.log("Done.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding Firestore:", error);
    process.exit(1);
  });
