// User, Post, Comment Type Definitions for Frontend
export interface User {
    id: string;
    username: string;
    email: string;
    name: string;
    bio: string;
    phone_number: string;
    created_at: string;
    updated_at: string;
    dp_url: string;
    gender: string;
  
    posts: Post[];
    comments: Comment[];
    liked_posts: Post[];
    shared_posts: Post[];
    saved_posts: Post[];
    liked_comments: Comment[];
  }
  
  export interface Post {
    id: string;
    ownerId: string;
    caption: string;
    timestamp: string;
    media_url: string;
  
    owner: User;
    comments: Comment[];
    liked_by: User[];
    shared_by: User[];
    saved_by: User[];
  }
  
  export interface Comment {
    id: string;
    authorId: string;
    postId: string;
    body: string;
    parentCommentId: string | null;
    timestamp: string;
  
    parentComment?: Comment;
    replies: Comment[];
    author: User;
    post: Post;
    liked_by: User[];
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