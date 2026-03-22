import { AuthGuard } from "@/components/auth/AuthGuard";
import { TaskBoard } from "@/components/task/TaskBoard";

export default function MyTasksPage() {
  return (
    <AuthGuard>
      <TaskBoard
        title="내 태스크를 필터별로 빠르게 확인한다."
        description="Today, Upcoming, All, Done 필터를 전환하면서 내 태스크를 조회할 수 있다. 홈과 동일한 API를 사용해 목록을 재조회한다."
        showQuickAdd={false}
        initialFilter="all"
      />
    </AuthGuard>
  );
}
