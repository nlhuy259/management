import { Router } from "express";
import { sendMessage, getMessages } from "../controllers/message.controller";

const router = Router();

router.post('/send', sendMessage)
router.get('/get', getMessages)


export default router;