const countingSort = async (
  array,
  updateArray,
  highlightIndices,
  delay,
  updateSkip
) => {
  const max = Math.max(...array);
  const min = Math.min(...array);
  const range = max - min + 1;

  const count = new Array(range).fill(0);
  const output = new Array(array.length).fill(0);

  let updateCounter = 0; // Counter for throttling

  // Counting the occurrences
  for (let i = 0; i < array.length; i++) {
    count[array[i] - min]++;
    highlightIndices([i]);

    // Throttle updates
    updateCounter++;
    if (updateCounter % 50 === 0) {
      updateArray([...array]);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Accumulate counts
  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
  }

  // Build the output array
  for (let i = array.length - 1; i >= 0; i--) {
    output[count[array[i] - min] - 1] = array[i];
    count[array[i] - min]--;

    // Highlight and throttle updates
    updateCounter++;
    if (updateCounter % updateSkip === 0) {
      updateArray([...output]);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Copy the sorted elements back to the original array
  for (let i = 0; i < array.length; i++) {
    array[i] = output[i];
    highlightIndices([i]);

    // Throttle updates
    updateCounter++;
    if (updateCounter % 50 === 0) {
      updateArray([...array]);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Final update and clear highlights
  updateArray([...array]);
  highlightIndices([-1, -1]);
};
export default countingSort;
