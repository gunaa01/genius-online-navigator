import CQueue from '../utils/QueueWithStacks';

describe('CQueue', () => {
  test('Example 1', () => {
    const q = new CQueue();
    q.appendTail(3);
    expect(q.deleteHead()).toBe(3);
    expect(q.deleteHead()).toBe(-1);
  });

  test('Example 2', () => {
    const q = new CQueue();
    expect(q.deleteHead()).toBe(-1);
    q.appendTail(5);
    q.appendTail(2);
    expect(q.deleteHead()).toBe(5);
    expect(q.deleteHead()).toBe(2);
  });
});
