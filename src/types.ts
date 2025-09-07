export type Status = "Not Started" | "Reading" | "Completed" | "Dropped";

export type ManhwaType =
  | "Shoujo (G)"
  | "Shounen (B)"
  | "Josei (W)"
  | "Seinen (M)"
  | "Yuri (GL)"
  | "Yaoi (BL)"

export type Manhwa = {
  endDate: any;
  id: string;
  uid: string;
  title: string;
  author?: string;
  type?: ManhwaType;
  genres: string[];
  status: Status;
  rating?: 1 | 2 | 3 | 4 | 5;
  currentChapter?: number;
  totalChapters?: number;
  startedAt?: string;
  finishedAt?: string;
  link?: string;
  notes?: string;
  cover?: string;
};

export type ManhwaDraft = {
  [K in keyof Manhwa]?: Manhwa[K] | string;
};