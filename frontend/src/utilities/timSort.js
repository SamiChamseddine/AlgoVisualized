async function timSort(array, setArray, setIndices, delay, updateSkip) {
    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  
    const insertionSort = async (arr, left, right) => {
      for (let i = left + 1; i <= right; i++) {
        const key = arr[i];
        let j = i - 1;
  
        while (j >= left && arr[j] > key) {
          arr[j + 1] = arr[j];
          setIndices([j, j + 1]); // Highlight swapped elements
          setArray([...arr]); // Update the array (reactively triggering re-render)
          await sleep(delay);
          j--;
        }
        arr[j + 1] = key;
        setArray([...arr]);
        await sleep(delay);
      }
    };
  
    const merge = async (arr, left, mid, right) => {
      const len1 = mid - left + 1;
      const len2 = right - mid;
  
      let leftArr = new Array(len1);
      let rightArr = new Array(len2);
  
      for (let i = 0; i < len1; i++) leftArr[i] = arr[left + i];
      for (let i = 0; i < len2; i++) rightArr[i] = arr[mid + 1 + i];
  
      let i = 0, j = 0, k = left;
      while (i < len1 && j < len2) {
        if (leftArr[i] <= rightArr[j]) {
          arr[k++] = leftArr[i++];
        } else {
          arr[k++] = rightArr[j++];
        }
        setIndices([k - 1]);
        setArray([...arr]); // Update the array (reactively triggering re-render)
        await sleep(delay);
      }
  
      while (i < len1) {
        arr[k++] = leftArr[i++];
        setIndices([k - 1]);
        setArray([...arr]); // Update the array (reactively triggering re-render)
        await sleep(delay);
      }
  
      while (j < len2) {
        arr[k++] = rightArr[j++];
        setIndices([k - 1]);
        setArray([...arr]); // Update the array (reactively triggering re-render)
        await sleep(delay);
      }
    };
  
    const minRunLength = 32;
  
    // Step 1: Perform insertion sort on small chunks (runs) of the array
    for (let i = 0; i < array.length; i += minRunLength) {
      await insertionSort(array, i, Math.min(i + minRunLength - 1, array.length - 1));
    }
  
    // Step 2: Merge sorted runs
    for (let size = minRunLength; size < array.length; size = 2 * size) {
      for (let start = 0; start < array.length; start += 2 * size) {
        let mid = Math.min(array.length - 1, start + size - 1);
        let end = Math.min(start + 2 * size - 1, array.length - 1);
        await merge(array, start, mid, end);
      }
    }
  
    setIndices([-1, -1]); // Reset highlight
  }
  
  export default timSort;
  