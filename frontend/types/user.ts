export type SessionUser = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

export type AuthSession = {
  sessionToken: string;
  user: SessionUser;
};
