import type {
  AuthSession,
} from "./domain";
import type {
  AuthCredentialsRequest,
} from "./api";

export type AuthSessionService = {
  getSession(): Promise<AuthSession | null>;
  authenticate(input: AuthCredentialsRequest): Promise<AuthSession>;
  clearSession(): Promise<void>;
};

export const deferredCustomerAuthSessionService: AuthSessionService = {
  async getSession() {
    return null;
  },
  async authenticate() {
    throw new Error(
      "Customer auth is not enabled in this stabilization phase. Keep the website in guest mode until real auth is integrated.",
    );
  },
  async clearSession() {
    return;
  },
};
