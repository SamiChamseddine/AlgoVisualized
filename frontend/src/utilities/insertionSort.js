const insertionSort = async (
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
  let swapCount = 0; // Insertion sort doesn't swap directly, but we track shifts
  let comparisonCount = 0;
  let arrayAccess = 0;
  
  const tempArray = [...array];
  let updateCounter = 0; // Counter to control throttling
  
  for (let i = 1; i < tempArray.length; i++) {
    let key = tempArray[i];
    let j = i - 1;
  
    // Comparisons for inserting the key
    comparisonCount++;
    setComparisonCount(comparisonCount);

    // Highlight the key being compared
    highlightIndices([j, j + 1]);

    // Shift elements of the sorted portion of the array
    while (j >= 0 && tempArray[j] > key) {
      comparisonCount++;
      setComparisonCount(comparisonCount);

      arrayAccess += 2; // Accessing tempArray[j] and tempArray[j + 1] for comparison
      setArrayAccesses(arrayAccess);

      tempArray[j + 1] = tempArray[j];
      j--;

      // Increment the update counter and throttle updates
      updateCounter++;
      if (updateCounter % updateSkip === 0) {
        updateArray([...tempArray]);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    // Insert the key in the correct position
    tempArray[j + 1] = key;
    arrayAccess++; // Accessing the key for insertion
    setArrayAccesses(arrayAccess);

    // Ensure the final update for this pass
    updateArray([...tempArray]);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  
  highlightIndices([-1, -1]); // Clear highlights
  setSortTime(performance.now() - start);
};

export default insertionSort;
