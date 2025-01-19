# utils/sorting.py
import asyncio

# Async Insertion Sort Algorithm
async def insertion_sort(arr, send_fn, delay, throttle):
    comparisons = 0
    arrayAccesses = 0
    swaps = 0
    highlighted_indices = []
    n = len(arr)
    
    for i in range(1, n):
        key = arr[i]
        j = i - 1
        highlighted_indices = [i, j]  # Highlight the key and the element it's being compared with
        
        # Move elements of arr[0..i-1], that are greater than key, to one position ahead
        while j >= 0 and arr[j] > key:
            comparisons += 1
            arrayAccesses += 2  # Reading arr[j] and arr[j+1]
            arr[j + 1] = arr[j]  # Shift element to the right
            arrayAccesses += 2  # Accessing arr[j + 1]
            swaps += 1  # Swapping for shifting the element
            j -= 1

            # Send the data after each iteration (allow visualization update)
            if i % throttle == 0:
                await send_fn(arr, comparisons, arrayAccesses, swaps, highlighted_indices)
                await asyncio.sleep(delay)  # Delay for visualization (non-blocking)
        
        arr[j + 1] = key  # Place the key in the correct position
        arrayAccesses += 2  # Accessing arr[j + 1] and the key value
        
        # Send the data after each iteration (allow visualization update)
        if i % throttle == 0:
            await send_fn(arr, comparisons, arrayAccesses, swaps, highlighted_indices)
            await asyncio.sleep(delay)  # Delay for visualization (non-blocking)
    
    return arr, comparisons, arrayAccesses, swaps
