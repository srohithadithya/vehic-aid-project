import requests
import time
import concurrent.futures

BASE_URL = "http://localhost:8001/api/v1/services/stats/public/"

def hit_endpoint(i):
    start = time.time()
    try:
        response = requests.get(BASE_URL, timeout=5)
        latency = time.time() - start
        return response.status_code, latency
    except Exception as e:
        return 500, time.time() - start

def run_load_test(requests_count=50, workers=10):
    print(f"Starting Load Test: {requests_count} requests with {workers} workers...")
    latencies = []
    success_count = 0
    
    start_time = time.time()
    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as executor:
        results = list(executor.map(hit_endpoint, range(requests_count)))
    
    total_time = time.time() - start_time
    
    for status, latency in results:
        if status == 200:
            success_count += 1
        latencies.append(latency)
    
    avg_latency = sum(latencies) / len(latencies)
    print(f"\n--- Load Test Results ---")
    print(f"Total Requests: {requests_count}")
    print(f"Successful: {success_count}")
    print(f"Failed: {requests_count - success_count}")
    print(f"Average Latency: {avg_latency:.4f}s")
    print(f"Total Time: {total_time:.4f}s")
    print(f"Throughput: {requests_count / total_time:.2f} req/s")

if __name__ == "__main__":
    run_load_test()
