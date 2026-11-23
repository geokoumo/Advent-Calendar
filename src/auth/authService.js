/* ============================================================================
 *  AUTH SERVICE — the single seam between the UI and authentication.
 *
 *  Interface (keep it when migrating to a backend):
 *    verify(username, password) → Promise<Session>  (no session created)
 *    login(username, password) → Promise<Session>   (rejects with AuthError)
 *    restore()                 → Session | null     (session after a refresh)
 *    logout()                  → Promise<void>
 *  Session = { username, displayName, role, signedInAt }
 *
 *  A server implementation would POST credentials to an API, rely on an
 *  HttpOnly cookie, and have restore() call e.g. GET /api/session.
 * ========================================================================== */
import { ACCOUNTS } from './accounts.js';
import { sha256 } from './sha256.js';

const SESSION_KEY = '25dol:session';

export class AuthError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code; // 'invalid_credentials' | 'missing_fields'
  }
}

const hashFor = (username, password) => sha256(`25dol:${username.toLowerCase()}:${password}`);
const findAccount = (username) => ACCOUNTS.find((a) => a.username.toLowerCase() === String(username || '').trim().toLowerCase());
const toSession = (a) => ({ username: a.username, displayName: a.displayName, role: a.role, signedInAt: new Date().toISOString() });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export const localAuthService = {
  /** Checks credentials WITHOUT creating a session (used by the admin "test the login screen"). */
  async verify(username, password) {
    const name = String(username || '').trim();
    if (!name || !password) throw new AuthError('missing_fields', 'Missing username or password');
    await wait(650); // a gentle pause; also slows down guessing a little
    const account = findAccount(name);
    // Same error for unknown user and wrong password — don't reveal which.
    if (!account || hashFor(account.username, password) !== account.passwordHash) {
      throw new AuthError('invalid_credentials', 'Invalid username or password');
    }
    return toSession(account);
  },

  async login(username, password) {
    const session = await localAuthService.verify(username, password);
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      /* private mode: session lasts for this page only */
    }
    return session;
  },

  restore() {
    try {
      const raw = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
      const account = raw && findAccount(raw.username);
      // The role always comes from the account list, never from storage.
      return account ? { ...toSession(account), signedInAt: raw.signedInAt } : null;
    } catch {
      return null;
    }
  },

  async logout() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  },
};

export const authService = localAuthService;
