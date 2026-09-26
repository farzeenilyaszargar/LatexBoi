export function readPreference(key: string): { value: string | null; available: boolean } {
  try {
    return { value: window.localStorage.getItem(key), available: true };
  } catch {
    return { value: null, available: false };
  }
}

export function savePreference(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
