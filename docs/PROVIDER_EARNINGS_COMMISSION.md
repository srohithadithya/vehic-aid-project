# Provider Earnings & Commission Structure

**Last Updated**: January 21, 2026  
**Version**: 1.0  

---

## Overview

VehicAid uses a transparent, fair commission model where service providers earn the majority of service fees plus 100% of spare parts costs. This document explains the complete earnings structure.

---

## Commission Model

### Platform Commission Rate
- **Base Rate**: 25% (configured in `backend/vehic_aid_backend/settings/base.py`)
- **Service Charge Split**: 75% to provider, 25% to platform
- **Spare Parts**: 100% to provider (no commission)
- **Platform Fee**: ₹11 flat fee per service

---

## Pricing Formula

```
Service Portion = Base Price + Distance Charge
Spare Parts Total = Sum of all parts used
Platform Fee = ₹11

total = Service Portion + Spare Parts + Platform Fee

Provider Payout = (Service Portion × 75%) + Spare Parts Total
Platform Commission = (Service Portion × 25%) + Platform Fee
```

---

## Example Calculations

### Example 1: Simple Towing Service (No Spare Parts)

```
Service: Towing
Base Price: ₹300
Distance: 10 km @ ₹20/km = ₹200
Service Portion: ₹500

Platform Fee: ₹11
Total: ₹500 + ₹11 = ₹511

Provider Earnings:
- From Service: ₹500 × 75% = ₹350
- Total Provider Payout: ₹350

Platform Earnings:
- Commission: ₹500 × 25% = ₹125
- Platform Fee: ₹11
- Total Platform Revenue: ₹136
```

### Example 2: Mechanic Service with Spare Parts

```
Service: On-site Repair
Base Service: ₹300
Distance Charge: ₹200
Service Portion: ₹500

Spare Parts Used:
- Towing Cable: ₹150
- Safety Cone: ₹50
- Oil Filter: ₹100
Spare Parts Total: ₹300

Platform Fee: ₹11
Total: ₹500 + ₹300 + ₹11 = ₹811

Provider Earnings:
- From Service: ₹500 × 75% = ₹350
- From Spare Parts: ₹300 × 100% = ₹300
- Total Provider Payout: ₹650

Platform Earnings:
- Commission: ₹500 × 25% = ₹125
- Platform Fee: ₹11
- Total Platform Revenue: ₹136
```

### Example 3: Battery Jumpstart (Quick Service)

```
Service: Battery Jumpstart
Base Price: ₹79
Distance: 3 km @ ₹10/km = ₹30
Service Portion: ₹109

Platform Fee: ₹11
Total: ₹109 + ₹11 = ₹120

Provider Earnings:
- From Service: ₹109 × 75% = ₹76.30
- Total Provider Payout: ₹76.30

Platform Earnings:
- Commission: ₹109 × 25% = ₹27.25
- Platform Fee: ₹11
- Total Platform Revenue: ₹38.25
```

---

## Spare Parts Management

### How It Works
1. Provider completes service
2. Provider adds spare parts used (if any)
3. Each part requires:
   - **Name**: Description of the part
   - **Price**: Cost of the part
4. Spare parts stored as JSON: `[{'name': 'Part Name', 'price': 100}]`
5. Spare parts total automatically calculated
6. Provider receives 100% of spare parts cost

### Backend Implementation
```python
# From backend/apps/services/models.py - ServiceQuote model

spare_parts_details = models.JSONField(
    default=list, 
    blank=True, 
    help_text="List of spare parts used: [{'name': '...', 'price': 100}]"
)

spare_parts_total = models.DecimalField(
    max_digits=10, 
    decimal_places=2, 
    default=0.00
)

def finalize_quote(self, spare_parts=None, platform_fee=Decimal("11.00"), tax_rate=Decimal("0.05")):
    if spare_parts:
        self.spare_parts_details = spare_parts
        self.spare_parts_total = sum(Decimal(str(p['price'])) for p in spare_parts)
    
    # Provider gets 75% of service + 100% of spare parts
    self.provider_payout = (service_portion * Decimal("0.75")) + self.spare_parts_total
```

### API Endpoint
```http
POST /services/quote/finalize/
Authorization: Bearer {provider_token}
Content-Type: application/json

{
  "quote_id": 123,
  "spare_parts": [
    {"name": "Towing Cable", "price": 150},
    {"name": "Safety Cone", "price": 50}
  ],
  "platform_fee": 20
}
```

---

## Payment Flow

### Step-by-Step Process

1. **Service Completion**
   - Provider marks job as completed
   - System generates quote

2. **Quote Finalization**
   - Provider adds spare parts (if any)
   - System calculates total amount
   - Quote sent to customer

3. **Customer Payment**
   - Customer pays via Razorpay
   - Payment verified by backend
   - Transaction record created

4. **Commission Calculation**
   - Platform deducts 25% from service portion
   - Platform adds ₹11 platform fee
   - Provider receives 75% of service + 100% of spare parts

5. **Payout Processing**
   - Provider requests payout from earnings page
   - Minimum payout threshold: ₹500
   - Payout processed to provider's bank account
   - Transaction marked as settled

---

## Earnings Dashboard

### What Providers See

**Earnings Overview** (`/earnings`):
- Total earnings (lifetime)
- Today's earnings
- This week's earnings
- This month's earnings

**Transaction History**:
- Completed jobs
- Payment received per job
- Pending payments
- Platform commission deducted
- Spare parts earnings (separate line item)

**Payout Management**:
- Current balance available for withdrawal
- Bank account details
- Withdrawal request button
- Payout history

---

## Commission Transparency

### Customer Invoice Breakdown
When customers view their invoice, they see:
```
Service Charge: ₹500
Spare Parts: ₹300
Platform Fee: ₹11
Total: ₹811
```

### Provider Earnings Breakdown
When providers view their earnings, they see:
```
Service Earnings: ₹350 (70% of ₹500)
Spare Parts Earnings: ₹300 (100%)
Total Payout: ₹650

Platform Commission: ₹125 (25% of ₹500)
Platform Fee: ₹11
```

---

## Backend Configuration

### Settings Location
`backend/vehic_aid_backend/settings/base.py`:
```python
VEHIC_AID_COMMISSION_RATE = 0.25  # 25% commission rate
PLATFORM_COMMISSION_RATE = 0.25  # Alias for consistency
```

### Financial Tools
`backend/apps/payments/financial_tools.py`:
```python
PLATFORM_COMMISSION_RATE = Decimal(getattr(settings, "PLATFORM_COMMISSION_RATE", "0.25"))
PLATFORM_FEE = Decimal(getattr(settings, "PLATFORM_FEE", "11.00"))  # ₹11 per service

def calculate_provider_payout(total_amount, spare_parts_total=Decimal("0.00")):
    """
    Calculates the platform commission and the final payout amount for the provider.
    """
    service_portion = total_amount - spare_parts_total
    commission = service_portion * PLATFORM_COMMISSION_RATE
    provider_payout = total_amount - commission
    
    return {
        "platform_commission": commission,
        "provider_payout": provider_payout,
        "service_portion": service_portion,
        "spare_parts_total": spare_parts_total
    }
```

---

## Key Takeaways

✅ **Providers earn 75% of service charges**  
✅ **Providers earn 100% of spare parts costs**  
✅ **Platform charges ₹11 flat fee per service**  
✅ **Platform takes 25% commission from service portion only**  
✅ **All calculations are transparent and shown to both parties**  
✅ **Spare parts incentivize providers to use quality parts**  
✅ **Commission model is fair and competitive**

---

## Support

For questions about earnings or commission structure:
- **Provider Support**: provider-support@vehicaid.com
- **Documentation**: https://docs.vehicaid.com/provider-earnings
- **Dashboard**: http://localhost:3001/earnings
