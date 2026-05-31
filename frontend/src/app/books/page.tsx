import BookListPage from "@/components/BookListPage";
import RequireAuth from "@/components/RequireAuth";

export default function BooksPage() {
  return (
    <RequireAuth>
      <BookListPage />
    </RequireAuth>
  );
}
