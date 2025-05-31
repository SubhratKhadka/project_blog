import { Link } from "react-router";
import { useUser } from "../ContextProvider/UserContext";
import { useEffect, useRef, useState } from "react";
import { getTrendingAndLatestBlog } from "../apis/blogApis";
import type { RawBlogI } from "../interface";
import { HeroTrendingBlog } from "./SubComponents/HeroTrendingBlog";
import HeroLatestBlog from "./SubComponents/HeroLatestBlog";

const Hero = () => {
  const { user, setUser } = useUser();

  const firstTrendingBlogRef = useRef<HTMLParagraphElement>(null);

  const [blogs, setBlogs] = useState<{
    trending: RawBlogI[];
    latest: RawBlogI[];
  }>();

  if (firstTrendingBlogRef.current && blogs) {
    firstTrendingBlogRef.current.innerHTML = blogs.trending[0].description;
  }

  useEffect(() => {
    const fetchTrendingAndLatest = async () => {
      try {
        const res = await getTrendingAndLatestBlog();
        if (res.data.data) {
          const { trending, latest } = res.data.data;
          setBlogs({
            trending,
            latest,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchTrendingAndLatest();
  }, []);

  return (
    <>
      <nav className="w-full p-4 flex justify-between h-40">
        <span className="text-heading-text font-raleway">
          Blogging What{" "}
          <span className=" border-b-4 border-cornflowerblue ">Echoes.</span>
        </span>
        <div className="flex justify-between gap-8 text-normal-text">
          <Link
            to="/"
            className="p-1 no-underline hover:border-b-3 hover:border-b-cornflowerblue transition delay-75 hover:-translate-y-0.5 hover:scale-102 ease-in-out"
          >
            Home
          </Link>
          <Link
            to="/blogs/latest"
            className="p-1 no-underline hover:border-b-3 hover:border-b-cornflowerblue transition delay-75 hover:-translate-y-0.5 hover:scale-102 ease-in-out"
          >
            Latest
          </Link>
          <Link
            to="/blogs/trending"
            className="p-1 no-underline hover:border-b-3 hover:border-b-cornflowerblue transition delay-75 hover:-translate-y-0.5 hover:scale-102 ease-in-out"
          >
            Trending
          </Link>
          <div className="relative inline-block">
            <button
              className="rounded-[50%] w-8 h-8 text-black cursor-pointer"
              onClick={() => {
                document.getElementById("dropdown")!.classList.toggle("hidden");
              }}
            >
              <img
                src={user?.userImgSrc || "/Images/icons8-male-user-100.png"}
                alt="Accounts"
                className="rounded-full"
              />
            </button>

            <div
              id="dropdown"
              className="w-50 bg-[#38383e] text-white shadow-soft rounded-sm absolute -left-3/2 -translate-x-1/2  hidden z-10"
            >
              <div className="p-2 flex flex-col ">
                <h2 className="text-base text-center font-semibold">
                  Accounts
                </h2>
                <hr />
                <Link
                  to={`/profile/${user?.userId}`}
                  className="mt-2 p-2 rounded-sm text-left text-xs hover:bg-[#6494edd5]"
                >
                  Your Profile
                </Link>
                <Link
                  to="/login"
                  onClick={() => {
                    setUser(null);
                  }}
                  className="mt-2 p-2 rounded-sm text-left text-xs hover:bg-[#6494edd5]"
                >
                  Add a different account
                </Link>
                <Link
                  to="/login"
                  onClick={() => {
                    setUser(null);
                  }}
                  className=" p-2 rounded-sm text-left text-xs hover:bg-[#6494edd5]"
                >
                  Sign out
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <section className="z-0 w-full flex items-center justify-between mt-4">
        <h1 className="font-gothic text-7xl text-heading-text [word-spacing:0.75rem]">
          BENEATH
          <br />
          THE SYNTAX
        </h1>
        <span className="font-raleway text-sm text-dim-text -ml-40">
          ramblings,
          <br />
          insights,
          <br />
          and accidental truths <br />— one post at a time.
        </span>

        <div className="bg-[#3b3b3f] p-2 rounded-sm h-30 flex flex-col items-center justify-between shadow-cornflower">
          <img src="/Images/icons8-create-100.png" alt="" className="w-8" />
          <span className="text-xs text-gray-300">
            Share your thoughts... <br />
          </span>
          <Link
            className="w-full p-1 rounded-xs no-underline text-sm text-gray-200 font-raleway shadow-soft-1 hover:bg-[cornflowerblue] hover:text-section-color flex justify-center items-center"
            to="/create"
          >
            Create a Blog
          </Link>
        </div>
      </section>

      {/* blogs */}
      <section className="relative w-full h-100  rounded-sm text-heading-text  flex items-center justify-between gap-2">
        {" "}
        {blogs?.trending[0] && (
          <>
            <div
              className="absolute -left-7 top-8 bg-[#3b3b3f] shadow-soft  p-2 font-raleway rounded-sm rotate-[-90deg]
		  border-b-4 border-b-cornflowerblue "
            >
              Most Liked
            </div>
            <Link
              to={`/blog/${blogs.trending[0].id}`}
              className="w-[60%] h-full  p-2 rounded-md shadow-soft  flex flex-col trending-grid-item1 "
            >
              <div className="p-2 h-full w-full rounded-md bg-gradient-to-r from-[#3e3f43] to-[#292b2b] flex flex-col  hover:shadow-soft-hover transition delay-75 hover:-translate-y-0.5 hover:scale-102 ease-in-out ">
                <div className="w-auto h-auto flex flex-col">
                  <div className="text-[0.6rem] text-dim-text">
                    {new Date(blogs.trending[0].created_at).toLocaleString(
                      "en-Us"
                    )}
                  </div>
                  <div className="font-raleway text-lg font-bold leading-5 mb-1">
                    {blogs.trending[0].title}
                  </div>
                  <div className="text-xs font-extralight mb-2">
                    - {blogs.trending[0].author_name}
                  </div>
                  <div>
                    <p
                      ref={firstTrendingBlogRef}
                      className="mb-1 h-8 text-dim-text text-xs overflow-hidden"
                    >
                      {/* From artificial intelligence breakthroughs to the ethics
                      of machine learning, Neural Notes dives deep into the
                      evolving landscape of smart technologies. Discover how
                      algorithms, neural networks, and data science are
                      transforming industries and shaping human potential — one
                      byte at a time. */}
                    </p>
                  </div>
                </div>
                <div className="overflow-hidden">
                  <img
                    src={
                      blogs.trending[0].blog_image_url ||
                      "/Images/MilkyWay.webp"
                    }
                    alt=""
                    className="h-[100%] w-[100%] rounded-md object-cover"
                  />
                </div>
              </div>
            </Link>
          </>
        )}
        {blogs?.latest && (
          <div
            className="relative w-[40%] h-full p-2 shadow-soft border-4 border-y-0 border-r-0 border-l-cornflowerblue 
			rounded-tr-md rounded-br-md overflow-y-scroll "
          >
            <div
              className="absolute -left-7 top-8 bg-[#3b3b3f] shadow-soft  p-2 font-raleway rounded-sm rotate-[-90deg]
			  border-b-4 border-b-cornflowerblue "
            >
              Most Recent
            </div>
            <div className="h-full flex flex-col justify-between items-center gap-2 ">
              {blogs.latest.map((latestBlog, idx) => (
                <HeroLatestBlog key={idx} blog={latestBlog} />
              ))}

              <Link
                to={"/blogs/latest"}
                className="p-2 w-full rounded-md bg-gradient-to-r from-[#3e3f43] to-[#292b2b] shadow-soft hover:shadow-soft-hover flex flex-col items-center justify-center trending-grid-item6 transition delay-75 hover:-translate-y-0.5 hover:scale-101 ease-in-out"
              >
                <p className="text-dim-text text-2xl font-raleway">See More</p>
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="trending-section text-heading-text w-full bg-transparent p-2 rounded-sm grid grid-cols-5 grid-rows-3 gap-4 shadow-soft relative">
        {" "}
        <div
          className="absolute -left-6 top-10 bg-[#3b3b3f] shadow-soft  p-2 px-3 font-raleway rounded-sm rotate-[-90deg] 
                      border-b-4 border-b-cornflowerblue w-fit h-fit"
        >
          Trending
        </div>
        {blogs?.trending &&
          blogs.trending.map((trendingBlog, idx) =>
            idx != 0 ? <HeroTrendingBlog blog={trendingBlog} /> : <></>
          )}
        <Link
          to={"/blogs/trending"}
          className="p-2 h-80 w-auto rounded-md bg-gradient-to-r from-[#3e3f43] to-[#292b2b] shadow-soft hover:shadow-soft-hover flex flex-col items-center justify-center trending-grid-item6 transition delay-75 hover:-translate-y-0.5 hover:scale-102 ease-in-out"
        >
          <p className="text-dim-text text-2xl font-raleway">See More</p>
        </Link>
      </section>
    </>
  );
};

export default Hero;
