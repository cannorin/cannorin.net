export class MultiSet<T> extends Map<T, number> {
  constructor(iterable?: Iterable<readonly [T, number]>) {
    super();
    if (iterable) {
      for (const [item, count] of iterable) {
        this.add(item, count);
      }
    }
  }

  /**
   * Adds the specified item to the multiset.
   * If the item already exists, its count is incremented.
   *
   * @param item The element to add.
   * @param count The number of times to add the element (default is 1).
   * @returns The current instance for chaining.
   */
  add(item: T, count = 1): this {
    const currentCount = this.get(item) ?? 0;
    this.set(item, currentCount + count);
    return this;
  }

  /**
   * Removes one or more instances of the specified item.
   *
   * @param item The element to remove.
   * @param count The number of times to remove the element (default is 1).
   * @returns True if the element was present, false otherwise.
   */
  remove(item: T, count = 1): boolean {
    const currentCount = this.get(item);
    if (currentCount === undefined) {
      return false;
    }
    if (currentCount <= count) {
      this.delete(item);
    } else {
      this.set(item, currentCount - count);
    }
    return true;
  }

  /**
   * Retrieves the count of the specified item.
   *
   * @param item The element whose count is to be retrieved.
   * @returns The number of occurrences of the element.
   */
  count(item: T): number {
    return this.get(item) ?? 0;
  }
}
