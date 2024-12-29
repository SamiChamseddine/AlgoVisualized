 const insertionSort = async (array, updateArray, highlightIndices, delay, updateSkip) => {
    const tempArray = [...array];
    let updateCounter = 0; // Counter to control throttling
  
    for (let i = 1; i < tempArray.length; i++) {
      let key = tempArray[i];
      let j = i - 1;
  
      while (j >= 0 && tempArray[j] > key) {
        highlightIndices([j, j + 1]);
        tempArray[j + 1] = tempArray[j];
        j--;
  
        // Increment the update counter and throttle updates
        updateCounter++;
        if (updateCounter % updateSkip === 0) {
          updateArray([...tempArray]);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
  
      tempArray[j + 1] = key;
  
      // Ensure the final update for this pass
      updateArray([...tempArray]);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  
    highlightIndices([-1, -1]); // Clear highlights
  };
  export default insertionSort