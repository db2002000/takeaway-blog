export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  cover?: string;
  tags?: string[];
  platforms?: {
    youtube?: string;
    xiaohongshu?: string;
    douyin?: string;
    bilibili?: string;
  };
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  locale: 'zh' | 'zh-Hant' | 'en';
}

export interface Concept {
  zh: {
    title: string;
    desc: string;
  };
  en?: {
    title: string;
    desc: string;
  };
  related?: string[];
}

export interface ConceptMap {
  [id: string]: Concept;
}