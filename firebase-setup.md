# دليل تهيئة وإعداد Firebase لمنصة امتحان النجاح – جيل 2010

يصف هذا الدليل الخطوات اللازمة لتهيئة مشروع فايربيس (Firebase) الجديد، وتفعيل خدمات المصادقة وقواعد البيانات، وربطها بالتطبيق محلياً وعلى خوادم Vercel، بالإضافة لكيفية تعيين أول حساب مسؤول (Admin) بأمان.

---

## 1. إنشاء مشروع Firebase Project جديد
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/).
2. اضغط على **Add project** (إضافة مشروع).
3. اكتب اسم المشروع (مثال: `jeel2010-platform`) ثم اضغط **Continue**.
4. يمكنك تعطيل Google Analytics للمشروع (اختياري للـ MVP) ثم اضغط **Create project**.
5. بعد انتهاء التهيئة، اضغط على أيقونة الويب (`</>`) لتسجيل تطبيق ويب جديد داخل المشروع.
6. اكتب اسماً مستعاراً للتطبيق (مثال: `jeel2010-web`) ثم اضغط **Register app**.
7. ستظهر لك بيانات التكوين (Firebase SDK configuration parameters). سنحتاج لنسخ هذه القيم لاحقاً.

---

## 2. تفعيل خدمة المصادقة (Authentication)
1. من القائمة الجانبية في كونسول فايربيس، اذهب إلى **Build** ثم اختر **Authentication**.
2. اضغط على **Get started**.
3. من تبويب **Sign-in method**، اختر **Email/Password** (البريد الإلكتروني وكلمة المرور).
4. قم بتمكين الخيار الأول (Enable) واضغط **Save** لحفظ التفعيل.

---

## 3. إنشاء قاعدة بيانات Firestore
1. من القائمة الجانبية، اذهب إلى **Build** ثم اختر **Firestore Database**.
2. اضغط على **Create database**.
3. اختر موقع الخادم الأقرب للأردن (مثال: `europe-west3` في فرانكفورت أو `me-central1` في الشرق الأوسط) ثم اضغط **Next**.
4. اختر البدء في **Production mode** (وضع الإنتاج) لحماية بياناتك من البداية بالقواعد الأمنية، ثم اضغط **Create**.
5. بعد تهيئة قاعدة البيانات، اذهب لتبويب **Rules** وقم بنسخ محتويات ملف `firestore.rules` الموجود في جذر المشروع واضغط **Publish**.

---

## 4. ربط المتغيرات محلياً بملف `.env.local`
1. في مجلد المشروع الرئيسي، قم بإنشاء ملف جديد باسم `.env.local` (هذا الملف مخفي ومحمي بملف `.gitignore` ولن يُرفع نهائياً إلى GitHub).
2. انسخ المتغيرات من `.env.example` واملأها بالقيم الخاصة بمشروعك التي حصلت عليها في الخطوة الأولى:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 5. ضبط متغيرات البيئة على Vercel
لتشغيل المنصة على الرابط الرسمي بعد النشر:
1. اذهب لـ Dashboard مشروعك في [Vercel](https://vercel.com/).
2. اختر المشروع واذهب لتبويب **Settings** ثم اختر **Environment Variables** من القائمة الجانبية.
3. قم بإضافة المتغيرات الستة السابقة بنفس المسميات والقيم الخاصة بمشروع الفايربيس الخاص بك.
4. اعد بناء المشروع (Redeploy) لتطبيق المتغيرات الجديدة.

---

## 6. إنشاء أول حساب مسؤول (First Admin Setup)
لحماية المنصة، **يمنع تماماً** إمكانية إنشاء حسابات إدارية من واجهة التسجيل المفتوحة. لتهيئة حساب الإدمن الأول:

1. اذهب إلى كونسول فايربيس -> **Authentication** -> تبويب **Users**.
2. اضغط على **Add user** (إضافة مستخدم).
3. أدخل بريد المسؤول: `admin@jeel2010.com` وكلمة مرور قوية، ثم اضغط **Add user**.
4. بعد إضافة المستخدم، سيظهر لك في الجدول حقل يدعى **User UID** (مثال: `aBc123XyZ...`). انسخ هذه القيمة بدقة.
5. اذهب إلى **Firestore Database** -> اضغط **Start collection** باسم: `users`.
6. في حقل **Document ID**، قم بلصق الـ **User UID** الذي نسخته بدقة.
7. أضف الحقول التالية بداخل الوثيقة:

```javascript
// users/{UID}
{
  uid: "UID_الذي_نسخته",
  name: "مسؤول المنصة",
  email: "admin@jeel2010.com",
  role: "admin",
  subscriptionStatus: "active",
  isActive: true,
  createdAt: serverTimestamp(), // أو قيمة الوقت الحالية بصيغة String
  updatedAt: serverTimestamp()
}
```

8. اضغط **Save**. الآن حساب المسؤول جاهز للولوج لوحة الإدارة بأمان كامل.
