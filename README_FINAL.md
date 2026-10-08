# برتقالة — المرحلة النهائية

متجر عربي Full-Stack جاهز للنشر، مع:
- واجهة المتجر RTL متجاوبة.
- PostgreSQL + Prisma.
- تسجيل/دخول العملاء JWT مع bcrypt.
- المنتجات والفئات والمخزون.
- عناوين العملاء.
- إنشاء الطلبات مع خصم المخزون داخل transaction.
- حالات الطلب والدفع والشحن.
- لوحة إدارة للطلبات والإحصائيات.
- Stripe Checkout + Webhook عند إضافة مفاتيح Stripe.
- طبقة شحن قابلة لاستبدال mock بمزوّد حقيقي.
- Docker وRender Blueprint.

## أسهل نشر للمبتدئ

1. أنشئ قاعدة PostgreSQL مجانية على Neon أو Supabase.
2. أنشئ خدمة Web على Render وارفع هذا المشروع من GitHub.
3. ضع المتغيرات الموجودة في `.env.example` داخل Render.
4. اجعل `CORS_ORIGIN` هو رابط Render أو الدومين النهائي.
5. شغّل:
   - `npm install`
   - `npm run db:generate`
   - `npm run db:push`
   - `npm run db:seed`
6. افتح رابط Render.

## الدفع

الدفع الحقيقي لا يعمل حتى تضيف مفاتيح Stripe الخاصة بحسابك وتضبط Webhook على:
`https://YOUR-DOMAIN/api/payments/webhook`

## المدير التجريبي

البريد: `admin@orange.local`
كلمة المرور: `Admin@12345`

غيّر كلمة المرور قبل الإنتاج.

## ملاحظات الإنتاج

- لا ترفع `.env` إلى GitHub.
- غيّر بيانات المدير.
- استخدم HTTPS.
- لا تستخدم SHIPPING_PROVIDER=mock عند بدء الشحن الفعلي.
- راجع الضرائب وسياسة الإرجاع والخصوصية حسب بلد التشغيل.
