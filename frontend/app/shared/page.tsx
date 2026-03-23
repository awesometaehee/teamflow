import { AuthGuard } from "@/components/auth/AuthGuard";
import { SharedTaskBoard } from "@/components/task/SharedTaskBoard";

export default function SharedPage() {
  return (
    <AuthGuard>
      <SharedTaskBoard />
    </AuthGuard>
  );
}
