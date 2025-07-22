'use client';

import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import useDebounce from "@/hooks/useDebounce";
import { Post } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import axios from '@/utils/axiosInstance'
import { Input } from "@/components/ui";

export type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: Post[] | null;
};

const SearchResults = ({
  isSearchFetching,
  searchedPosts,
}: SearchResultProps) => {
  if (isSearchFetching) {
    return <Loader />;
  } else if (searchedPosts && searchedPosts.length > 0) {
    return <GridPostList posts={searchedPosts} />;
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    );
  }
};

const LIMIT = 10;

const Explore = () => {
  const { ref, inView } = useInView();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);

  const [posts, setPosts] = useState<Post[]>([]);
  const [searchedPosts, setSearchedPosts] = useState<Post[] | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSearchFetching, setIsSearchFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get("/post", {
        params: { cursor, limit: LIMIT },
      });

      const { posts: newPosts, nextCursor } = res.data as {
        posts: Post[];
        nextCursor: string | null;
      };

      setPosts((prev) => [...prev, ...newPosts]);
      setCursor(nextCursor);
      setHasMore(!!nextCursor);
    } catch (error) {
      console.error("Error fetching posts", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchedPosts = async () => {
    if (!debouncedSearch) return;
    setIsSearchFetching(true);
    try {
      const res = await axios.get("/post/search", {
        params: { q: debouncedSearch, limit: LIMIT },
      });

      const { posts: searchResults } = res.data as { posts: Post[] };
      setSearchedPosts(searchResults);
    } catch (error) {
      console.error("Error searching posts", error);
      setSearchedPosts([]);
    } finally {
      setIsSearchFetching(false);
    }
  };

  useEffect(() => {
    if (debouncedSearch) {
      fetchSearchedPosts();
    } else {
      // Reset to default feed
      setSearchedPosts(null);
      setCursor(null);
      setHasMore(true);
      setPosts([]);
      fetchPosts();
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (inView && !searchValue && hasMore) {
      fetchPosts();
    }
  }, [inView, searchValue, hasMore]);

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts = !shouldShowSearchResults && posts.length > 0;

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img src="/icons/search.svg" width={24} height={24} alt="search" />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>
        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img src="/icons/filter.svg" width={20} height={20} alt="filter" />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
          />
        ) : (
          <GridPostList posts={posts} showUser={false} showStats={true} />
        )}
      </div>

      {!searchValue && hasMore && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
