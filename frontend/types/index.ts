// User, Post, Comment Type Definitions for Frontend

export interface UserPreview {
  id: string;
  name: string;
  username: string;
  dp_url: string;
  email: string;
  posts: Post[];
  liked_posts: Post[];
  saved_posts: Post[];
  liked_comments: LikedComment[];
  bio: string;
  gender: string | null;
  phone_number: string | null;

}

export interface CommentReply {
  id: string;
  authorId: string;
  postId: string;
  body: string;
  parentCommentId: string | null;
  timestamp: string;
  author: UserPreview;
  liked_by: UserPreview[];
}

export interface Comment {
  id: string;
  authorId: string;
  postId: string;
  body: string;
  parentCommentId: string | null;
  timestamp: string;
  author: UserPreview;
  liked_by: UserPreview[];
  _count: {
    replies: number;
    liked_by: number;
  };
}

export interface Post {
  id: string;
  ownerId: string;
  caption: string;
  timestamp: string;
  media_url: string;
  owner: UserPreview;
  liked_by: UserPreview[];
  shared_by: UserPreview[];
  saved_by: UserPreview[];
  comments: Comment[];
}

export interface LikedComment {
  id: string;
  body: string;
  timestamp: string;
  post: Post;
}

export interface AuthResponse {
    token: string;
    message: string;
}

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};
