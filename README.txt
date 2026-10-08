# برتقالة — المرحلة الثانية

## ما تمت إضافته
- PostgreSQL + Prisma ORM.
- تسجيل/دخول العملاء بـ bcrypt + JWT.
- أدوار CUSTOMER / ADMIN.
- المنتجات والفئات والمخزون.
- عناوين العملاء.
- إنشاء الطلبات وحفظ عناصر الطلب والمبالغ.
- خصم المخزون داخل transaction.
- إدارة الطلبات والمنتجات عبر Admin API.
- طبقة شحن قابلة لاستبدال مزود mock بمزود حقيقي.
- Stripe Checkout اختياري عبر متغيرات البيئة + webhook.
- حماية الأسرار عبر `.env` وعدم تضمين مفاتيح فعلية.

## التشغيل
1. ثبّت Node.js 20+ وDocker.
2. انسخ `.env.example` إلى `.env`.
3. شغّل قاعدة البيانات: `docker compose up -d db`
4. ثبّت الحزم: `npm install`
5. أنشئ Prisma Client: `npm run db:generate`
6. أنشئ الجداول: `npm run db:push`
7. أدخل بيانات تجريبية: `npm run db:seed`
8. شغّل المتجر: `npm start`
9. افتح `http://localhost:3000`

## حساب المدير التجريبي
- email: `admin@orange.local`
- password: `Admin@12345`

**غيّر كلمة المرور فورًا قبل الإنتاج.**

## الدفع
ضع `STRIPE_SECRET_KEY` و `STRIPE_WEBHOOK_SECRET` في `.env`. إذا لم يتم وضعهما، يظل المتجر يعمل لكن الدفع الحقيقي يرجع `PAYMENT_NOT_CONFIGURED`.

## الشحن
المزوّد الافتراضي `mock`. لتوصيل شركة شحن حقيقية، نفّذ نفس واجهة `quote/create` في `server/src/server.js` أو افصلها إلى adapter مستقل.

## الإنتاج
قبل النشر: استخدم PostgreSQL مستضافًا، HTTPS، JWT secret قوي، rate limiting، تحقق schema (Zod)، سجلات ومراقبة، نسخ احتياطية، سياسات الخصوصية/الإرجاع، وربط شركة شحن وبوابة دفع مناسبة لبلد التشغيل.
