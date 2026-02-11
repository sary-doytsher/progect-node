import express from 'express';
import * as userController from "../controllers/user.js";

const router = express.Router();

// שליפת כל המשתמשים - GET api/users
router.get('/', userController.getUsers);

// רישום משתמש חדש - POST api/users
router.post('/', userController.register); // ודאי שיש פונקציית register בקונטרולר

// התחברות - POST api/users/login (חייב להיות לפני /:id)
router.post('/login', userController.login);

// שליפת משתמש לפי ID - GET api/users/:id
router.get('/:id', userController.getUserById);

// עדכון פרטי משתמש ללא סיסמה - PUT api/users/:id
router.put('/:id', userController.updateUser);

// עדכון סיסמה בלבד - PUT api/users/password/:id
router.put('/password/:id', userController.updatePassword);

export default router;
