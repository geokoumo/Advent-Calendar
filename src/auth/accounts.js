/* ============================================================================
 *  ACCOUNTS — local, front-end-only authentication (private prototype).
 *
 *  ⚠️  SECURITY NOTE
 *  This is NOT real security. Everything here ships inside the JavaScript
 *  bundle, so a technical visitor can read the hashes, brute-force simple
 *  passwords (e.g. "admin"), or edit LocalStorage to impersonate a session.
 *  It keeps a casual visitor out of a private gift — nothing more.
 *  Before any public deployment, replace `localAuthService` (authService.js)
 *  with server-side authentication (e.g. an API that verifies passwords and
 *  issues an HttpOnly session cookie), and enforce roles on the server.
 *
 *  Passwords are stored as SHA-256 of `25dol:<username lowercased>:<password>`
 *  so they are not sitting in the source as plain text. To change a password:
 *    node -e "console.log(require('crypto').createHash('sha256').update('25dol:admin:NEWPASS').digest('hex'))"
 * ========================================================================== */

export const ROLES = { USER: 'user', ADMIN: 'admin' };

export const ACCOUNTS = [
  {
    username: 'Gina-Giorgos',
    displayName: 'Gina',
    role: ROLES.USER,
    passwordHash: 'fe32941f992fdd89a59cf4071f7ff51d387b93190d7ecb084e9a62526857da49',
  },
  {
    username: 'admin',
    displayName: 'Admin',
    role: ROLES.ADMIN,
    passwordHash: '7b82f323d8f0cc3849b1705aa931ad291fa6d93434d249079d16deba95a9b172',
  },
];
