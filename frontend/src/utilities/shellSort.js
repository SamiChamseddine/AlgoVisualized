const shellSort = async (array, updateArray, highlightIndices, delay, updateSkip) => {
  const tempArray = [...array];
  let gap = Math.floor(tempArray.length / 2);

  while (gap > 0) {
    for (let i = gap; i < tempArray.length; i++) {
      const temp = tempArray[i];
      let j = i;

      while (j >= gap && tempArray[j - gap] > temp) {
        highlightIndices([j, j - gap]); // Highlight comparison
        tempArray[j] = tempArray[j - gap];
        j -= gap;

        // Throttling updates to improve performance
        if (i % updateSkip === 0) {
          updateArray([...tempArray]);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
      tempArray[j] = temp;

      // Update after each insertion
      if (i % updateSkip === 0 || j === i) {
        updateArray([...tempArray]);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    gap = Math.floor(gap / 2); // Reduce the gap size
  }
  highlightIndices([-1, -1]); // Clear highlights
};

export default shellSort;
