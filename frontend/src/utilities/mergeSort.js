const mergeSort = async (array, updateArray, highlightIndices, delay, updateSkip) => {
  let updateCounter = 0; // Counter to control throttling

  const merge = async (left, right, leftStartIndex) => {
    let sorted = [];
    let i = 0; // Pointer for left
    let j = 0; // Pointer for right

    while (i < left.length && j < right.length) {
      highlightIndices([leftStartIndex + i, leftStartIndex + left.length + j]); // Highlight current comparison

      if (left[i] <= right[j]) {
        sorted.push(left[i++]);
      } else {
        sorted.push(right[j++]);
      }

      // Increment the update counter and throttle updates
      updateCounter++;
      if (updateCounter % updateSkip === 0) {
        // Update only the part that changes
        updateArray(prevArray => [
          ...prevArray.slice(0, leftStartIndex),
          ...sorted,
          ...left.slice(i),
          ...right.slice(j),
          ...prevArray.slice(leftStartIndex + left.length + right.length)
        ]);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    // Add remaining elements
    sorted = [...sorted, ...left.slice(i), ...right.slice(j)];

    // Final update with the merged sorted array
    updateArray(prevArray => [
      ...prevArray.slice(0, leftStartIndex),
      ...sorted,
      ...prevArray.slice(leftStartIndex + left.length + right.length)
    ]);

    return sorted;
  };

  const mergeSortHelper = async (arr, startIndex) => {
    if (arr.length < 2) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = await mergeSortHelper(arr.slice(0, mid), startIndex);
    const right = await mergeSortHelper(arr.slice(mid), startIndex + mid);
    return merge(left, right, startIndex);
  };

  // Start the sorting process
  await mergeSortHelper(array, 0);
  highlightIndices([-1, -1]); // Clear highlights
};

export default mergeSort;
