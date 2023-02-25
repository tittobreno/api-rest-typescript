import { Router } from "express";
import { createUser, signIn } from "./controllers/user";

const router = Router();

router.post("/cadastrar", createUser);
router.post("/entrar", signIn);

export default router;
