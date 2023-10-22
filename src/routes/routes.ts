import { Router } from "express";
import getCategories from "../controllers/categories";
import {
  createTransaction,
  deleteTransaction,
  detailTransaction,
  listTransactions,
  updateTransaction,
} from "../controllers/transactions";
import {
  createUser,
  detailUser,
  signIn,
  updateUser,
} from "../controllers/user";
import authenticateUser from "../middlewares/userAuthenticator";
const router = Router();

router.post("/cadastrar", createUser);
router.post("/entrar", signIn);

router.use(authenticateUser);

router.patch("/usuario/editar", updateUser);
router.get("/detalhar", detailUser);

router.get("/categorias", getCategories);

router.get("/transacao/listar", listTransactions);
router.post("/transacao/cadastrar", createTransaction);
router.get("/transacao/detalhar/:id", detailTransaction);
router.put("/transacao/editar/:id", updateTransaction);
router.delete("/transacao/deletar/:id", deleteTransaction);

export default router;
