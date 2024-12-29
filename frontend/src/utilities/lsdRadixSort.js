async function lsdRadixSort(array, setArray, setIndices, delay, updateSkip) {
  const maxNum = Math.max(...array);
  const maxDigits = maxNum.toString().length;
  
  let digitPlace = 1; // Start from the least significant digit
  
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  // Helper function to sort based on the current digit place
  const sortByDigitPlace = async (arr, digitPlace) => {
    const buckets = Array.from({ length: 10 }, () => []);
    
    // Traverse the array and place elements in their respective buckets
    for (let i = 0; i < arr.length; i++) {
      const digit = Math.floor(arr[i] / digitPlace) % 10;
      buckets[digit].push(arr[i]);
      
      setIndices([i]); // Highlight the current element
      
      // Throttling update every 50 elements
      if (i % updateSkip === 0) {
        setArray([...arr]); // Update the array (reactively triggering re-render)
        await sleep(delay);
      }
    }

    let index = 0;
    // Reconstruct the array from buckets
    for (let i = 0; i < buckets.length; i++) {
      for (let j = 0; j < buckets[i].length; j++) {
        arr[index] = buckets[i][j];
        setIndices([index]); // Highlight the updated index
        setArray([...arr]); // Update the array (reactively triggering re-render)
        await sleep(delay);
        index++;
      }
    }
    setIndices([-1, -1]); // Reset highlight
  };

  // Main loop for processing each digit place (starting from least significant digit)
  for (digitPlace; digitPlace <= Math.pow(10, maxDigits - 1); digitPlace *= 10) {
    await sortByDigitPlace(array, digitPlace);
  }
  
  // Final update to indicate completion
  setIndices([-1, -1]);
}

export default lsdRadixSort;
