const radixSort = async (array, updateArray, highlightIndices, delay, updateSkip) => {
  const getMax = (arr) => Math.max(...arr);

  const countingSort = async (arr, exp) => {
    const output = new Array(arr.length).fill(0);
    const count = new Array(10).fill(0);

    // Count occurrences of each digit
    for (let i = 0; i < arr.length; i++) {
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
    }

    // Compute cumulative count
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    // Build the output array
    for (let i = arr.length - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
    }

    // Copy sorted output back to the original array
    for (let i = 0; i < arr.length; i++) {
      arr[i] = output[i];

      // Highlight indices and update the array with throttling
      if (i % updateSkip === 0) {
        highlightIndices([i]);
        updateArray([...arr]);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  const max = getMax(array);
  let exp = 1;

  // Process each digit
  while (Math.floor(max / exp) > 0) {
    await countingSort(array, exp);
    exp *= 10;
  }

  // Clear highlights after sorting is complete
  highlightIndices([-1, -1]);
};

export default radixSort;
