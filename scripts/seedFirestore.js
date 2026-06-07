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
  console.log("=========================================");
  console.log("⚠️  تنبيه أمني هام (Security & Seeding Warning):");
  console.log("سيتم رفع/دمج بيانات المحتوى الدراسي فقط (المواد، الوحدات، الدروس، الاختبارات).");
  console.log("لن يتم لمس أو تعديل بيانات المستخدمين، الاشتراكات، المدفوعات، أو محاولات الطلاب.");
  console.log("=========================================");

  // Calculate stats beforehand
  const subjectCount = mockSubjects.length;
  let unitCount = 0;
  let lessonCount = 0;
  let quizCount = 0;

  mockSubjects.forEach(subject => {
    const units = mockLessons[subject.id] || [];
    unitCount += units.length;
    units.forEach(unit => {
      lessonCount += unit.lessons.length;
      unit.lessons.forEach(lesson => {
        const quiz = getQuizForLesson(lesson.id);
        if (quiz) quizCount++;
      });
    });
  });

  console.log(`المجموعات المستهدفة للتهيئة:`);
  console.log(`- المواد (Subjects): ${subjectCount}`);
  console.log(`- الوحدات (Units): ${unitCount}`);
  console.log(`- الدروس (Lessons): ${lessonCount}`);
  console.log(`- الاختبارات (Quizzes): ${quizCount}`);
  console.log("-----------------------------------------");

  // 1. Seed Subjects
  console.log("جاري رفع المواد (Subjects)...");
  for (let i = 0; i < mockSubjects.length; i++) {
    const subject = mockSubjects[i];
    const subjectDoc = {
      id: subject.id,
      slug: subject.id,
      title: subject.title,
      description: subject.description,
      order: i + 1,
      isActive: true,
      hasFoundationSoon: subject.id === 'arabic' || subject.id === 'math',
      image: "",
      unitsCount: subject.unitsCount || 2,
      lessonsCount: subject.lessonsCount || 5,
      testsCount: subject.lessonsCount || 5,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    await db.collection("subjects").doc(subject.id).set(subjectDoc, { merge: true });
    console.log(`- تم رفع المادة: ${subject.id}`);
  }

  // 2. Seed Units
  console.log("جاري رفع الوحدات (Units)...");
  for (const subject of mockSubjects) {
    const units = mockLessons[subject.id] || [];
    for (let uIdx = 0; uIdx < units.length; uIdx++) {
      const unit = units[uIdx];
      const unitDoc = {
        id: unit.unitId,
        subjectId: subject.id,
        title: unit.unitTitle,
        description: "",
        order: uIdx + 1,
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      await db.collection("units").doc(unit.unitId).set(unitDoc, { merge: true });
      console.log(`- تم رفع الوحدة: ${unit.unitId}`);
    }
  }

  // 3. Seed Lessons
  console.log("جاري رفع الدروس (Lessons)...");
  for (const subject of mockSubjects) {
    const units = mockLessons[subject.id] || [];
    for (const unit of units) {
      for (let lIdx = 0; lIdx < unit.lessons.length; lIdx++) {
        const lesson = unit.lessons[lIdx];
        const lessonDoc = {
          id: lesson.id,
          subjectId: subject.id,
          unitId: unit.unitId,
          title: lesson.title,
          description: lesson.description || "",
          order: lIdx + 1,
          isFree: lesson.isFree,
          isActive: true,
          video: {
            provider: lesson.lessonVideo?.provider || "youtube",
            videoId: lesson.lessonVideo?.videoId || "",
            isProtected: lesson.lessonVideo?.isProtected || false,
            protectionNote: lesson.lessonVideo?.protectionNote || "MVP only"
          },
          pdf: {
            title: "ملخص الدرس",
            fileUrl: lesson.pdfUrl || "#",
            storagePath: ""
          },
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        await db.collection("lessons").doc(lesson.id).set(lessonDoc, { merge: true });
        console.log(`- تم رفع الدرس: ${lesson.id}`);
      }
    }
  }

  // 4. Seed Quizzes
  console.log("جاري رفع الاختبارات (Quizzes)...");
  for (const subject of mockSubjects) {
    const units = mockLessons[subject.id] || [];
    for (const unit of units) {
      for (const lesson of unit.lessons) {
        const quiz = getQuizForLesson(lesson.id);
        if (quiz) {
          const quizDoc = {
            id: `quiz-${lesson.id}`,
            lessonId: lesson.id,
            subjectId: subject.id,
            title: quiz.title || `اختبار درس: ${lesson.title}`,
            isActive: true,
            questions: (quiz.questions || []).map((q, idx) => ({
              id: typeof q.id === 'string' ? q.id : `q${idx + 1}`,
              question: q.text || q.question || "",
              options: q.options || [],
              correctAnswerIndex: typeof q.correctAnswer === 'number' ? q.correctAnswer : (q.correctAnswerIndex || 0),
              explanation: q.explanation || "شرح الإجابة"
            })),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          };
          await db.collection("quizzes").doc(quizDoc.id).set(quizDoc, { merge: true });
          console.log(`  * تم رفع اختبار الدرس: ${lesson.id}`);
        }
      }
    }
  }

  console.log("-----------------------------------------");
  console.log("✅ تمت عملية تهيئة ودمج بيانات Firestore بنجاح كامل!");
  console.log(`إحصائيات الإدخال النهائية:`);
  console.log(`- عدد المواد (Subjects): ${subjectCount}`);
  console.log(`- عدد الوحدات (Units): ${unitCount}`);
  console.log(`- عدد الدروس (Lessons): ${lessonCount}`);
  console.log(`- عدد الاختبارات (Quizzes): ${quizCount}`);
  console.log("=========================================");
}

seedData()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ حدث خطأ أثناء عملية تهيئة Firestore:", error);
    process.exit(1);
  });
