# utils/sorting.py
import asyncio

# Async Selection Sort Algorithm
async def selection_sort(arr, send_fn, delay, throttle):
    comparisons = 0
    arrayAccesses = 0
    swaps = 0
    highlighted_indices = []
    n = len(arr)
    
    for i in range(n):
        min_index = i
        for j in range(i + 1, n):
            highlighted_indices = [min_index, j]  # Highlight current min and j
            comparisons += 1
            arrayAccesses += 2  # Reading arr[min_index] and arr[j]
            
            if arr[j] < arr[min_index]:  # Find the smallest element in unsorted part
                min_index = j
            arrayAccesses += 2  # Access the element for comparison
            
            # Send the data after each iteration (allow visualization update)
            if i % throttle == 0:
                await send_fn(arr, comparisons, arrayAccesses, swaps, highlighted_indices)
                await asyncio.sleep(delay)  # Delay for visualization (non-blocking)
        
        # Swap the found minimum element with the first element
        if min_index != i:
            arr[i], arr[min_index] = arr[min_index], arr[i]
            swaps += 2  # Swapping two elements
            arrayAccesses += 4  # Accessing both elements for swap
        
        # Send the data after each iteration (allow visualization update)
        if i % throttle == 0:
            await send_fn(arr, comparisons, arrayAccesses, swaps, highlighted_indices)
            await asyncio.sleep(delay)  # Delay for visualization (non-blocking)
        
    return arr, comparisons, arrayAccesses, swaps
