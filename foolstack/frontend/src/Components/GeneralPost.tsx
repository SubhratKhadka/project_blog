import { useLocation } from "react-router";
import GeneralPostSingleBlog from "./GeneralPostSingleBlog";
import { useEffect, useState } from "react";
import { getAllLatestBlogs, getAllTrendingBlogs } from "../apis/blogApis";
import type { RawBlogI } from "../interface";

const GeneralPost = () => {
  const location = useLocation();
  const trending = location.pathname === "/blogs/trending";

  const [blogs, setBlogs] = useState<{
    trending?: RawBlogI[];
    latest?: RawBlogI[];
  }>();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        if (trending) {
          const res = await getAllTrendingBlogs();
          if (res.data.data) {
            setBlogs(res.data.data);
			// console.log(res.data.data)
          }
        } else {
          const res = await getAllLatestBlogs();
          if (res.data.data) {
            setBlogs(res.data.data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchBlogs();
  }, [trending]);

  return (
    <main className=" w-full p-2  flex flex-col items-center gap-1">
      <section className="border-1 border-dim-text w-full max-w-[900px] h-auto rounded-sm p-2">
        <div className="h-full flex flex-col justify-between items-center gap-2 ">
          <div className="my-2 font-semibold text-heading-text ">
            {trending ? "Trending Blogs" : "Latest Blogs"}
          </div>

          {trending
            ? blogs?.trending?.map((trendingBlog, idx) => (
                <GeneralPostSingleBlog key={idx} blog={trendingBlog} />
              ))
            : blogs?.latest?.map((latestBlog, idx) => (
                <GeneralPostSingleBlog key={idx} blog={latestBlog} />
              ))}
        </div>
      </section>
    </main>
  );
};

export default GeneralPost;
