import React, { FormEvent, useEffect, useState } from "react";
import copy from "../assets/copy.svg";
import linkIcon from "../assets/link.svg";
import loader from "../assets/loader.svg";
import tick from "../assets/tick.svg";

import { useLazyGetSummaryQuery } from "../services/article";

// Assuming the type of an article
type Article = {
  summary: any;
  url: string;
};

const Demo: React.FC = () => {
  const [article, setArtical] = useState<{ url: string; summary: string }>({
    url: "",
    summary: "",
  });

  const [allArticles, setAllArticles] = useState<Article[]>([]);

  const [getsummery, { error, isFetching }] = useLazyGetSummaryQuery();
  const [copied, setCopied] = useState("");
  useEffect(() => {
    const articleFromLocalStorage = localStorage.getItem("articles");

    if (articleFromLocalStorage !== null) {
      const parsedArticles: Article[] = JSON.parse(articleFromLocalStorage);
      setAllArticles(parsedArticles);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { data } = await getsummery({ articleUrl: article.url });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];

      setAllArticles(updatedAllArticles);
      setArtical(newArticle);

      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  const handleCopy = (copyUrl: any) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(""), 3000);
  };

  return (
    <section className=" mt-16 w-full max-w-xl">
      {/* search */}
      <div className=" flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link_icon"
            className=" absolute left-0 my-2 ml-3 w-5"
          />
          <input
            type="url"
            placeholder="Enter a URL"
            value={article.url}
            onChange={(e) => setArtical({ ...article, url: e.target.value })}
            required
            className="url_input peer-focus:border-gray-700
            peer-focus:text-gray-700"
          />
          <button type="submit" className="submit_btn">
            &#8619;
          </button>
        </form>
        {/* Browse Url History */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArtical(item)}
              className="link_card"
            >
              <div className="copy_btn" onClick={() => handleCopy(item.url)}>
                <img
                  src={copied === item.url ? tick : copy}
                  alt="copy_icon"
                  className=" w-[40%] object-contain"
                />
              </div>
              <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Display results */}
      <div className=" my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className=" font-inter font-bold text-black text-center">
            Something went wrong...! maybe url not valed
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="elctric_violet font-satoshi font-bold  text-xl">
                Article{" "}
                <span className="elctric_violet font-bold">Summary</span>
              </h2>
              <div className="summary_box">
                <p className=" font-inter font-medium text-sm text-gray-700">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
