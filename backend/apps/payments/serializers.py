from rest_framework import serializers


class RazorpayWebhookSerializer(serializers.Serializer):
    """
    Serializer to validate the specific data structure received from the Razorpay Webhook.
    """

    # Assuming Razorpay sends a payload with 'payload.payment.entity'
    event = serializers.CharField(max_length=100)

    # We must trust the structure Razorpay sends, but validate the crucial IDs
    payload = serializers.JSONField()

    def validate(self, data):
        """Custom validation to extract and verify critical IDs."""
        event = data.get("event")
        payload = data.get("payload", {})

        # We only care about successful payment events
        if event != "payment.captured":
            raise serializers.ValidationError(
                {"event": "Only 'payment.captured' events are handled."}
            )

        try:
            # Extract order ID and payment ID from the nested Razorpay payload
            payment_entity = payload["payment"]["entity"]
            order_id = payment_entity["order_id"]
            payment_id = payment_entity["id"]

            if not order_id or not payment_id:
                raise ValueError("Missing critical IDs in payload.")

            # Store extracted IDs for view to use later
            data["extracted_order_id"] = order_id
            data["extracted_payment_id"] = payment_id

        except KeyError:
            raise serializers.ValidationError(
                {"payload": "Invalid or missing nested payload structure."}
            )

        return data
