export type AnimeStatus =
  | "watching"
  | "completed"
  | "plan_to_watch"
  | "dropped";

export interface AnimeItem {
  id: string;
  mal_id: number;
  name: string;
  vote_average: number | null;
  status: AnimeStatus;
  image_url: string;
  genres: string;
}

export interface AnimeSearchResult {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  genres: Array<{ name: string }>;
  score: number;
}

export interface AnimeSearchProps {
  onSelect: (anime: AnimeSearchResult) => void;
}
