import { apiBaseUrl } from "@/lib/api/config";
import { postJson } from "@/lib/api/client";
import type { AuthSession } from "@/types/user";

export type LoginRequest = {
  email: string;
  password: string;
};

export async function login(request: LoginRequest) {
  return postJson<AuthSession, LoginRequest>(
    `${apiBaseUrl}/api/auth/login`,
    request,
  );
}
