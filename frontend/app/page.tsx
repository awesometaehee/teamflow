import { AuthGuard } from "@/components/auth/AuthGuard";
import { TaskBoard } from "@/components/task/TaskBoard";

export default function HomePage() {
  return (
    <AuthGuard>
      <TaskBoard
        title="빠르게 적고, 전체 흐름을 한 화면에서 정리합니다."
        description="홈 화면은 빠른 등록과 전체 필터를 기본으로 둔 작업 공간입니다. 제목만 입력해도 태스크를 만들고 바로 목록에 반영할 수 있습니다."
        showQuickAdd
        initialFilter="all"
      />
    </AuthGuard>
  );
}
