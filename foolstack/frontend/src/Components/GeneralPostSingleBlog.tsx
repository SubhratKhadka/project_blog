import { useRef } from "react";
import type { RawBlogI } from "../interface";
import { Link } from "react-router";

const GeneralPostSingleBlog = ({ blog }: { blog: RawBlogI }) => {
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  if (descriptionRef.current) {
    descriptionRef.current.innerHTML = blog.description;
  }

  return (
    <Link to={`/blog/${blog.id}`} className="bg-[#3b3b3f] w-full grow rounded-xs transition delay-50 hover:-translate-y-0.5 hover:scale-101 ease-in-out h-40 p-2 flex items-start justify-between">
      <div className="flex flex-col items-start justify-between">
        <div className="flex flex-col items-start justify-between gap-y-0.5">
          <div className="text-[0.6rem] text-dim-text">
            {new Date(blog.created_at).toLocaleString("en-US")}
          </div>
          <div className="font-raleway text-lg font-bold leading-5 mb-1  text-heading-text">
            {blog.title}
          </div>
          <p
            ref={descriptionRef}
            className="mb-1 w-120 h-18 text-dim-text text-xs overflow-hidden"
          >
            {/* From artificial intelligence breakthroughs to the ethics of machine
            learning, Neural Notes dives deep into the evolving landscape of
            smart technologies. Discover how algorithms, neural networks, and
            data science are transforming industries and shaping human potential
            — one byte at a time. */}
          </p>
        </div>
        <div className="h-08 w-21 flex items-center text-sm text-dim-text  p-1">
          <button className="rounded-[50%] ">
            <img
              src="/Images/icons8-thick-arrow-pointing-up-96 (2).png"
              alt=""
              className="w-5 cursor-pointer "
            />
          </button>
          <span>{blog.upvotes}</span>
          <button className=" ml-2 rounded-[50%]">
            <img
              src="/Images/icons8-thick-arrow-pointing-up-96 (2).png"
              alt=""
              className="w-5 cursor-pointer rotate-[180deg] "
            />
          </button>{" "}
          <span>{blog.downvotes}</span>
        </div>
      </div>
      <div className="w-[40%] h-36 ">
        <img
          src={blog.blog_image_url || "/Images/MilkyWay.webp"}
          alt=""
          className="h-[100%] w-[100%] rounded-sm object-cover"
        />
      </div>
    </Link>
  );
};

export default GeneralPostSingleBlog;
