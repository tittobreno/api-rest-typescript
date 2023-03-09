import { Response, Router } from "express";
import getCategories from "../controllers/categories";
import { createUser, signIn } from "../controllers/user";
import authenticateUser from "../middlewares/userAuthenticator";
import { createTransaction } from "../controllers/transactions";
import { MyReq } from "../types";
const router = Router();

router.post("/cadastrar", createUser);
router.post("/entrar", signIn);

router.use(authenticateUser);

router.get("/categorias", getCategories);

router.post("/transacao/cadastrar", createTransaction);

router.get("/test", (req: MyReq, res: Response) => {
  const user = req.userData;
  return res.json(user);
});
export default router;
