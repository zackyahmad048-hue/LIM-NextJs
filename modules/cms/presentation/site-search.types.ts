export interface SiteSearchGroupItem {
  title: string;
  href: string;
  meta: string;
}

export interface SiteSearchResult {
  posts: SiteSearchGroupItem[];
  media: SiteSearchGroupItem[];
  falak: SiteSearchGroupItem[];
}

export const EMPTY_SEARCH_RESULT: SiteSearchResult = {
  posts: [],
  media: [],
  falak: [],
};