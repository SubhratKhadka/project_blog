import { Request, Response } from "express";
import { getUserDetailById } from "../../db/dbUserQueries";
import { getAllUserBlogsById } from "../../db/dbBlogQueries";
import { RawBlogI, ServerResponse, userI } from "../interfaces";

export const getUserDataAndBlogsController = async (req: Request<{userId: string}>, res: Response<ServerResponse<{
    userData: userI,
    userBlogs: RawBlogI[]
}>>) => {
    const {userId} = req.params;

    try {
        const userData = await getUserDetailById(userId);
        const userBlogs = await getAllUserBlogsById(userId);
        
        // console.log(userData, userBlogs)

        res.json({
            status: 200,
            message: "User Blogs And Data Fetched Successfully",
            data: {
                userData: userData,
                userBlogs: userBlogs
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 400,
            message: "Error Fetching Blogs and Data"
        })
    }

    
}