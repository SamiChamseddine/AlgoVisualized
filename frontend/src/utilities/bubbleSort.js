const bubbleSort = async (
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
  const tempArray = [...array];
  for (let i = 0; i < tempArray.length; i++) {
    for (let j = 0; j < tempArray.length - i - 1; j++) {
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
      if ((i * tempArray.length + j) % updateSkip === 0) {
        updateArray([...tempArray]);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  highlightIndices([-1, -1]);
  setSortTime(performance.now() - start);
};

export default bubbleSort;
