
import pytest
from apps.services.models import VehicleExchange, ServiceRequest, Vehicle
from apps.users.models import ServiceBooker, CustomUser
from decimal import Decimal

@pytest.mark.django_db
class TestVehicleExchange:
    
    def test_create_vehicle_exchange(self):
        """
        Test creating a vehicle exchange record linked to a service request.
        """
        # Setup User & Vehicles
        user = CustomUser.objects.create(username="testuser", email="test@example.com")
        booker = ServiceBooker.objects.create(user=user)
        
        orig_vehicle = Vehicle.objects.create(
            owner=user, license_plate="KA01AB1234", make="Swift", model="VXI", fuel_type="PETROL"
        )
        rental_vehicle = Vehicle.objects.create(
            owner=user, license_plate="KA05RENT01", make="Rental", model="Sedan", fuel_type="PETROL"
        )
        
        # Setup Service Request
        request = ServiceRequest.objects.create(
            booker=user,
            vehicle=orig_vehicle,
            service_type="REPAIR",
            latitude=12.0,
            longitude=77.0
        )
        
        # Create Exchange
        exchange = VehicleExchange.objects.create(
            request=request,
            original_vehicle=orig_vehicle,
            rental_vehicle=rental_vehicle,
            pickup_location="Indiranagar",
            return_location="Koramangala",
            rental_fee=Decimal("500.00")
        )
        
        assert exchange.pk is not None
        assert exchange.status == "REQUESTED"
        assert exchange.rental_fee == Decimal("500.00")
        assert exchange.request == request

    def test_exchange_status_workflow(self):
        """
        Test status transitions for an exchange.
        """
        # Simplified setup without full FK constraints for unit testing logic if possible, 
        # but Django requires valid FKs. Re-using setup code style.
        user = CustomUser.objects.create(username="statususer", email="status@example.com")
        ServiceBooker.objects.create(user=user)
        orig = Vehicle.objects.create(owner=user, license_plate="TEST1", make="A", model="B", fuel_type="PETROL")
        rental = Vehicle.objects.create(owner=user, license_plate="TEST2", make="C", model="D", fuel_type="PETROL")
        req = ServiceRequest.objects.create(booker=user, vehicle=orig, service_type="TOW", latitude=0, longitude=0)
        
        exchange = VehicleExchange.objects.create(
            request=req, original_vehicle=orig, rental_vehicle=rental,
            pickup_location="A", return_location="B", rental_fee=Decimal("100")
        )
        
        # Transition to PROVIDED
        exchange.status = "PROVIDED"
        exchange.save()
        assert exchange.status == "PROVIDED"
        
        # Transition to COMPLETED
        exchange.status = "COMPLETED"
        exchange.save()
        assert exchange.status == "COMPLETED"
