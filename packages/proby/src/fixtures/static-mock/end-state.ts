let completed = false;

export function complete() {
  completed = true;
}

export function is_complete() {
  return completed;
}
