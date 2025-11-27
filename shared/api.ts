/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Post interface with R2 storage details
 */
export interface Post {
  id: string;
  title: string;
  description: string;
  country?: string;
  city?: string;
  server?: string;
  thumbnail?: string;
  nsfw?: boolean;
  mediaFiles: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  createdAt: string;
}

/**
 * Response type for /api/posts
 */
export interface PostsResponse {
  posts: Post[];
  total: number;
}

/**
 * Response type for /api/servers
 */
export interface ServersResponse {
  servers: string[];
}

/**
 * Response type for /api/upload
 */
export interface UploadResponse {
  success: boolean;
  message: string;
  postId: string;
}
