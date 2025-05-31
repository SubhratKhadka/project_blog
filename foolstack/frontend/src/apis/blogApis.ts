import type { AxiosResponse } from "axios";
import { api } from "./axiosSetup";
import type {
  IndividualBlogI,
  RawBlogI,
  ServerResponse,
  UserDataRes,
  VoteType,
} from "../interface";

const createBlog = async (
  blogData: FormData
): Promise<
  AxiosResponse<{ status: number; message: string; data: { blogId: string } }>
> => {
  return await api.post("/blogs", blogData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getIndividualBlog = async (
  blogId: string,
  userId: string
): Promise<AxiosResponse<ServerResponse<IndividualBlogI>>> => {
  return await api.get(`/blogs/${blogId}/${userId}`);
};

const postComment = async (
  userId: string,
  blogId: string,
  comment: string
): Promise<AxiosResponse<ServerResponse<{ commentId: string }>>> => {
  return await api.post(`/blogs/${blogId}/comment`, {
    commenterId: userId,
    comment,
  });
};

const updateVote = async (
  blogId: string,
  userId: string,
  vote: VoteType,
  prevVote: VoteType
) => {
  return await api.patch(`/blogs/${blogId}/vote`, {
    userId,
    vote,
    prevVote,
  });
};

const getTrendingAndLatestBlog = async (): Promise<
  AxiosResponse<
    ServerResponse<{
      trending: RawBlogI[];
      latest: RawBlogI[];
    }>
  >
> => {
  return await api.get("/blogs");
};

const getAllLatestBlogs = async (): Promise<
  AxiosResponse<
    ServerResponse<{
      latest: RawBlogI[]
    }>
  >
> => {
  return await api.get("/blogs/latest");
};

const getAllTrendingBlogs = async (): Promise<
  AxiosResponse<
    ServerResponse<{
      trending: RawBlogI[]
    }>
  >
> => {
  return await api.get("/blogs/trending");
};

const getUserDataAndBlogs = async(userId: string): Promise<AxiosResponse<ServerResponse<{
	userData: UserDataRes,
	userBlogs: RawBlogI[]
}>>> => {
	return await api.get(`/user/${userId}`)
}

export {
  createBlog,
  getIndividualBlog,
  postComment,
  updateVote,
  getTrendingAndLatestBlog,
  getAllLatestBlogs,
  getAllTrendingBlogs,
  getUserDataAndBlogs
};
