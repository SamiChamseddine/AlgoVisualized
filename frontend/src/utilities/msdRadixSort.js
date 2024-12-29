async function msdRadixSort(array, setArray, setIndices, delay, updateSkip) {
    const maxNum = Math.max(...array);
    const maxDigits = maxNum.toString().length;
  
    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  
    // Helper function to sort based on the current digit place
    const sortByDigitPlace = async (arr, digitPlace, start, end) => {
      const buckets = Array.from({ length: 10 }, () => []);
      
      // Traverse the array and place elements in their respective buckets
      for (let i = start; i < end; i++) {
        const digit = Math.floor(arr[i] / digitPlace) % 10;
        buckets[digit].push(i);
  
        setIndices([i]); // Highlight the current element
  
        // Throttling update every 50 elements
        if (i % updateSkip === 0) {
          setArray([...arr]); // Update the array (reactively triggering re-render)
          await sleep(delay);
        }
      }
  
      // Reconstruct the array from buckets in order
      let index = start;
      for (let i = 0; i < buckets.length; i++) {
        for (let j = 0; j < buckets[i].length; j++) {
          const idx = buckets[i][j];
          arr[index] = arr[idx]; // Place the value back in its correct position
          setIndices([index]); // Highlight the updated index
          setArray([...arr]); // Update the array (reactively triggering re-render)
          await sleep(delay);
          index++;
        }
      }
      setIndices([-1, -1]); // Reset highlight
    };
  
    // Helper function for recursive MSD sorting
    const msdSort = async (arr, digitPlace, start, end) => {
      if (start >= end || digitPlace < 1) return; // Stop when digitPlace is less than 1
  
      const buckets = Array.from({ length: 10 }, () => []);
      
      // Divide the array into buckets based on the current digit place
      for (let i = start; i < end; i++) {
        const digit = Math.floor(arr[i] / digitPlace) % 10;
        buckets[digit].push(i);
      }
  
      let index = start;
      for (let i = 0; i < 10; i++) {
        if (buckets[i].length > 0) {
          // Reconstruct the array from the current bucket group
          await sortByDigitPlace(arr, digitPlace, index, index + buckets[i].length);
  
          // Recursively sort the current bucket by the next significant digit
          await msdSort(arr, Math.floor(digitPlace / 10), index, index + buckets[i].length);
          index += buckets[i].length;
        }
      }
    };
  
    // Main function to start the sorting process
    await msdSort(array, Math.pow(10, maxDigits - 1), 0, array.length);
    
    // Final update to indicate completion
    setIndices([-1, -1]);
  }
  
  export default msdRadixSort;
  