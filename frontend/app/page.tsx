import { AuthGuard } from "@/components/auth/AuthGuard";
import { TaskBoard } from "@/components/task/TaskBoard";

export default function HomePage() {
  return (
    <AuthGuard>
      <TaskBoard
        title="Quick Add로 바로 적고, 오늘 기준으로 바로 본다."
        description="홈 화면은 빠른 등록과 오늘 필터를 기본으로 둔 작업 공간이다. 제목만 입력하면 태스크를 즉시 만들고 목록에 반영한다."
        showQuickAdd
        initialFilter="all"
      />
    </AuthGuard>
  );
}
