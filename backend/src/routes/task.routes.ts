import { Router } from "express";
import { assignTask, getAllTasks, updateTaskStatus, deleteTaskById, GetTaskByUser, GetTaskByTaskId } from "../controllers/task.controller";

const router = Router();

router.post('/create', assignTask)
router.get('/get', getAllTasks)
router.get('/get/detail/:id', GetTaskByTaskId)
router.get('/get/:userId', GetTaskByUser)
router.put('/update/:id', updateTaskStatus)
router.delete('/delete/:id', deleteTaskById)



export default router;