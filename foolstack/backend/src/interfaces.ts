type LinkKey = "Facebook" | "Github" | "Dev.to";

export interface userI {
	userId: string;
	username: string;
	email: string;
	userImgSrc: string;
	links: {
		[key in LinkKey]?: string;
	};
	userRating: number;
}

export interface blogI {
	authorName: string;
	authorId: string;
	title: string;
	description: string;
	created_at: Date;
	rating: number; // or we can do upvote or downvote
	comments: Array<string>;

	// if follower including then,
	follower: Array<String>;
	following: Array<String>;

	// optional:
	reply: Array<{
		replierId: string;
		replierName: string;
		replyMessage: string;
	}>;
}

export type GoogleDataType = {
	id: string;
	email: string;
	verified_email: boolean;
	name: string;
	picture: string;
};

export type ServerResponse<T> = {
	status: number;
	message: string;
	data?: T;
};

export interface CreateBlogI {
	title: string;
	description: string;
	author_name: string;
	author_id: string;
}



type UserInfo = {
	id: string;
	name: string;
	image: string;
};

type Reply = {
	id: string;
	reply_message: string;
	created_at: string; // or Date if parsed
	replier: UserInfo;
};

export type Comment = {
	id: string | null;
	comment: string | null;
	created_at: string | null; // or Date
	user: UserInfo | null;
	replies: Reply[] | null;
};

export type VoteType = "upvote" | "downvote";

export interface IndividualBlogI {
	id: string;
	author_id: string;
	author_name: string;
	title: string;
	blog_image_url: string;
	description: string;
	created_at: string; // or Date
	updated_at: string; // or Date
	upvotes: number;
	downvotes: number;
	user_vote_type: VoteType;
	comments: Comment[];
}


export interface RawBlogI {
  id: string; // UUID
  author_id: string; // UUID
  author_name: string | null;
  title: string;
  blog_image_url: string | null;
  description: string;
  created_at: Date;
  updated_at: Date;
  upvotes: number;
  downvotes: number;
}
