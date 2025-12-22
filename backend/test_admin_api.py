import requests, json
base = 'http://localhost:8000/api/v1/services/admin'
endpoints = ['dashboard-stats', 'recent-activity', 'users', 'bookings', 'payments']
for ep in endpoints:
    url = f'{base}/{ep}/'
    try:
        r = requests.get(url)
        print('---', ep, '---')
        print('Status:', r.status_code)
        try:
            data = r.json()
            if isinstance(data, list):
                print('Count:', len(data))
                print('Sample:', data[:2])
            else:
                print('Response:', data)
        except Exception:
            print('Response text:', r.text[:200])
    except Exception as e:
        print('Error fetching', ep, e)
