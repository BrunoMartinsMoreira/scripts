export function insertionSort<T>(arr: T[], sort_key: keyof T): T[] {
  for (let currentIndex = 1; currentIndex < arr.length; currentIndex++) {
    let currentElement = arr[currentIndex];
    let previousIndex = currentIndex - 1;

    while (
      previousIndex >= 0 &&
      arr[previousIndex][sort_key] > currentElement[sort_key]
    ) {
      arr[previousIndex + 1] = arr[previousIndex];
      previousIndex = previousIndex - 1;
    }
    arr[previousIndex + 1] = currentElement;
  }
  return arr;
}
