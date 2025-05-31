import {Router} from "express";
import {
	// createUserController,
	getUserController,
	googleLoginController,
	updateLinksController,
} from "../controllers/auth.controller";

const router = Router();

/**
 * @current_route /auth
 */

router.get("/", getUserController);
// router.post("/", createUserController);
router.put("/", updateLinksController);
router.get("/google", googleLoginController);

export default router;
