<!DOCTYPE html>
<html lang="he">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clock System API Documentation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; direction: rtl; padding: 2%; }
        h1, h2 { text-align: center; color: #333; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: center; }
        th { background-color: #f4f4f4; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .method { font-weight: bold; }
    </style>
</head>
<body>
    <h1>תיעוד API - מערכת ניהול שעונים</h1>

    <h2>שעונים (Clocks)</h2>
    <table>
        <thead>
            <tr>
                <th>Method</th>
                <th>URL</th>
                <th>Parameters</th>
                <th>Body</th>
                <th>תיאור</th>
                <th>שגיאות אפשריות</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="method">GET</td>
                <td>/api/clocks</td>
                <td>-</td>
                <td>-</td>
                <td>שליפת רשימת כל השעונים</td>
                <td>-</td>
            </tr>
            <tr>
                <td class="method">GET</td>
                <td>/api/clocks/:id</td>
                <td>id</td>
                <td>-</td>
                <td>שליפת שעון לפי מזהה</td>
                <td>Invalid ID, Not Found</td>
            </tr>
            <tr>
                <td class="method">POST</td>
                <td>/api/clocks</td>
                <td>-</td>
                <td>brand, model, price, stock, imagePath</td>
                <td>הוספת שעון חדש למלאי</td>
                <td>Missing fields, Validation error</td>
            </tr>
            <tr>
                <td class="method">PUT</td>
                <td>/api/clocks/:id</td>
                <td>id</td>
                <td>brand, model, price, stock, imagePath</td>
                <td>עדכון פרטי שעון קיים</td>
                <td>Invalid ID, Not Found</td>
            </tr>
        </tbody>
    </table>

    <h2>משתמשים (Users)</h2>
    <table>
        <thead>
            <tr>
                <th>Method</th>
                <th>URL</th>
                <th>Parameters</th>
                <th>Body</th>
                <th>תיאור</th>
                <th>שגיאות אפשריות</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="method">POST</td>
                <td>/api/users/register</td>
                <td>-</td>
                <td>userName, email, password</td>
                <td>רישום משתמש חדש</td>
                <td>Missing fields, Email already exists</td>
            </tr>
            <tr>
                <td class="method">POST</td>
                <td>/api/users/login</td>
                <td>-</td>
                <td>userName, password</td>
                <td>התחברות למערכת</td>
                <td>Invalid credentials</td>
            </tr>
            <tr>
                <td class="method">PUT</td>
                <td>/api/users/password/:id</td>
                <td>id</td>
                <td>password</td>
                <td>עדכון סיסמה למשתמש</td>
                <td>Invalid ID, Missing password</td>
            </tr>
        </tbody>
    </table>

    <h2>הזמנות (Orders)</h2>
    <table>
        <thead>
            <tr>
                <th>Method</th>
                <th>URL</th>
                <th>Parameters</th>
                <th>Body</th>
                <th>תיאור</th>
                <th>שגיאות אפשריות</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="method">POST</td>
                <td>/api/orders</td>
                <td>-</td>
                <td>userId, items: [{ clockId, quantity }]</td>
                <td>יצירת הזמנה חדשה</td>
                <td>Missing fields, Out of stock</td>
            </tr>
            <tr>
                <td class="method">GET</td>
                <td>/api/orders/user/:userId</td>
                <td>userId</td>
                <td>-</td>
                <td>צפייה בהיסטוריית הזמנות של משתמש</td>
                <td>User not found</td>
            </tr>
            <tr>
                <td class="method">PUT</td>
                <td>/api/orders/:id</td>
                <td>id</td>
                <td>status (paid/pending)</td>
                <td>עדכון סטטוס תשלום/הזמנה</td>
                <td>Invalid ID, Unauthorized</td>
            </tr>
        </tbody>
    </table>
</body>
</html>