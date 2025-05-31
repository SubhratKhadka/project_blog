import {Request, Response} from "express";
import {
	CreateBlogI,
	IndividualBlogI,
	RawBlogI,
	ServerResponse,
	VoteType,
} from "../interfaces";
import {uploadBlogCoverImgFile} from "../../db/photoUpload";
import {
	createBlogExec,
	createCommentExec,
	getAllLatestBlogsExec,
	getAllTrendingBlogsExec,
	getIndividualBlogExec,
	getTrendingAndLatestBlogExec,
	updateVoteExec,
} from "../../db/dbBlogQueries";

export const createBlog = async (
	req: Request<{}, {}, CreateBlogI>,
	res: Response<ServerResponse<{blogId: string}>>
) => {
	const {author_id, author_name, title, description} = req.body;
	// console.log(description)

	try {
		if (req.file) {
			const blogCoverImgUrl = await uploadBlogCoverImgFile(req.file);

			const result = await createBlogExec({
				author_id,
				author_name,
				title,
				description,
				blogCoverImgUrl,
			});

			// console.log(result)

			res.json({
				status: 200,
				message: "Successfully created blog",
				data: {
					blogId: result.rows[0].id,
				},
			});
		}
	} catch (error) {
		console.log(error);
		res.json({
			status: 400,
			message: "Failed creating blog",
		});
	}
};

export const getLatestBlogs = async (req: Request, res: Response<ServerResponse<{
	latest: RawBlogI[]
}>>) => {
	const latestBlogs = await getAllLatestBlogsExec();

	res.json({
		status: 200,
		message: "All Latest Blogs have been fetched",
		data: latestBlogs
	});
};
export const getTrendingBlogs = async (req: Request, res: Response<ServerResponse<{
	trending: RawBlogI[]
}>>) => {
	const trendingBlogs = await getAllTrendingBlogsExec();

	res.json({
		status: 200,
		message: "All Trending Blogs have been fetched",
		data: trendingBlogs
	});
};


export const getTrendingAndLatestBlog = async(req: Request, res: Response<ServerResponse<{
	trending: RawBlogI[],
	latest: RawBlogI[]
}>>) => {
	try {
		const trendingAndLatestBlog = await getTrendingAndLatestBlogExec(); 

		res.json({
			status: 200,
			message: "Successfully Fetched Blogs",
			data: trendingAndLatestBlog
		})
		
	} catch (error) {
		res.status(400).json({
			status: 400,
			message: "Error Fetching Blogs"
		})
	}
}

export const getIndividualBlog = async (
	req: Request<{blogId: string, userId: string}>,
	res: Response<ServerResponse<IndividualBlogI>>
) => {
	const {blogId, userId} = req.params;

	try {
		const individualBlog: IndividualBlogI = await getIndividualBlogExec(blogId, userId);
		res.json({
			status: 200,
			message: "Successfully Fetched Blog",
			data: individualBlog,
		});

		// console.log(individualBlog)
	} catch (error) {
		res.status(400).json({
			message: "Blog Can't Be Fetched",
			status: 400,
		});
		console.log(error);
	}
};

export const createComment = async (
	req: Request<{blogId: string}, {}, {commenterId: string; comment: string}>,
	res: Response<ServerResponse<{commentId: string}>>
) => {
	const {blogId} = req.params;
	const {comment, commenterId} = req.body;

	try {
		const commentId = await createCommentExec(commenterId, blogId, comment);

		res.json({
			status: 200,
			message: "Comment Created Successfully",
			data: {
				commentId: commentId,
			},
		});
	} catch (error) {
		res.status(400).json({
			status: 400,
			message: "Couldn't Post Message",
		});
	}
};

export const updateVote = async (
	req: Request<
		{blogId: string},
		{},
		{userId: string; vote: VoteType; prevVote: VoteType}
	>,
	res: Response<ServerResponse<{commentId: string}>>
) => {
	const {blogId} = req.params;
	const {userId, vote, prevVote} = req.body;

	try {
		const voteId = await updateVoteExec(userId, blogId, vote, prevVote);

		res.json({
			status: 200,
			message: `${voteId? "Voted ": "Vote Removed"} Successfully`,
		});
	} catch (error) {
		res.status(400).json({
			status: 400,
			message: "Couldn't Post Message",
		});
	}
};
