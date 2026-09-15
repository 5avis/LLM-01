import subprocess
import time

def get_free_memory_gb(gpu_id=0):
    result = subprocess.run(
        ["nvidia-smi", "--query-gpu=memory.total,memory.free", "--format=csv,noheader,nounits", "-i", str(gpu_id)],
        capture_output=True, text=True
    )
    total_mb, free_mb = map(int, result.stdout.strip().split(","))
    return total_mb / 1024, free_mb / 1024

def get_safe_gpu_utilization(gpu_id=0, model_needs_gb=35, safety_margin_gb=20):
    """
    Returns a safe gpu_memory_utilization value.
    Uses a LARGE safety margin since free memory can change
    between checking and actually loading the model.
    """
    total_gb, free_gb = get_free_memory_gb(gpu_id)

    # Only use HALF of currently free memory, minus a big safety buffer
    # This protects against other processes grabbing memory in the meantime
    usable_gb = max((free_gb * 0.5) - safety_margin_gb, model_needs_gb)
    usable_gb = min(usable_gb, free_gb - safety_margin_gb)  # never exceed what's actually free minus margin
    usable_gb = max(usable_gb, model_needs_gb)  # always request at least enough for the model

    utilization = usable_gb / total_gb
    utilization = min(utilization, 0.85)
    utilization = max(utilization, 0.15)

    print(f"GPU {gpu_id}: {free_gb:.1f}GB free / {total_gb:.1f}GB total → requesting {usable_gb:.1f}GB (utilization={utilization:.2f})")
    return utilization