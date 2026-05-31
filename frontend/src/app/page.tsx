import TaskBoard from "@/components/TaskBoard";
import RequireAuth from "@/components/RequireAuth";

export default function Home() {
  return (
    <RequireAuth>
      <div className="flex flex-1 flex-col">
        <TaskBoard />
      </div>
    </RequireAuth>
  );
}
