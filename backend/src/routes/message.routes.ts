import { Router } from "express";
import { sendMessage, getMessages, getThreeCurrentMessages } from "../controllers/message.controller";


const router = Router();

router.post('/send', sendMessage)
router.get('/get', getMessages)
router.get('/recent/:userId', getThreeCurrentMessages)


export default router;