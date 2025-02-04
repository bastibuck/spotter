import React from "react";
import { api } from "~/trpc/server";

const LatestPost: React.FC = async () => {
  const latestPost = await api.post.getLatest();

  if (!latestPost) {
    return <p>You have no posts yet.</p>;
  }

  return <p className="truncate">Your most recent post: {latestPost.name}</p>;
};

export default LatestPost;
