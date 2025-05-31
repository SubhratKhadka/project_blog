import { QueryResult } from "pg";
import { Database } from "./db.config";
import {
  Comment,
  CreateBlogI,
  IndividualBlogI,
  RawBlogI,
  userI,
  VoteType,
} from "../src/interfaces";
// gettin db pool
const pool = Database.getInstance().dbConnection;

const createBlogExec = async (
  blogData: CreateBlogI & { blogCoverImgUrl: string }
) => {
  const { title, description, author_id, author_name, blogCoverImgUrl } =
    blogData;

  // console.log(description);

  const result: QueryResult<{ id: string }> = await pool.query(
    `
         INSERT INTO blogs (title, description, author_id, author_name, blog_image_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;`,
    [title, description, author_id, author_name, blogCoverImgUrl]
  );

  return result;
};

const getAllTrendingBlogsExec = async (): Promise<{
  trending: RawBlogI[];
}> => {
  const getAllTrendingBlogsQuery = `
  SELECT * FROM blogs
  ORDER BY upvotes DESC
  `;

  try {
    const allTrendingResult = await pool.query(getAllTrendingBlogsQuery);

    return {
      trending: allTrendingResult.rows,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllLatestBlogsExec = async (): Promise<{
  latest: RawBlogI[];
}> => {
  const getAllLatestBlogsQuery = `
  SELECT * FROM blogs
  ORDER BY created_at DESC
  `;

  try {
    const allLatestResult = await pool.query(getAllLatestBlogsQuery);

    return {
      latest: allLatestResult.rows,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getTrendingAndLatestBlogExec = async (): Promise<{
  trending: RawBlogI[];
  latest: RawBlogI[];
}> => {
  try {
    const trendingQuery = `
      SELECT * FROM blogs
      ORDER BY upvotes DESC
      LIMIT 8
    `;

    const latestQuery = `
      SELECT * FROM blogs
      ORDER BY created_at DESC
      LIMIT 10
    `;

    const trendingResult = await pool.query(trendingQuery);
    const latestResult = await pool.query(latestQuery);

    return {
      trending: trendingResult.rows,
      latest: latestResult.rows,
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

const getIndividualBlogExec = async (blogId: string, userId: string) => {
  try {
    // 		const result = await pool.query(
    // 			`WITH selected_blog AS (
    // 			SELECT * FROM blogs WHERE id = $1
    // 			),
    // 			top_comments AS (
    // 			SELECT * FROM comments
    // 			WHERE blog_id = $1
    // 			ORDER BY created_at DESC
    // 			LIMIT 5
    // 			),
    // 			comment_replies AS (
    // 			SELECT * FROM replies
    // 			WHERE comment_id IN (SELECT id FROM top_comments)
    // 			)
    // 			SELECT
    // 			sb.id,
    // 			sb.author_id,
    // 			sb.author_name,
    // 			sb.title,
    // 			sb.blog_image_url,
    // 			sb.description,
    // 			sb.created_at,
    // 			sb.updated_at,
    // 			sb.upvotes,
    // 			sb.downvotes,
    // 			json_agg(
    // 				json_build_object(
    // 				'id', c.id,
    // 				'comment', c.comment,
    // 				'created_at', c.created_at,
    // 				'user', json_build_object(
    // 					'id', u.id,
    // 					'name', u.username,
    // 					'image', u.user_img_src
    // 				),
    // 				'replies', (
    // 					SELECT json_agg(
    // 					json_build_object(
    // 						'id', r.id,
    // 						'reply_message', r.reply_message,
    // 						'created_at', r.created_at,
    // 						'replier', json_build_object(
    // 						'id', ru.id,
    // 						'name', ru.username,
    // 						'image', ru.user_img_src
    // 						)
    // 					)
    // 					)
    // 					FROM comment_replies r
    // 					JOIN users ru ON ru.id = r.replier_id
    // 					WHERE r.comment_id = c.id
    // 				)
    // 				)
    // 			) AS comments
    // 			FROM selected_blog sb
    // 			LEFT JOIN top_comments c ON sb.id = c.blog_id
    // 			LEFT JOIN users u ON u.id = c.user_id
    // 			GROUP BY
    // 			sb.id, sb.author_id, sb.author_name, sb.title, sb.blog_image_url,
    // 			sb.description, sb.created_at, sb.updated_at, sb.upvotes, sb.downvotes;
    // `,
    // 	[blogId]
    // );

    const result = await pool.query(
      `
  WITH selected_blog AS (
    SELECT * FROM blogs WHERE id = $1
  ),
  top_comments AS (
    SELECT * FROM comments
    WHERE blog_id = $1
    ORDER BY created_at DESC
    LIMIT 5
  ),
  comment_replies AS (
    SELECT * FROM replies
    WHERE comment_id IN (SELECT id FROM top_comments)
  ),
  user_vote AS (
    SELECT vote_type FROM blog_votes
    WHERE blog_id = $1 AND user_id = $2
    LIMIT 1
  )
  SELECT 
    sb.id,
    sb.author_id,
    sb.author_name,
    sb.title,
    sb.blog_image_url,
    sb.description,
    sb.created_at,
    sb.updated_at,
    sb.upvotes,
    sb.downvotes,
    (SELECT vote_type FROM user_vote) AS user_vote_type,
    json_agg(
      json_build_object(
        'id', c.id,
        'comment', c.comment,
        'created_at', c.created_at,
        'user', json_build_object(
          'id', u.id,
          'name', u.username,
          'image', u.user_img_src
        ),
        'replies', (
          SELECT json_agg(
            json_build_object(
              'id', r.id,
              'reply_message', r.reply_message,
              'created_at', r.created_at,
              'replier', json_build_object(
                'id', ru.id,
                'name', ru.username,
                'image', ru.user_img_src
              )
            )
          )
          FROM comment_replies r
          JOIN users ru ON ru.id = r.replier_id
          WHERE r.comment_id = c.id
        )
      )
    ) AS comments
  FROM selected_blog sb
  LEFT JOIN top_comments c ON sb.id = c.blog_id
  LEFT JOIN users u ON u.id = c.user_id
  GROUP BY 
    sb.id, sb.author_id, sb.author_name, sb.title, sb.blog_image_url,
    sb.description, sb.created_at, sb.updated_at, sb.upvotes, sb.downvotes;
  `,
      [blogId, userId]
    );

    const blogData = result.rows[0];
    return blogData;
  } catch (error) {
    throw error;
  }
};

const getAllUserBlogsById = async (userId: string): Promise<RawBlogI[]> => {
  try {
    const result: QueryResult<RawBlogI> = await pool.query(`
      SELECT * FROM blogs
      WHERE author_id = $1
      ORDER BY created_at DESC
      `, [userId])

      return result.rows
  } catch (error) {
    console.log(error)
    throw error
  }
}

const createCommentExec = async (
  commenterId: string,
  blogId: string,
  comment: string
) : Promise<Comment>=> {
  try {
    const result: QueryResult<Comment> = await pool.query(
      `
			INSERT INTO comments (blog_id, user_id, comment)
			VALUES ($1, $2, $3)
			RETURNING *;`,
      [blogId, commenterId, comment]
    );

    // console.log(result)


    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateVoteExec = async (
  userId: string,
  blogId: string,
  vote: VoteType,
  prevVote: VoteType
) => {
  // logic: prevVote == null ?
  // "increment in upvote/downvote(blog) and insert in blog_votes" :
  // "Decrement from prevVote type(blog) and delete in blog_vote using userId [we ain't need voteId as 1 vote per userId]"

  const client = await pool.connect(); // for transaction
  try {
    await client.query("BEGIN");

    let voteId: string | null = null;

    if (prevVote === null) {
      // New vote
      const result = await client.query(
        `INSERT INTO blog_votes (blog_id, user_id, vote_type)
				 VALUES ($1, $2, $3)
				 RETURNING id;`,
        [blogId, userId, vote]
      );

      await client.query(
        `UPDATE blogs SET ${vote === "upvote" ? "upvotes" : "downvotes"} = ${
          vote === "upvote" ? "upvotes" : "downvotes"
        } + 1 WHERE id = $1`,
        [blogId]
      );

      voteId = result.rows[0].id;
    } else if (prevVote === vote) {
      // User is toggling same vote → remove it
      await client.query(
        `DELETE FROM blog_votes WHERE blog_id = $1 AND user_id = $2`,
        [blogId, userId]
      );

      await client.query(
        `UPDATE blogs SET ${vote === "upvote" ? "upvotes" : "downvotes"} = ${
          vote === "upvote" ? "upvotes" : "downvotes"
        } - 1 WHERE id = $1`,
        [blogId]
      );
    } else {
      // Vote type changed (upvote <-> downvote)
      await client.query(
        `UPDATE blog_votes SET vote_type = $1 WHERE blog_id = $2 AND user_id = $3`,
        [vote, blogId, userId]
      );

      // Decrement previous vote type
      await client.query(
        `UPDATE blogs SET ${
          prevVote === "upvote" ? "upvotes" : "downvotes"
        } = ${
          prevVote === "upvote" ? "upvotes" : "downvotes"
        } - 1 WHERE id = $1`,
        [blogId]
      );

      // Increment new vote type
      await client.query(
        `UPDATE blogs SET ${vote === "upvote" ? "upvotes" : "downvotes"} = ${
          vote === "upvote" ? "upvotes" : "downvotes"
        } + 1 WHERE id = $1`,
        [blogId]
      );

      voteId = null; // No new insert
    }

    await client.query("COMMIT");
    return voteId;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Vote update failed:", error);
    throw error;
  } finally {
    client.release();
  }
};


export {
  createBlogExec,
  getIndividualBlogExec,
  createCommentExec,
  updateVoteExec,
  getAllLatestBlogsExec,
  getAllTrendingBlogsExec,
  getTrendingAndLatestBlogExec,
  getAllUserBlogsById
};
