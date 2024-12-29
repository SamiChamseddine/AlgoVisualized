const quickSort = async (array, updateArray, highlightIndices, delay, updateSkip, setSwapCount, setSortTime, setArrayAccesses, setComparisonCount) => {
  let swapCount = 0;
  let arrayAccessCount = 0;
  let comparisonCount = 0;
  const start = performance.now();

  const quickSortHelper = async (arr, low, high) => {
    if (low < high) {
      const pivotIndex = await partition(arr, low, high);
      await quickSortHelper(arr, low, pivotIndex - 1);
      await quickSortHelper(arr, pivotIndex + 1, high);
    }
  };

  const partition = async (arr, low, high) => {
    const pivot = arr[high];
    arrayAccessCount++; // Accessing pivot
    let i = low - 1;

    for (let j = low; j < high; j++) {
      highlightIndices([j, high]); // Highlight current pair

      // Count the comparison
      comparisonCount++;
      setComparisonCount(comparisonCount);

      // Count array accesses for arr[j] and arr[high] during the comparison
      arrayAccessCount += 2;
      setArrayAccesses(arrayAccessCount);

      if (arr[j] <= pivot) {
        i++;
        // Swap elements
        [arr[i], arr[j]] = [arr[j], arr[i]];
        swapCount++;
        setSwapCount(swapCount)

        // Count array accesses for the swap (arr[i] and arr[j] are accessed twice, for reading and writing)
        arrayAccessCount += 4;
        setArrayAccesses(arrayAccessCount);

        if ((i * arr.length + j) % updateSkip === 0) {
          updateArray([...arr]);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      // Throttling update
      if ((i * arr.length + j) % updateSkip === 0) {
        updateArray([...arr]);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    // Final swap (arr[i+1] and arr[high])
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    swapCount++;
    setSwapCount(swapCount)

    // Count array accesses for the swap
    arrayAccessCount += 4;
    setArrayAccesses(arrayAccessCount);

    updateArray([...arr]);
    return i + 1;
  };
  await quickSortHelper(array, 0, array.length - 1);
  highlightIndices([-1, -1]);
  setSortTime(performance.now() - start);
  setSwapCount(swapCount); // Set final swap count
};

export default quickSort;
