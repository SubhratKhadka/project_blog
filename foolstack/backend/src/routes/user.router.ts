import {Router} from "express";
import { getUserDataAndBlogsController } from "../controllers/user.controller";

const router = Router();

/**
 * @current_route   /user
 */

router.get("/:userId", getUserDataAndBlogsController); // get userData and userBlogs


export default router;
