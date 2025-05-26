export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  sessionId: string;
}
