// Remembers the admin login token in the browser.
const KEY = "canteenAdminToken";

export function getAdminToken() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function saveAdminToken(token) {
  try {
    localStorage.setItem(KEY, token);
  } catch {
    /* storage not available, ignore */
  }
}

export function clearAdminToken() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* storage not available, ignore */
  }
}

// Header that every admin API call must send
export function adminHeaders() {
  return { Authorization: "Bearer " + getAdminToken() };
}
