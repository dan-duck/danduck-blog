export interface PostMetadata {
  title: string;
  date: string;
  tags?: string[];
  description?: string;
  author?: string;
  slug: string;
}

export interface Post extends PostMetadata {
  content: string;
}

export interface ProcessedPost extends PostMetadata {
  contentHtml: string;
  excerpt?: string;
}