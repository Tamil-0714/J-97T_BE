export enum EProfileType {
    WORK = "work",
    PERSONAL_TAMIL = "personal_tamil",
    PERSONAL_TOM = "personal_tom"
}
export enum ESearchType {
    GOOGLE_SEARCH = "google_search",
    DIRECT_VISIT = "direct_visit"
}
export interface IWebHistory {
  email: string;
  profile: EProfileType;
  searchType: ESearchType;
  query?: string | null;
  url?: string | null;
  domain?: string | null;
}