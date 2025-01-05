const shellSort = async (
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
  const tempArray = [...array];
  let gap = Math.floor(tempArray.length / 2);
  let comparisonCount = 0;
  let arrayAccess = 0;
  let updateCounter = 0; // Counter to track the number of updates

  while (gap > 0) {
    for (let i = gap; i < tempArray.length; i++) {
      const temp = tempArray[i];
      let j = i;

      while (j >= gap && tempArray[j - gap] > temp) {
        highlightIndices([j, j - gap]); // Highlight comparison
        comparisonCount++;
        setComparisonCount(comparisonCount);
        tempArray[j] = tempArray[j - gap];
        arrayAccess += 2; // 2 accesses per swap (tempArray[j] and tempArray[j - gap])
        setArrayAccesses(arrayAccess);
        j -= gap;

        // Throttle updates after a certain number of movements
        updateCounter++;
        if (updateCounter % updateSkip === 0) {
          updateArray([...tempArray]);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
      tempArray[j] = temp;
      arrayAccess++; // Access for the assignment tempArray[j] = temp

      // Ensure an update after each insertion
      updateCounter++;
      if (updateCounter % updateSkip === 0) {
        updateArray([...tempArray]);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    gap = Math.floor(gap / 2); // Reduce the gap size
  }
  highlightIndices([-1, -1]); // Clear highlights
};
export default shellSort;
