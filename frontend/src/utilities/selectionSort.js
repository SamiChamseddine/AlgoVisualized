const selectionSort = async (array, updateArray, highlightIndices, delay, updateSkip, setSwapCount, setSortTime) => {
  const tempArray = [...array];  // Create a copy to avoid mutating the original array
  let updateCounter = 0;  // Counter to control throttling

  // Traverse through all elements
  for (let i = 0; i < tempArray.length; i++) {
    let minIndex = i;  // Assume the current index as the minimum

    // Traverse the remaining unsorted portion of the array
    for (let j = i + 1; j < tempArray.length; j++) {
      highlightIndices([minIndex, j]);  // Highlight the current pair of elements

      // Update minIndex if a smaller element is found
      if (tempArray[j] < tempArray[minIndex]) {
        minIndex = j;
      }

      // Increment the update counter and throttle updates
      updateCounter++;
      if (updateCounter % updateSkip === 0) {
        updateArray([...tempArray]);  // Update the array visually
        await new Promise(resolve => setTimeout(resolve, delay));  // Add delay
      }
    }

    // Swap elements if necessary
    if (minIndex !== i) {
      [tempArray[i], tempArray[minIndex]] = [tempArray[minIndex], tempArray[i]];
    }

    // Final update after each pass
    updateArray([...tempArray]);
    await new Promise(resolve => setTimeout(resolve, delay));  // Add delay after swap
  }

  highlightIndices([-1, -1]);  // Clear the highlights after sorting is complete
};

export default selectionSort;
