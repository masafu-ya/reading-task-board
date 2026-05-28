export interface Book {
  id: number;
  title: string;
  author?: string | null;
  created_at?: string;
}

export interface BookNote {
  id: number;
  book_id: number;
  content: string;
  created_at?: string;
}
