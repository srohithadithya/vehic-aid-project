import os
import requests
from django.conf import settings
from decimal import Decimal
from datetime import datetime

class PricingService:
    """
    Budget-friendly pricing service for Indian market.
    Tiered pricing based on vehicle type and service complexity.
    """
    
    def __init__(self):
        # Use settings attribute if present, otherwise try repo file, otherwise empty string
        self.api_key = getattr(settings, "GOOGLE_MAPS_API_KEY", None)
        if not self.api_key:
            # try reading a local file (kept in repo for developer convenience)
            root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
            key_file = os.path.join(root_path, "google maps api key.txt")
            try:
                with open(key_file, "r", encoding="utf-8") as f:
                    self.api_key = f.read().strip()
            except Exception:
                # last resort: empty key (distance API calls will fall back to straight-line distance)
                self.api_key = ""
        self.base_url = "https://maps.googleapis.com/maps/api/distancematrix/json"
        
        # Budget-friendly base pricing per service type (in INR)
        # Designed for lower-middle to upper-middle class affordability
        self.base_prices = {
            # Two-wheeler pricing (most affordable)
            "TWO_WHEELER": {
                "TOWING": Decimal("150.00"),
                "JUMPSTART": Decimal("80.00"),
                "TIRE_CHANGE": Decimal("100.00"),
                "FUEL_DELIVERY": Decimal("70.00"),
                "LOCKOUT": Decimal("120.00"),
                "GENERAL": Decimal("100.00"),
            },
            # Three-wheeler (Auto Rickshaw) - slightly higher than two-wheeler
            "THREE_WHEELER": {
                "TOWING": Decimal("200.00"),
                "JUMPSTART": Decimal("100.00"),
                "TIRE_CHANGE": Decimal("120.00"),
                "FUEL_DELIVERY": Decimal("90.00"),
                "LOCKOUT": Decimal("150.00"),
                "GENERAL": Decimal("130.00"),
            },
            # Four-wheeler (sedan/hatchback) - mid-range
            "FOUR_WHEELER": {
                "TOWING": Decimal("300.00"),
                "JUMPSTART": Decimal("150.00"),
                "TIRE_CHANGE": Decimal("200.00"),
                "FUEL_DELIVERY": Decimal("150.00"),
                "LOCKOUT": Decimal("250.00"),
                "GENERAL": Decimal("250.00"),
            },
            # SUV - premium pricing
            "SUV": {
                "TOWING": Decimal("500.00"),
                "JUMPSTART": Decimal("250.00"),
                "TIRE_CHANGE": Decimal("350.00"),
                "FUEL_DELIVERY": Decimal("250.00"),
                "LOCKOUT": Decimal("400.00"),
                "GENERAL": Decimal("400.00"),
            },
            # Van - commercial vehicle pricing
            "VAN": {
                "TOWING": Decimal("600.00"),
                "JUMPSTART": Decimal("300.00"),
                "TIRE_CHANGE": Decimal("400.00"),
                "FUEL_DELIVERY": Decimal("300.00"),
                "LOCKOUT": Decimal("450.00"),
                "GENERAL": Decimal("450.00"),
            },
            # Truck - light/medium commercial
            "TRUCK": {
                "TOWING": Decimal("800.00"),
                "JUMPSTART": Decimal("400.00"),
                "TIRE_CHANGE": Decimal("500.00"),
                "FUEL_DELIVERY": Decimal("400.00"),
                "LOCKOUT": Decimal("550.00"),
                "GENERAL": Decimal("600.00"),
            },
            # Heavy Vehicle - highest pricing
            "HEAVY_VEHICLE": {
                "TOWING": Decimal("1200.00"),
                "JUMPSTART": Decimal("600.00"),
                "TIRE_CHANGE": Decimal("800.00"),
                "FUEL_DELIVERY": Decimal("600.00"),
                "LOCKOUT": Decimal("800.00"),
                "GENERAL": Decimal("1000.00"),
            },
        }
        
        # Affordable per km rates (in INR)
        self.per_km_rates = {
            "TWO_WHEELER": Decimal("5.00"),
            "THREE_WHEELER": Decimal("6.00"),
            "FOUR_WHEELER": Decimal("10.00"),
            "SUV": Decimal("15.00"),
            "VAN": Decimal("18.00"),
            "TRUCK": Decimal("25.00"),
            "HEAVY_VEHICLE": Decimal("35.00"),
        }
        
        # Subscription discounts (encouraging subscriptions)
        self.plan_discounts = {
            "FREE": Decimal("0.00"),
            "STANDARD": Decimal("0.15"),  # 15% discount
            "PREMIUM": Decimal("0.25"),   # 25% discount
        }
        
        # Time-based surge pricing (minimal, only for peak hours)
        self.surge_multipliers = {
            "NORMAL": Decimal("1.0"),
            "PEAK": Decimal("1.2"),  # Only 20% surge during peak hours
        }
    
    def get_surge_multiplier(self):
        """
        Determine surge multiplier based on current time.
        Peak hours: 8-10 AM, 6-9 PM on weekdays
        """
        now = datetime.now()
        hour = now.hour
        is_weekday = now.weekday() < 5
        
        if is_weekday and ((8 <= hour < 10) or (18 <= hour < 21)):
            return self.surge_multipliers["PEAK"]
        return self.surge_multipliers["NORMAL"]
    
    def calculate_distance(self, origin_lat, origin_lng, dest_lat, dest_lng):
        """
        Calculate distance using Google Maps Distance Matrix API.
        Returns distance in km and duration in minutes.
        """
        try:
            params = {
                "origins": f"{origin_lat},{origin_lng}",
                "destinations": f"{dest_lat},{dest_lng}",
                "key": self.api_key,
                "mode": "driving",
            }
            
            response = requests.get(self.base_url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data["status"] == "OK":
                element = data["rows"][0]["elements"][0]
                if element["status"] == "OK":
                    distance_m = element["distance"]["value"]
                    duration_s = element["duration"]["value"]
                    
                    # Convert to Decimal safely
                    distance_km = Decimal(str(distance_m / 1000.0))
                    duration_min = int(duration_s / 60)
                    
                    return distance_km, duration_min
            
            # Fallback to straight-line distance if API fails
            return self._calculate_straight_line_distance(
                origin_lat, origin_lng, dest_lat, dest_lng
            ), 30
            
        except Exception as e:
            print(f"Error calculating distance: {e}")
            return Decimal("10.0"), 30
    
    def _calculate_straight_line_distance(self, lat1, lon1, lat2, lon2):
        """
        Calculate straight-line distance using Haversine formula.
        """
        from math import radians, sin, cos, sqrt, atan2
        
        R = 6371  # Earth's radius in km
        
        lat1, lon1, lat2, lon2 = map(float, [lat1, lon1, lat2, lon2])
        lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
        
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * atan2(sqrt(a), sqrt(1-a))
        
        return Decimal(str(R * c))
    
    def calculate_quote(self, service_type, provider_lat, provider_lng, 
                       customer_lat, customer_lng, vehicle_type="FOUR_WHEELER",
                       user_plan="FREE", apply_surge=True):
        """
        Calculate budget-friendly quote for Indian market.
        
        Args:
            service_type: Type of service (TOWING, JUMPSTART, etc.)
            provider_lat/lng: Provider location
            customer_lat/lng: Customer location
            vehicle_type: TWO_WHEELER, FOUR_WHEELER, or SUV_LUXURY
            user_plan: User's subscription plan
            apply_surge: Whether to apply surge pricing
        
        Returns:
            Dict with detailed pricing breakdown
        """
        # Get base price for service type and vehicle
        vehicle_prices = self.base_prices.get(vehicle_type, self.base_prices["FOUR_WHEELER"])
        base_price = vehicle_prices.get(service_type.upper(), vehicle_prices["GENERAL"])
        
        # Calculate distance and time
        distance_km, time_estimate = self.calculate_distance(
            provider_lat, provider_lng, customer_lat, customer_lng
        )
        
        # Calculate distance charge
        per_km_rate = self.per_km_rates.get(vehicle_type, self.per_km_rates["FOUR_WHEELER"])
        distance_charge = distance_km * per_km_rate
        
        # Calculate subtotal
        subtotal = base_price + distance_charge
        
        # Apply surge if applicable
        surge_multiplier = self.get_surge_multiplier() if apply_surge else Decimal("1.0")
        subtotal_with_surge = subtotal * surge_multiplier
        
        # Apply plan discount (on top of surge)
        discount_rate = self.plan_discounts.get(user_plan, Decimal("0.00"))
        discount_amount = subtotal_with_surge * discount_rate
        
        # Calculate final total
        total = subtotal_with_surge - discount_amount
        
        # Round to nearest rupee for simplicity
        total = total.quantize(Decimal("1"))
        
        return {
            "base_price": base_price,
            "distance_km": distance_km,
            "distance_charge": distance_charge,
            "per_km_rate": per_km_rate,
            "time_estimate_minutes": time_estimate,
            "subtotal": subtotal,
            "surge_multiplier": surge_multiplier,
            "subtotal_with_surge": subtotal_with_surge,
            "discount_rate": discount_rate,
            "discount_amount": discount_amount,
            "dynamic_total": total,
            "vehicle_type": vehicle_type,
            "service_type": service_type,
        }

