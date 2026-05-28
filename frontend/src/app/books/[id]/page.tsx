import BookDetailPage from "@/components/BookDetailPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BookPage({ params }: PageProps) {
  const { id } = await params;
  const bookId = Number(id);

  if (Number.isNaN(bookId)) {
    return (
      <div className="px-6 py-10 text-center text-sm text-red-600">
        無効な ID です
      </div>
    );
  }

  return <BookDetailPage bookId={bookId} />;
}
