const bubbleSort = async (
  array,
  updateArray,
  highlightIndices,
  delay,
  updateSkip,
  setSwapCount,
  setSortTime,
  setArrayAccesses,
  setComparisonCount,
  signal // Pass the AbortSignal here
) => {
  const start = performance.now();
  let swapCount = 0;
  let comparisonCount = 0;
  let arrayAccess = 0;
  const tempArray = [...array];

  for (let i = 0; i < tempArray.length; i++) {
    // Check if the sorting process has been aborted
    if (signal.aborted) {
      console.log("Sorting aborted");
      return; // Exit the function if aborted
    }

    for (let j = 0; j < tempArray.length - i - 1; j++) {
      // Check if the sorting process has been aborted
      if (signal.aborted) {
        console.log("Sorting aborted");
        return; // Exit the function if aborted
      }

      highlightIndices([j, j + 1]);
      if (tempArray[j] > tempArray[j + 1]) {
        comparisonCount++;
        setComparisonCount(comparisonCount);
        [tempArray[j], tempArray[j + 1]] = [tempArray[j + 1], tempArray[j]];
        arrayAccess += 6;
        setArrayAccesses(arrayAccess);
        swapCount++;
        setSwapCount(swapCount);
      }

      // Update the array and add delay
      if (((i * tempArray.length + j) % updateSkip === 0) & (delay != 0)) {
        updateArray([...tempArray]);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // Reset highlighted indices and set final sort time
  highlightIndices([-1, -1]);
  if (delay === 0) setSortTime(performance.now() - start);
};

export default bubbleSort;
