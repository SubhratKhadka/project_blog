import type {CommentI} from "../../interface";

const VeryRecentComment = ({commentObj}: {commentObj: CommentI}) => {
	const {comment, user, created_at} = commentObj;

	return (
		<div className="h-full w-[50%] flex flex-col justify-start gap-2 py-4 px-2 rounded-sm bg-[#3b3b3f] text-dim-text text-sm my-auto">
			<p>
				{new Date(created_at).toLocaleString("en-US", {
					weekday: "short",
					year: "numeric",
					month: "short",
					day: "numeric",
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
					hour12: true,
				})}
			</p>
			<hr className="border-cornflowerblue" />
			<div className="h-full flex gap-2 font-raleway mb-2">
				<div>
					<img src={user?.image} alt="user" className="max-w-12 rounded-full" />
				</div>
				<div className="f-col | ">
					<h3 className="text-lg text-heading-text">{user?.name}</h3>
					<div className="w-full text-medium max-h-20 overflow-y-auto pr-2">
						<p className="whitespace-pre-wrap pb-5">
							{comment}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VeryRecentComment;
