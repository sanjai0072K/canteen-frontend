// Remembers the logged-in student in the browser (name, id, department, etc.).
// No password is stored, students log in with name + application number.
const KEY = "canteenStudent";

export function getStudent() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStudent(student) {
  try {
    localStorage.setItem(KEY, JSON.stringify(student));
  } catch {
    /* storage not available, ignore */
  }
}

export function clearStudent() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* storage not available, ignore */
  }
}
