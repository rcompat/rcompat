let completed = false;

export function complete() {
  completed = true;
}

export function isComplete() {
  return completed;
}
