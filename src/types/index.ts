export interface AnimeItem {
  id: string;
  name: string;
  vote_average: number | null;
  status: "watching" | "completed" | "plan_to_watch" | "dropped";
  image_url: string;
}

export interface Props {
  anime: AnimeItem;
  onStatusChange?: (status: string) => void;
}
