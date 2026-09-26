import os
import subprocess

# 1. Environment and toolchain setup
os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
os.environ["PYTORCH_CUDA_ALLOC_CONF"] = "expandable_segments:True"

for bin_dir in ["/opt/llm-training/bin", "/data/user/sece2026-student06/.local/bin"]:
    if os.path.exists(bin_dir) and bin_dir not in os.environ.get("PATH", ""):
        os.environ["PATH"] = bin_dir + ":" + os.environ.get("PATH", "")

def auto_select_gpu():
    """
    Finds a healthy full-sized B200 GPU (178GB) with sufficient free memory and sets CUDA_VISIBLE_DEVICES.
    Restricts to GPU indices 1, 2, or 3 (skips GPU 0 and skips 4-7 which are 20GB MIG slices).
    """
    if "CUDA_VISIBLE_DEVICES" in os.environ and os.environ["CUDA_VISIBLE_DEVICES"]:
        return os.environ["CUDA_VISIBLE_DEVICES"]

    valid_candidates = ["1", "2", "3"]
    try:
        cmd = ["nvidia-smi", "--query-gpu=index,memory.free,memory.total", "--format=csv,noheader,nounits"]
        output = subprocess.check_output(cmd, text=True).strip().split("\n")
        best_gpu = "1"
        max_free = 0
        for line in output:
            parts = [p.strip() for p in line.split(",")]
            if len(parts) >= 2:
                idx, free_mb = parts[0], int(parts[1])
                total_mb = int(parts[2]) if len(parts) >= 3 else 180000
                if idx in valid_candidates and total_mb > 50000 and free_mb > max_free:
                    max_free = free_mb
                    best_gpu = idx
        os.environ["CUDA_VISIBLE_DEVICES"] = str(best_gpu)
        print(f"Auto-selected full B200 GPU {best_gpu} with {max_free / 1024:.1f}GB free (CUDA_VISIBLE_DEVICES={best_gpu})")
        return str(best_gpu)
    except Exception:
        os.environ["CUDA_VISIBLE_DEVICES"] = "1"
        return "1"

# Run auto-selection on module import so it sets CUDA_VISIBLE_DEVICES before PyTorch/vLLM initializes
auto_select_gpu()

def get_free_memory_gb(gpu_id=0):
    """
    Returns (total_gb, free_gb) for the visible CUDA device using nvidia-smi.
    Does NOT import torch to avoid initializing CUDA in the main process before vLLM.
    """
    try:
        visible_gpu = os.environ.get("CUDA_VISIBLE_DEVICES", str(gpu_id)).split(",")[0]
        result = subprocess.run(
            ["nvidia-smi", "--query-gpu=memory.total,memory.free", "--format=csv,noheader,nounits", "-i", str(visible_gpu)],
            capture_output=True, text=True
        )
        total_mb, free_mb = map(int, result.stdout.strip().split(","))
        return total_mb / 1024, free_mb / 1024
    except Exception:
        return 178.0, 40.0

def get_safe_gpu_utilization(gpu_id=0, model_needs_gb=32, safety_margin_gb=4):
    """
    Returns a safe gpu_memory_utilization value for vLLM under eager mode.
    With enforce_eager=True and max_model_len=2048, ~32-34GB is ideal for Qwen2.5-14B + LoRA.
    """
    total_gb, free_gb = get_free_memory_gb(gpu_id)

    max_allowed_gb = free_gb - safety_margin_gb
    if max_allowed_gb < model_needs_gb:
        usable_gb = max(free_gb - 2.0, 30.0)
    else:
        usable_gb = min(model_needs_gb + 2.0, max_allowed_gb)

    utilization = usable_gb / total_gb
    utilization = min(utilization, 0.25)
    utilization = max(utilization, 0.18)

    print(f"GPU {gpu_id}: {free_gb:.1f}GB free / {total_gb:.1f}GB total → requesting {usable_gb:.1f}GB (utilization={utilization:.2f})")
    return round(utilization, 2)