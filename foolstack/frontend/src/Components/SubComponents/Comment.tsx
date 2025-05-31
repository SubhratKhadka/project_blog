import type {CommentI} from "../../interface";

const Comment = ({commentObj}: {commentObj: CommentI}) => {
	const formatedDate = new Date(
		commentObj.created_at || Date.now()
	).toLocaleString("en-US", {
		weekday: "short",
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: true,
	});

	return (
		<div className=" | p-1.5 h-full w-60 rounded-md bg-gradient-to-r from-[#3e3f43] to-[#292b2b] shadow-soft hover:shadow-soft-hover trending-grid-item1 transition delay-75 hover:-translate-y-0.5 hover:scale-102 ease-in-out">
			<div className="grid grid-rows-[1rem_10px_1fr_3rem]  | w-auto h-full gap-1.5">
				<div className="text-[0.7rem] text-dim-text">{formatedDate}</div>
				<hr className="border-cornflowerblue" />
				<div className="font-raleway text-sm tracking-wide font-medium text-white leading-5 mb-1 overflow-y-auto">
					{commentObj.comment}
				</div>

				<div className="grid grid-cols-[4rem_1fr] items-center h-full">
					<img
						src={commentObj.user?.image}
						alt="commenter image"
						className="max-h-[3rem] rounded-full justify-self-center"
					/>

					<div className="text-sm font-semibold mb-2 text-dim-text justify-self-center tracking-tight">
						- {commentObj.user?.name}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Comment;
