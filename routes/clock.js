import express from 'express';
// ייבוא הפונקציות מהקונטרולר
import { 
    createClock, 
    deleteClock, 
    getClockById, 
    getClocks, 
    updateClock 
} from "../controllers/clock.js";

const router = express.Router();

/**
 * נתיבים עבור ניהול שעונים
 * שימי לב: הקידומת 'api/clocks' מוגדרת בדרך כלל בקובץ השרת הראשי (server.js/app.js)
 */

// שליפת כל השעונים - GET api/clocks
router.get('/', getClocks);

// שליפת שעון ספציפי לפי מזהה - GET api/clocks/:id
router.get('/:id', getClockById);

// הוספת שעון חדש - POST api/clocks
router.post('/', createClock);

// עדכון פרטי שעון קיים - PUT api/clocks/:id
router.put('/:id', updateClock);

// מחיקת שעון מהמערכת - DELETE api/clocks/:id
router.delete('/:id', deleteClock);

export default router;