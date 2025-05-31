import {Request, Response} from "express";
import {GoogleDataType, ServerResponse, userI} from "../interfaces";

// google Config
import {GoogleAuth} from "../utils/googleConfig";
const googleAuthObj = GoogleAuth.getInstance();

// axios for google req
import axios from "axios";
import {
	checkUserExistAndGetDetailByEmail,
	createUser,
} from "../../db/dbUserQueries";
import {uploadProfileFromGoogleImgSrc} from "../../db/photoUpload";

const getUserController = async (req: Request, res: Response) => {
	res.json({
		message: "user1",
	});
};

// req types in order: Params, ResBody, ReqBody, Query
const updateLinksController = async (
	req: Request<{}, {}, Pick<userI, "links">>,
	res: Response
) => {
	const {links} = req.body;

	res.json({
		message: "Doing Updation with links",
	});
};

const googleLoginController = async (
	req: Request<{}, {}, {}, {code: string}>,
	res: Response<ServerResponse<userI>, {}>
) => {
	try {
		const {code} = req.query;
		// console.log(code);
		if (!code) {
			throw new Error("Authorization Code is Missing");
		}

		const googleResponse = await googleAuthObj.getAcessToken(code);

		if (googleResponse) {
			const {access_token, token_type} = googleResponse;
			// user data according to email
			const userResponse: {data: GoogleDataType} = await axios.get(
				"https://www.googleapis.com/oauth2/v2/userinfo",
				{
					headers: {Authorization: `${token_type} ${access_token}`}, // basically, Bearer <access_token>
				}
			);
			const {email, name, picture} = userResponse.data;

			// checking user Exist in db
			const userDetail = await checkUserExistAndGetDetailByEmail(email);

			let userId = "";
			let userImgSrc = "";

			// if user doesn't exist in db
			if (!userDetail) {
				console.log("user detail")
				// save UserImg to cloudinary, get user_img_src and create User
				userImgSrc = await uploadProfileFromGoogleImgSrc(picture, email);

				// creating user
				userId = await createUser({
					email,
					username: name,
					userImgSrc,
					links: {
						Github: "",
						Facebook: "",
						"Dev.to": "",
					},
					userRating: 0,
				});
			}

			res.json({
				status: 200,
				message: "Sign In Successful",
				data: {
					// property: already LoggedIn data || create user data
					userId: userDetail?.userId || userId,
					email,
					username: userDetail?.username || name,
					userImgSrc: userDetail?.userImgSrc || userImgSrc,
					links: {
						Facebook: userDetail?.links.Facebook || "",
						Github: userDetail?.links.Github || "",
						"Dev.to": userDetail?.links["Dev.to"] || "",
					},
					userRating: 0,
				},
			});
		} else {
			throw new Error("Couldn't Get Tokens");
		}
	} catch (error: any) {
		// console.log(error);
		res.json({
			status: 400,
			message: error?.message || "Error Occured During Google Auth",
		});
	}
};

export {getUserController, updateLinksController, googleLoginController};
