Clock & Order Management System 🕰️
מערכת Backend לניהול מלאי שעונים, משתמשים והזמנות
פרויקט סיום בקורס Node.js, המציג מערכת ניהול מלאה המבוססת על ארכיטקטורת MVC ומספקת ממשק API עשיר.

🚀 טכנולוגיות בשימוש
Runtime: Node.js

Framework: Express.js

Database: MongoDB (Mongoose ODM)

Security: Bcrypt.js להצפנת סיסמאות

Architecture: MVC (Models, Views, Controllers)

📁 מבנה הפרויקט
models/ - הגדרת הסכימות של המידע (User, Clock, Order).

controllers/ - הלוגיקה העסקית והטיפול בנתונים.

routes/ - ניתוב הבקשות לפי נתיבי ה-API (Users, Clocks, Orders).

app.js - קובץ השרת הראשי וחיבור למסד הנתונים.

🛠 התקנה והרצה מקומית
שכפלו את המאגר (Clone):

Bash
git clone <your-repository-link>
התקינו את התלויות:

Bash
npm install
הגדירו קובץ .env עם משתנה MONGO_URI.

הריצו את השרת:

Bash
npm start
📋 נקודות קצה (API Endpoints) - תמצית
שעונים (Clocks)
GET /api/clocks - שליפת כל השעונים.

POST /api/clocks - הוספת שעון חדש (ניהול מלאי).

PUT /api/clocks/:id - עדכון פרטי שעון.

משתמשים (Users)
POST /api/users/register - רישום משתמש חדש.

POST /api/users/login - התחברות מאובטחת.

PUT /api/users/password/:id - עדכון סיסמה.

הזמנות (Orders)
POST /api/orders - יצירת הזמנה חדשה.

GET /api/orders/user/:userId - היסטוריית הזמנות למשתמש.

PUT /api/orders/:id - עדכון סטטוס תשלום/הזמנה.

הנחיות נוספות להגשה:
קישור לרנדר (Render): [הוסיפי כאן את הקישור שקיבלת מרנדר]

דף תיעוד (Documentation): מצורף כקובץ apiTables.html במאגר.git add .