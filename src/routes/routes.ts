import { Router } from "express";
import getCategories from "../controllers/categories";
import {
  createTransaction,
  detailTransaction,
  listTransactions,
  updateTransaction,
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
router.get("/transacao/detalhar/:id", detailTransaction);
router.put("/transacao/editar/:id", updateTransaction);

export default router;
