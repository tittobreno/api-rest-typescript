import { Router } from "express";
import getCategories from "../controllers/categories";
import {
  createTransaction,
  listTransactions,
} from "../controllers/transactions";
import { createUser, signIn } from "../controllers/user";
import authenticateUser from "../middlewares/userAuthenticator";
const router = Router();

router.post("/cadastrar", createUser);
router.post("/entrar", signIn);

router.use(authenticateUser);

router.get("/categorias", getCategories);

router.get("/transacao/listar", listTransactions);
router.post("/transacao/cadastrar", createTransaction);

export default router;
