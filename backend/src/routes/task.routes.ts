import { Router } from "express";
import { assignTask, getAllTasks, updateTaskStatus, deleteTaskById } from "../controllers/task.controller";

const router = Router();

router.post('/create', assignTask)
router.get('/get', getAllTasks)
router.put('/update/:id', updateTaskStatus)
router.delete('/delete/:id', deleteTaskById)


export default router;