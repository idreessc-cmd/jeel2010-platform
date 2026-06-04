import { storage } from '../utils/storage';

const LESSONS_KEY = 'jeel2010_lessons';

const initialLessons = {
    arabic: [
        {
            unitId: 'arabic-u1',
            unitTitle: 'الوحدة الأولى: قيم وحياة',
            lessons: [
                {
                    id: 'arabic-l1',
                    title: 'الدرس الأول: مكارم الأخلاق وحاتم الطائي',
                    isFree: true,
                    description: 'يتناول هذا الدرس شرحاً تفصيلياً لنص مكارم الأخلاق لحاتم الطائي والتعرف على خصال النبل والكرم الجاهلي.',
                    pdfUrl: '#',
                    lessonVideo: {
                        provider: "youtube",
                        videoId: "JgV10L1w6zM",
                        isProtected: false,
                        protectionNote: "MVP only"
                    }
                },
                {
                    id: 'arabic-l2',
                    title: 'الدرس الثاني: قواعد النحو - كان التامة والناقصة',
                    isFree: true,
                    description: 'شرح نحوي مفصل للتفرقة بين كان وأخواتها عندما تأتي تامة ترفع فاعلاً أو ناقصة تدخل على الجملة الاسمية.',
                    pdfUrl: '#',
                    lessonVideo: {
                        provider: "youtube",
                        videoId: "80O6eS5Y6P4",
                        isProtected: false,
                        protectionNote: "MVP only"
                    }
                },
                {
                    id: 'arabic-l3',
                    title: 'الدرس الثالث: البلاغة - الحقيقة والمجاز',
                    isFree: false,
                    description: 'أولى خطوات التذوق البلاغي؛ التعرف على الفرق الدقيق بين استخدام التعبيرات الحقيقية والتعبيرات المجازية.',
                    pdfUrl: '#',
                    lessonVideo: {
                        provider: "youtube",
                        videoId: "Yh94Nn97XyQ",
                        isProtected: false,
                        protectionNote: "MVP only"
                    }
                }
            ]
        },
        {
            unitId: 'arabic-u2',
            unitTitle: 'الوحدة الثانية: بناء وتعمير',
            lessons: [
                {
                    id: 'arabic-l4',
                    title: 'الدرس الرابع: العمل الحر في الإسلام',
                    isFree: false,
                    description: 'دراسة وتحليل نص العمل الحر ورؤية الإسلام للإنتاج والسعي في الأرض وتعمير الكون.',
                    pdfUrl: '#',
                    lessonVideo: {
                        provider: "youtube",
                        videoId: "9c9H9fG2Boc",
                        isProtected: false,
                        protectionNote: "MVP only"
                    }
                },
                {
                    id: 'arabic-l5',
                    title: 'الدرس الخامس: قواعد النحو - كاد وأخواتها (أفعال المقاربة والرجاء والشروع)',
                    isFree: false,
                    description: 'شرح عمل كاد وأخواتها وشروط اقتران خبرها بأن وأثرها في الجمل النحوية.',
                    pdfUrl: '#',
                    lessonVideo: {
                        provider: "youtube",
                        videoId: "D_mHl9a0tC4",
                        isProtected: false,
                        protectionNote: "MVP only"
                    }
                }
            ]
        }
    ],
    math: [
        {
            unitId: 'math-u1',
            unitTitle: 'الوحدة الأولى: الجبر والمصفوفات',
            lessons: [
                {
                    id: 'math-l1',
                    title: 'الدرس الأول: حل معادلة الدرجة الثانية في متغير واحد',
                    isFree: true,
                    description: 'مراجعة وحل معادلات الدرجة الثانية جبرياً وبيانياً والتعرف على الأعداد التخيلية والمركبة.',
                    pdfUrl: '#',
                    lessonVideo: {
                        provider: "youtube",
                        videoId: "J61fGjKxV9M",
                        isProtected: false,
                        protectionNote: "MVP only"
                    }
                },
                {
                    id: 'math-l2',
                    title: 'الدرس الثاني: مقدمة عن الأعداد المركبة',
                    isFree: true,
                    description: 'شرح مفهوم العدد التخيلي "ت" وتدريب الطالب على كتابة الأعداد المركبة وتساوي عددين مركبين.',
                    pdfUrl: '#',
                    lessonVideo: {
                        provider: "youtube",
                        videoId: "G26cQo75L4o",
                        isProtected: false,
                        protectionNote: "MVP only"
                    }
                },
                {
                    id: 'math-l3',
                    title: 'الدرس الثالث: تحديد نوع جذري المعادلة التربيعية',
                    isFree: false,
                    description: 'استخدام المميز لتحديد ما إذا كان جذرا المعادلة التربيعية حقيقيين مختلفين، متساويين، أو مركبين غير حقيقيين.',
                    pdfUrl: '#',
                    lessonVideo: {
                        provider: "youtube",
                        videoId: "8mNl6dMh_p4",
                        isProtected: false,
                        protectionNote: "MVP only"
                    }
                }
            ]
        },
        {
            unitId: 'math-u2',
            unitTitle: 'الوحدة الثانية: حساب المثلثات',
            lessons: [
                {
                    id: 'math-l4',
                    title: 'الدرس الرابع: الزاوية الموجهة القياسية',
                    isFree: false,
                    description: 'فهم مفهوم الزاوية الموجهة في المستوى الإحداثي المتعامد وقياسها الموجب والسالب.',
                    pdfUrl: '#',
                    lessonVideo: {
                        provider: "youtube",
                        videoId: "nUvGg3Z9zY0",
                        isProtected: false,
                        protectionNote: "MVP only"
                    }
                }
            ]
        }
    ],
    history: [
        {
            unitId: 'history-u1',
            unitTitle: 'الوحدة الأولى: مدخل لدراسة التاريخ والحضارة',
            lessons: [
                {
                    id: 'history-l1',
                    title: 'الدرس الأول: مفهوم الحضارة والتاريخ',
                    isFree: true,
                    description: 'كيف نشأت الحضارة الإنسانية؟ وما هو علم التاريخ وأهميته وخصائص العصور التاريخية الأربعة المتعاقبة.',
                    pdfUrl: '#',
                    lessonVideo: {
                        provider: "youtube",
                        videoId: "fA59Xo_7pIo",
                        isProtected: false,
                        protectionNote: "MVP only"
                    }
                },
                {
                    id: 'history-l2',
                    title: 'الدرس الثاني: مصادر دراسة التاريخ',
                    isFree: true,
                    description: 'دراسة المصادر الأولية كالمقابر والنقوش والبرديات والمصادر الثانوية ككتب الفلاسفة والمؤرخين والمراجع.',
                    pdfUrl: '#',
                    lessonVideo: {
                        provider: "youtube",
                        videoId: "y0eN10w4yU4",
                        isProtected: false,
                        protectionNote: "MVP only"
                    }
                },
                {
                    id: 'history-l3',
                    title: 'الدرس الثالث: عوامل قيام الحضارات',
                    isFree: false,
                    description: 'تحليل العوامل الطبيعية كالمناخ والأنهار والحدود الطبيعية، والعوامل البشرية المتمثلة في الكفاح الإنساني.',
                    pdfUrl: '#',
                    lessonVideo: {
                        provider: "youtube",
                        videoId: "s6H1Ld5e6kE",
                        isProtected: false,
                        protectionNote: "MVP only"
                    }
                }
            ]
        }
    ],
    islamic: [
        {
            unitId: 'islamic-u1',
            unitTitle: 'الوحدة الأولى: العقيدة الإسلامية والعبادات',
            lessons: [
                {
                    id: 'islamic-l1',
                    title: 'الدرس الأول: الإيمان بالله ورعايته للكون',
                    isFree: true,
                    description: 'أدلة وجود الله في الأنفس والآفاق، ومظاهر رعاية الله سبحانه وتعالى وعنايته بالكون والمخلوقات.',
                    pdfUrl: '#',
                    lessonVideo: {
                        provider: "youtube",
                        videoId: "LgWdM02i39U",
                        isProtected: false,
                        protectionNote: "MVP only"
                    }
                },
                {
                    id: 'islamic-l2',
                    title: 'الدرس الثاني: التيسير والاعتدال في الإسلام',
                    isFree: true,
                    description: 'مفهوم السماحة والاعتدال في تطبيق الشرائع الإسلامية وأمثلة على التيسير في فقه العبادات.',
                    pdfUrl: '#',
                    lessonVideo: {
                        provider: "youtube",
                        videoId: "M0gN4e6mO7s",
                        isProtected: false,
                        protectionNote: "MVP only"
                    }
                },
                {
                    id: 'islamic-l3',
                    title: 'الدرس الثالث: فقه الصيام وأحكامه',
                    isFree: false,
                    description: 'التعرف على فرائض وسنن ومبطلات الصيام، والأعذار المبيحة للفطر في شهر رمضان الكريم.',
                    pdfUrl: '#',
                    lessonVideo: {
                        provider: "youtube",
                        videoId: "Qd9C0w7G6D8",
                        isProtected: false,
                        protectionNote: "MVP only"
                    }
                }
            ]
        }
    ]
};

// Initialize lessons list in localStorage if it doesn't exist
export const initializeLessons = () => {
    let lessons = storage.get(LESSONS_KEY);
    if (!lessons) {
        lessons = initialLessons;
        storage.set(LESSONS_KEY, lessons);
    }
    return lessons;
};

// Export a reactive proxy that automatically queries the latest data from LocalStorage on property access
export const mockLessons = new Proxy({}, {
    get: (target, prop) => {
        const lessons = initializeLessons();
        return lessons[prop] || [];
    }
});

// Admin helper function to add lessons dynamically
export const addLessonToSubject = (subjectId, unitId, newLesson) => {
    const lessons = initializeLessons();
    if (!lessons[subjectId]) {
        lessons[subjectId] = [];
    }
    
    const unitIndex = lessons[subjectId].findIndex(u => u.unitId === unitId);
    if (unitIndex !== -1) {
        lessons[subjectId][unitIndex].lessons.push(newLesson);
    } else {
        // Create unit if not found
        lessons[subjectId].push({
            unitId: unitId,
            unitTitle: `الوحدة: ${unitId.replace(/-/g, ' ')}`,
            lessons: [newLesson]
        });
    }
    storage.set(LESSONS_KEY, lessons);
    return { success: true };
};
