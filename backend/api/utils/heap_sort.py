# utils/sorting.py
import asyncio

# Async Heap Sort Algorithm
async def heap_sort(arr, send_fn, delay, throttle):
    comparisons = 0
    arrayAccesses = 0
    swaps = 0
    highlighted_indices = []

    # Helper function to heapify a subtree rooted at index i
    async def heapify(arr, n, i):
        nonlocal comparisons, arrayAccesses, swaps, highlighted_indices
        largest = i  # Initialize largest as root
        left = 2 * i + 1  # Left child index
        right = 2 * i + 2  # Right child index

        # Compare left child with root
        if left < n and arr[left] > arr[largest]:
            largest = left

        # Compare right child with the largest so far
        if right < n and arr[right] > arr[largest]:
            largest = right

        # If largest is not root, swap and heapify affected subtree
        if largest != i:
            highlighted_indices = [i, largest]
            arr[i], arr[largest] = arr[largest], arr[i]  # Swap
            arrayAccesses += 4
            swaps += 2

            # Send the data after each swap (allow visualization update)
            await send_fn(arr, comparisons, arrayAccesses, swaps, highlighted_indices)
            await asyncio.sleep(delay)  # Delay for visualization (non-blocking)

            await heapify(arr, n, largest)  # Heapify the affected subtree

    # Perform heap sort
    n = len(arr)
    
    # Build a max heap
    for i in range(n // 2 - 1, -1, -1):
        await heapify(arr, n, i)

    # Extract elements from the heap one by one
    for i in range(n-1, 0, -1):
        # Swap the root (largest element) with the last element
        highlighted_indices = [0, i]
        arr[i], arr[0] = arr[0], arr[i]  # Swap
        arrayAccesses += 4
        swaps += 2

        # Send the data after the swap (allow visualization update)
        await send_fn(arr, comparisons, arrayAccesses, swaps, highlighted_indices)
        await asyncio.sleep(delay)  # Delay for visualization (non-blocking)

        # Heapify the root of the tree
        await heapify(arr, i, 0)

    return arr, comparisons, arrayAccesses, swaps
