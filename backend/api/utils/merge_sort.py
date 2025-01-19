# utils/sorting.py
import asyncio

# Async Merge Sort Helper: Merge Function
async def merge(arr, left, middle, right, send_fn, delay, throttle, stats):
    comparisons, arrayAccesses, swaps = stats
    n1 = middle - left + 1
    n2 = right - middle

    # Create temporary arrays
    L = arr[left:middle + 1]
    R = arr[middle + 1:right + 1]
    arrayAccesses += n1 + n2

    i = j = 0  # Initial indexes for L and R
    k = left  # Initial index for the merged subarray

    # Merge the temporary arrays back into the main array
    while i < n1 and j < n2:
        comparisons += 1
        arrayAccesses += 2
        if L[i] <= R[j]:
            arr[k] = L[i]
            i += 1
        else:
            arr[k] = R[j]
            j += 1
            swaps += 1
        k += 1
        arrayAccesses += 1

        # Send the data for visualization
        if k % throttle == 0:
            await send_fn(arr, comparisons, arrayAccesses, swaps, [k])
            await asyncio.sleep(delay)

    # Copy the remaining elements of L[], if any
    while i < n1:
        arr[k] = L[i]
        i += 1
        k += 1
        arrayAccesses += 1

        # Send the data for visualization
        if k % throttle == 0:
            await send_fn(arr, comparisons, arrayAccesses, swaps, [k])
            await asyncio.sleep(delay)

    # Copy the remaining elements of R[], if any
    while j < n2:
        arr[k] = R[j]
        j += 1
        k += 1
        arrayAccesses += 1

        # Send the data for visualization
        if k % throttle == 0:
            await send_fn(arr, comparisons, arrayAccesses, swaps, [k])
            await asyncio.sleep(delay)

    # Update stats
    stats[0], stats[1], stats[2] = comparisons, arrayAccesses, swaps


# Async Merge Sort Recursive Function
async def merge_sort_recursive(arr, left, right, send_fn, delay, throttle, stats):
    if left < right:
        # Find the middle point
        middle = (left + right) // 2

        # Recursively sort first and second halves
        await merge_sort_recursive(arr, left, middle, send_fn, delay, throttle, stats)
        await merge_sort_recursive(arr, middle + 1, right, send_fn, delay, throttle, stats)

        # Merge the sorted halves
        await merge(arr, left, middle, right, send_fn, delay, throttle, stats)


# Async Merge Sort
async def merge_sort(arr, send_fn, delay, throttle):
    comparisons = 0
    arrayAccesses = 0
    swaps = 0
    stats = [comparisons, arrayAccesses, swaps]

    await merge_sort_recursive(arr, 0, len(arr) - 1, send_fn, delay, throttle, stats)

    # Final stats
    comparisons, arrayAccesses, swaps = stats
    return arr, comparisons, arrayAccesses, swaps
