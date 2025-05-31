import { QueryResult } from "pg";
import { Database } from "./db.config";
import { userI } from "../src/interfaces";
// gettin db pool
const pool = Database.getInstance().dbConnection;

const checkUserExistAndGetDetailByEmail = async (
  email: string
): Promise<userI | null> => {
  // LEFT JOIN because a user might not have any links yet.
  const result: QueryResult = await pool.query(
    `SELECT 
			u.id AS user_id,
			u.username,
			u.email,
			u.user_rating,
			u.user_img_src,
			ul.platform,
			ul.url
		FROM users u
		LEFT JOIN user_links ul ON u.id = ul.user_id
		WHERE u.email = $1`,
    [email]
  );

  if (result.rows.length === 0) return null;

  const baseUser = result.rows[0];

  const user: userI = {
    username: baseUser.username,
    email: baseUser.email,
    userRating: baseUser.user_rating,
    userImgSrc: baseUser.user_img_src,
    userId: baseUser.user_id,
    links: {},
  };

  for (const row of result.rows) {
    if (row.platform && row.url) {
      user.links[row.platform as keyof typeof user.links] = row.url;
    }
  }

  return user;
};

const createUser = async (userData: Omit<userI, "userId">): Promise<string> => {
  const { email, username, userImgSrc, userRating, links } = userData;

  const client = await pool.connect(); // for transaction

  try {
    await client.query("BEGIN");

    // Insert user and get ID
    const result: QueryResult<{ id: string }> = await client.query(
      `
			INSERT INTO users (username, email, user_img_src, user_rating)
			VALUES ($1, $2, $3, $4)
			RETURNING id`,
      [username, email, userImgSrc, userRating]
    );
    const userId = result.rows[0].id;

    // Insert links if any
    // Req if we had platform link during signUp but we wont
    // for (const platform of Object.keys(links)) {
    // 	const url = links[platform as keyof typeof links];
    // 	if (url) {
    // 		await client.query(
    // 			`INSERT INTO user_links (user_id, platform, url) VALUES ($1, $2, $3)`,
    // 			[userId, platform, url]
    // 		);
    // 	}
    // }

    await client.query("COMMIT");
    return userId;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const getUserDetailById = async (userId: string): Promise<userI> => {
  try {
    const result = await pool.query(
      `
      SELECT id, username, user_img_src, email, user_rating
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    const user = result.rows[0];

    if (!user) {
      throw new Error("User not found");
    }

    const formattedUser: userI = {
      userId: user.id,
      username: user.username,
      userImgSrc: user.user_img_src,
      email: user.email,
      links: {
        Facebook: "", 
      },
      userRating: user.user_rating,
    };

    return formattedUser;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

export { checkUserExistAndGetDetailByEmail, createUser, getUserDetailById };
