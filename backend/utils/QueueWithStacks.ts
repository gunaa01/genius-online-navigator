class CQueue {
  private stack1: number[] = [];
  private stack2: number[] = [];

  appendTail(value: number): void {
    this.stack1.push(value);
  }

  deleteHead(): number {
    if (this.stack2.length) {
      return this.stack2.pop()!;
    }
    while (this.stack1.length) {
      this.stack2.push(this.stack1.pop()!);
    }
    return this.stack2.pop() || -1;
  }
}

export default CQueue;
