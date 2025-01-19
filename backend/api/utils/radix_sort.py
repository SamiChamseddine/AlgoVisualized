# utils/sorting.py
import asyncio

# Async Radix Sort Helper: Counting Sort for a specific digit
async def counting_sort(arr, exp, send_fn, delay, throttle, stats):
    n = len(arr)
    output = [0] * n  # Output array for sorted values
    count = [0] * 10  # Count array for digits 0-9
    comparisons, arrayAccesses, swaps = stats

    # Count occurrences of digits at current `exp` place
    for i in range(n):
        index = (arr[i] // exp) % 10
        count[index] += 1
        arrayAccesses += 1

    # Update count[i] so it contains the actual position of this digit in `output`
    for i in range(1, 10):
        count[i] += count[i - 1]

    # Build the output array using the count array
    i = n - 1
    while i >= 0:
        index = (arr[i] // exp) % 10
        output[count[index] - 1] = arr[i]
        count[index] -= 1
        arrayAccesses += 1
        swaps += 1
        i -= 1

    # Copy the sorted values back to the original array
    for i in range(n):
        arr[i] = output[i]
        arrayAccesses += 1

        # Send the data for visualization after each iteration
        if i % throttle == 0:
            await send_fn(arr, comparisons, arrayAccesses, swaps, [i])
            await asyncio.sleep(delay)

    # Update stats
    stats[0], stats[1], stats[2] = comparisons, arrayAccesses, swaps


# Async Radix Sort
async def radix_sort(arr, send_fn, delay, throttle):
    comparisons = 0
    arrayAccesses = 0
    swaps = 0
    stats = [comparisons, arrayAccesses, swaps]

    # Find the maximum number to determine the number of digits
    max_val = max(arr)
    arrayAccesses += len(arr)

    # Perform counting sort for each digit (starting from least significant digit)
    exp = 1
    while max_val // exp > 0:
        await counting_sort(arr, exp, send_fn, delay, throttle, stats)
        exp *= 10

    # Final stats
    comparisons, arrayAccesses, swaps = stats
    return arr, comparisons, arrayAccesses, swaps
