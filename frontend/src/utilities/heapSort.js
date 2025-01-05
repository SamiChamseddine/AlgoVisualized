const heapSort = async (
  array,
  updateArray,
  highlightIndices,
  delay,
  updateSkip,
  setSwapCount,
  setSortTime,
  setArrayAccesses,
  setComparisonCount
) => {
  const start = performance.now();
  let swapCount = 0;
  let comparisonCount = 0;
  let arrayAccess = 0;

  const heapify = async (arr, n, i) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      comparisonCount++;
      setComparisonCount(comparisonCount);
      if (arr[left] > arr[largest]) largest = left;
      arrayAccess += 1; // Accessing the left element
      setArrayAccesses(arrayAccess);
    }
    
    if (right < n) {
      comparisonCount++;
      setComparisonCount(comparisonCount);
      if (arr[right] > arr[largest]) largest = right;
      arrayAccess += 1; // Accessing the right element
      setArrayAccesses(arrayAccess);
    }

    if (largest !== i) {
      highlightIndices([i, largest]); // Highlight the indices being compared
      [arr[i], arr[largest]] = [arr[largest], arr[i]]; // Swap elements
      arrayAccess += 2; // Two accesses: one for each element in the swap
      setArrayAccesses(arrayAccess);
      
      swapCount++;
      setSwapCount(swapCount);

      // Throttle updates
      if (swapCount % updateSkip === 0) {
        updateArray([...arr]);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      await heapify(arr, n, largest);
    }
  };

  const tempArray = [...array];
  let updateCounter = 0; // Counter for throttling updates

  // Build the max heap
  for (let i = Math.floor(tempArray.length / 2) - 1; i >= 0; i--) {
    await heapify(tempArray, tempArray.length, i);
  }

  // Extract elements from the heap
  for (let i = tempArray.length - 1; i > 0; i--) {
    // Swap the root (maximum value) with the last element
    highlightIndices([0, i]);
    [tempArray[0], tempArray[i]] = [tempArray[i], tempArray[0]];

    arrayAccess += 2; // Two accesses: one for each element in the swap
    setArrayAccesses(arrayAccess);
    swapCount++;
    setSwapCount(swapCount);

    // Throttle updates
    updateCounter++;
    if (updateCounter % updateSkip === 0) {
      updateArray([...tempArray]);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    // Heapify the reduced heap
    await heapify(tempArray, i, 0);
  }

  // Final update and clear highlights
  updateArray([...tempArray]);
  highlightIndices([-1, -1]);

  setSortTime(performance.now() - start);
};

export default heapSort;
