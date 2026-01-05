import requests
import time
import random
import sys

BASE_URL = "http://localhost:8000/api/v1/iot/data-ingest/"

def send_iot_data(device_id, latitude, longitude, button_pressed=None, battery=100):
    payload = {
        "device_id": device_id,
        "latitude": latitude,
        "longitude": longitude,
        "battery": battery
    }
    if button_pressed:
        payload["button_pressed"] = button_pressed
        
    print(f"Sending data for device {device_id}: {payload}")
    try:
        response = requests.post(BASE_URL, json=payload)
        if response.status_code == 202:
            print(f"Successfully sent data. Status: {response.status_code}")
        else:
            print(f"Failed to send data. Status: {response.status_code}, Body: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python simulate_iot.py <device_id> [button_id]")
        sys.exit(1)
        
    device_id = sys.argv[1]
    
    # Coordinates for simulation (Bangalore central)
    lat = 12.9716 + (random.random() - 0.5) * 0.01
    lng = 77.5946 + (random.random() - 0.5) * 0.01
    
    if len(sys.argv) == 3:
        btn = int(sys.argv[2])
        send_iot_data(device_id, lat, lng, button_pressed=btn)
    else:
        # Send a regular heartbeat
        send_iot_data(device_id, lat, lng, battery=random.randint(80, 100))
