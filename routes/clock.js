import express from 'express';


import {createClock,deleteClock,getClockById,getClocks,updateClock}from "../controllers/clock.js";

const router = express.Router();
router.get('/', getClocks);
router.get('/:id', getClockById);
router.post('/', createClock);
router.put('/:id', updateClock);
router.delete('/:id', deleteClock);
export default router;