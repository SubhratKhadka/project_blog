import { useRef, useState, type MouseEvent } from "react";
import { Link, useNavigate } from "react-router";
import { createBlog } from "../apis/blogApis";
import { useUser } from "../ContextProvider/UserContext";

const Create = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const contentRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState("");

  const [title, setTitle] = useState("");

  // for img upload
  const [blogCoverImg, setBlogCoverImg] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // const imgFormat = [".png", ".jpg", ".jpeg", ".webp"];

    if (file && file.type.includes("image")) {
      console.log(file.type);
      setBlogCoverImg(file);
      console.log("Selected Image:", file.name);
      // Optionally preview or upload it
    }
  };

  const [activeStyleBtn, setActiveStyleBtn] =
    useState<HTMLButtonElement | null>(null);

  // style and input handlers
  const handleInput = () => {
    setContent(contentRef.current?.innerHTML || "");
    // console.log(content);
  };
  const formatText = (
    event: MouseEvent<HTMLButtonElement>,
    command: string
  ) => {
    document.execCommand(command, false);
    handleInput(); // refresh content after command

    const clickedBtn = event.currentTarget;

    clickedBtn.classList.toggle("active"); // same btn case
    // activeStyleBtn?.classList.remove("active"); // different btn case

    // Save current as active if it's still active, natra clear
    if (clickedBtn.classList.contains("active")) {
      setActiveStyleBtn(clickedBtn);
    } else {
      setActiveStyleBtn(null); // Clear if user deactivates
    }
  };

  // code block handler
  const insertCodeBlock = () => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    const codeNode = document.createElement("pre");
    codeNode.innerHTML = `<code>${selection.toString()}</code>`;

    range.deleteContents();
    range.insertNode(codeNode);
  };

  // for embedding links
  const insertEmbed = () => {
    const embedCode = prompt("Paste embed HTML (e.g. iframe, tweet embed):");
    if (!embedCode) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    range.deleteContents(); // remove selected text if any

    const embedWrapper = document.createElement("div");
    embedWrapper.innerHTML = embedCode;
    embedWrapper.contentEditable = "false"; // prevent accidental edits

    // Insert and move cursor after it
    range.insertNode(embedWrapper);
    range.setStartAfter(embedWrapper);
    range.setEndAfter(embedWrapper);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const publishBlog = async () => {
    if (!title || !blogCoverImg || !content) {
      alert("All field must be filled");
      return;
    }

    const blogFormData = new FormData();
    blogFormData.append("blog_cover_img", blogCoverImg);
    blogFormData.append("title", title);
    blogFormData.append("description", content);
    blogFormData.append("author_name", user?.username || "test");
    blogFormData.append("author_id", user?.userId || "testid");

    try {
      const res = await createBlog(blogFormData);
      const { blogId } = res.data.data;
      alert(res.data.message);

      // clean up user data
      setActiveStyleBtn(null);
      setTitle("");
      setBlogCoverImg(null);
      setContent("");
      if (contentRef.current) {
        contentRef.current.innerHTML = "";
      }

      // navigating user to created blog
      navigate(`/blog/${blogId}`);
    } catch (error) {
      alert(error);
      // console.log(error);
    }
  };

  return (
    <main className=" center-child | w-[95%] h-[calc(100vh-20rem)] p-2  flex gap-1 mx-4">
      <section className=" w-[85%]  flex flex-col gap-1">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          className="w-full bg-dim-text h-16 rounded-sm border border-gray-400 p-3 text-lg font-bold  text-black  focus:outline-none placeholder:font-medium "
          placeholder="Your title here..."
        />

        {/* Blog Cover Image  */}
        <div className="flex w-full h-48 items-center justify-evenly bg-gray-700 p-2">
          {blogCoverImg && (
            <img
              src={URL.createObjectURL(blogCoverImg)}
              alt="Preview"
              className="w-1/2 h-full object-contain rounded-xl"
            />
          )}

          <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer ">
            <svg
              className="w-8 h-8"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
            </svg>
            <span className="mt-2 text-base leading-normal">
              Select {blogCoverImg ? "another" : "a"} file
            </span>
            <input
              accept="image/*"
              onChange={handleImageChange}
              type="file"
              className="hidden"
            />
          </label>
        </div>

        <div className="relative overflow-auto max-h-96">
          <div
            ref={contentRef}
            contentEditable
            onInput={handleInput}
            className="mb-3 w-full rounded-sm border border-gray-400 p-3 text-sm focus:outline-none text-heading-text min-h-80"
            suppressContentEditableWarning={true}
            // dangerouslySetInnerHTML={{__html: content}}
          ></div>

          {!content && (
            <p className="absolute top-3 left-3 text-amber-50">
              Enter Your Content Here
            </p>
          )}
        </div>
      </section>

      <aside
        className="bg-[#2E2E2E]  h-97 w-[15%] p-2  rounded-sm text-sm  flex flex-col 
sticky top-20 text-heading-text border border-gray-400 "
      >
        <div className=" h-[25%] ">
          <h2 className="font-semibold">Tools</h2>
          <hr />
          <div className="p-2 flex items-center gap-2 ">
            <button
              className="tools hover:scale-[1.2]"
              onClick={(e) => formatText(e, "bold")}
            >
              <img src="../Images/icons8-bold-100.png" alt="" />
            </button>
            <button
              className="tools hover:scale-[1.2]"
              onClick={(e) => formatText(e, "italic")}
            >
              <img src="../Images/icons8-italic-100.png" alt="" />
            </button>
            <button
              className="tools hover:scale-[1.2]"
              onClick={(e) => formatText(e, "underline")}
            >
              <img src="../Images/icons8-underline-100.png" alt="" />
            </button>
            <button
              className="tools hover:scale-[1.2] p-1 "
              onClick={(e) => formatText(e, "strikeThrough")}
            >
              <img src="../Images/icons8-strikethrough-100.png" alt="" />
            </button>
          </div>
        </div>
        <div className=" h-[60%] ">
          <h2 className="font-semibold">Code & Links</h2>
          <hr />
          <div className="p-2 flex flex-col items-center gap-2 ">
            {/* <button className="m-d-buttons">
							<img src="../Images/icons8-picture-96.png" alt="" />
							Image
						</button> */}
            <button className="m-d-buttons" onClick={insertCodeBlock}>
              <img src="../Images/icons8-curly-brackets-96.png" alt="" />
              Code block
            </button>
            <button className="m-d-buttons" onClick={insertEmbed}>
              <img src="../Images/icons8-embed-100.png" alt="" />
              Embed
            </button>
            {/* <button className="m-d-buttons"></button> */}
          </div>
        </div>
        <div>
          <h2 className="font-semibold">Post A Blog ?</h2>
          <hr />
          <div className=" mt-2 h-auto flex items-center justify-between gap-1">
            <Link
              to={"/"}
              className="bg-transparent h-[50%] w-[55%] py-2 px-0.5 rounded-sm border border-gray-200 text-xs text-gray-350 text-center
                     "
            >
              Cancel
            </Link>
            <button
              onClick={publishBlog}
              className=" h-[50%] w-[60%] rounded-sm py-2 px-1 text-xs bg-[#0016cc] text-heading-text border border-blue-700 cursor-pointer"
            >
              Publish
            </button>
          </div>
        </div>
      </aside>
    </main>
  );
};

export default Create;
