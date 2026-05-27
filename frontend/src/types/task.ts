/** タスク1件の形（TypeScript の型定義） */
export interface Task {
  id: number;
  title: string;
  memo?: string | null;
  done: boolean;
  created_at?: string;
}
