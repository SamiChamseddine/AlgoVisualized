import asyncio
import random
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .utils.bubble_sort import bubble_sort
from .utils.selection_sort import selection_sort
from .utils.insertion_sort import insertion_sort
from .utils.merge_sort import merge_sort
from .utils.quick_sort import quick_sort
from .utils.heap_sort import heap_sort
from .utils.radix_sort import radix_sort

class SortingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.array = []  # Initialize the array as empty
        self.originalArray = []
        self.sorting_task = None  # Task to keep track of the sorting process

    async def disconnect(self, close_code):
        print(f"Disconnected with code: {close_code}")
        if self.sorting_task and not self.sorting_task.done():
            self.sorting_task.cancel()

    async def receive(self, text_data):
        data = json.loads(text_data)

        if "action" in data:
            if data["action"] == "generate_array":
                size = data["size"]
                self.array = [random.randint(1, 200) for _ in range(int(size))]
                self.originalArray = self.array[:]
                await self.send(json.dumps({"array": self.array}))

            elif data["action"] == "reset":
                # Cancel the current sorting task if running
                if self.sorting_task and not self.sorting_task.done():
                    self.sorting_task.cancel()
                    self.sorting_task = None
                self.array = self.originalArray[:]
                await self.send(json.dumps({"reset": "reset", "array": self.originalArray}))

            elif data["action"] == "sort_array":
                # Perform sorting algorithm and send each step while sorting
                algorithm = data.get("algorithm")
                delay = data.get("delay")
                throttle = data.get("throttle")

                # Cancel any ongoing sorting process before starting a new one
                if self.sorting_task and not self.sorting_task.done():
                    self.sorting_task.cancel()

                # Start the new sorting process
                self.sorting_task = asyncio.create_task(self.perform_sort(self.array, algorithm, delay, throttle))

    async def perform_sort(self, arr, algorithm, delay, throttle):
        algorithms = {
            "bubble_sort": bubble_sort,
            "selection_sort": selection_sort,
            "insertion_sort": insertion_sort,
            "merge_sort": merge_sort,
            "quick_sort": quick_sort,
            "heap_sort": heap_sort,
            "radix_sort": radix_sort,
            # "shell_sort": shell_sort,
            # "counting_sort": counting_sort,
        }
        sort_function = algorithms.get(algorithm)
        if sort_function:
            try:
                await sort_function(arr, self.send_data, delay, throttle)
                await self.send(json.dumps({"isSorted": True}))
            except asyncio.CancelledError:
                # Handle cancellation gracefully
                await self.send(json.dumps({"message": "Sorting process cancelled"}))

    async def send_data(self, arr, comparisons, arrayAccesses, swaps, highlightedIndices):
        # Send the current state of the array to the frontend
        await self.send(json.dumps({
            "array": arr[:],
            "comparisons": comparisons,
            "arrayAccesses": arrayAccesses,
            "swaps": swaps,
            "highlightedIndices": highlightedIndices,
        }))
