import {Router} from "express";
import {
	createBlog,
	createComment,
	getIndividualBlog,
	getLatestBlogs,
	getTrendingAndLatestBlog,
	getTrendingBlogs,
	updateVote,
} from "../controllers/blogs.controller";
import upload from "../../middleware/upload";

const router = Router();

/**
 * @current_route   /blogs
 */

router.get("/", getTrendingAndLatestBlog); // 8 trending and 10 latest
router.post("/", upload.single("blog_cover_img") ,createBlog);
router.get("/latest", getLatestBlogs);
router.get("/trending", getTrendingBlogs);
router.get('/:blogId/:userId', getIndividualBlog)
router.post('/:blogId/comment', createComment)
router.patch('/:blogId/vote', updateVote)

export default router;
