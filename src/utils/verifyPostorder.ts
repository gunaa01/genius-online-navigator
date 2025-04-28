export function verifyPostorder(sequence: number[]): boolean {
  if (!sequence || sequence.length === 0) return false;

  const verify = (start: number, end: number): boolean => {
    if (start >= end) return true;

    const root = sequence[end];
    let i = start;

    while (i < end && sequence[i] < root) i++;

    for (let j = i; j < end; j++) {
      if (sequence[j] < root) return false;
    }

    return verify(start, i - 1) && verify(i, end - 1);
  };

  return verify(0, sequence.length - 1);
}
