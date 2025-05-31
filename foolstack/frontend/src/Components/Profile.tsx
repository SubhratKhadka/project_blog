import { useParams } from "react-router";
import { useUser } from "../ContextProvider/UserContext";
import { useEffect, useState } from "react";
import { getUserDataAndBlogs } from "../apis/blogApis";
import type { RawBlogI, UserDataRes } from "../interface";
import GeneralPostSingleBlog from "./GeneralPostSingleBlog";

const Profile = () => {
  //   const { user } = useUser();
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<UserDataRes>();
  const [blogs, setBlogs] = useState<RawBlogI[]>();

  useEffect(() => {
    const fetchFunction = async () => {
      try {
        if (userId) {
          const res = await getUserDataAndBlogs(userId);
          if (res.data.data) {
            const { userData: resUserData, userBlogs: resUserBlogs } =
              res.data.data;

			console.log(resUserData)
            setUserData(resUserData);
            setBlogs(resUserBlogs);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchFunction();
  }, []);

  return (
    <main className=" w-full p-2  flex flex-col items-center gap-1">
      <section className="bg-dim-text w-200 rounded-sm p-4 flex items-start gap-2">
        <div className="flex items-start gap-1  w-[85%]">
          <div className="w-100">
            <img
              src={userData?.userImgSrc || "/Images/icons8-male-user-100.png"}
              alt=""
			  className="rounded-full"
            />
          </div>
          <div>
            <div className=" flex flex-col ">
              <span className="text-2xl font-semibold ">
                {userData?.username || "John Human"}
              </span>
              <span className="text-[14px] -mt-1 text-gray-800">
                User ID : {userData?.userId || "testUserId6969"}
              </span>
              <p className=" mt-2 text-xs text-[#e2e2e2] ">
                "Hi, I'm John Human. I'm just your average guy—nothing fancy,
                nothing wild. I enjoy simple things: a good cup of coffee, quiet
                mornings, and learning something new every day. I don’t claim to
                be extraordinary, but I believe in doing my best and treating
                people with kindness. Whether I’m figuring out how to fix
                something or just taking a walk, I try to keep life
                straightforward and honest. I'm here, I exist, and I’m doing my
                thing—one day at a time."
              </p>
            </div>
          </div>
        </div>

        <div className="border-l-2 border-gray-600   p-2 h-full">
          <span className="text-xs text-[#343438]">Email me at: </span>
          <span className="text-sm ">
            {userData?.email || "jhonhuman001@gmail.com"}
          </span>
          <hr className="my-2" />
          {/* <span className="text-xs text-[#343438]">Follow me on:</span> */}
          {/* <div className="flex justify-between gap-2 items-center w-10"> */}
          {/* <img src="/Images/icons8-facebook-100.png" alt="" /> */}
          {/* <img src="/Images/icons8-x-100.png" alt="" />
                <img src="/Images/icons8-linkedin-100.png" alt="" /> */}
          {/* </div> */}
        </div>
      </section>

      <section className="border-1 border-dim-text w-200 h-auto rounded-sm p-2">
        <div className="h-full flex flex-col justify-between items-center gap-2 ">
          <div className="my-2 font-semibold text-heading-text ">{userData?.username}'s Blogs</div>

          {blogs && blogs.map((userBlog, idx)=> (
			<GeneralPostSingleBlog key={idx} blog={userBlog}/>
		  ))}
        </div>
      </section>
    </main>
  );
};

export default Profile;
