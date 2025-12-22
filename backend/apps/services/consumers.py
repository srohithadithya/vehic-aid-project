import json

from channels.generic.websocket import AsyncWebsocketConsumer


class ServiceTrackingConsumer(AsyncWebsocketConsumer):
    """
    Handles real-time tracking updates for both Service Bookers and Providers.
    """

    async def connect(self):
        # Authentication check needed here (e.g., using JWT from URL query)
        self.request_id = self.scope["url_route"]["kwargs"]["request_id"]
        self.room_group_name = f"service_{self.request_id}"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        # Messages from client are typically just simple pings or location broadcasts (for provider)
        text_data_json = json.loads(text_data)

        if "provider_location" in text_data_json:
            # Example: Provider sends their updated location
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "status_update",
                    "message": "location",
                    "latitude": text_data_json["latitude"],
                    "longitude": text_data_json["longitude"],
                },
            )

    # Receive message from room group (sent by views.py or dispatch_logic)
    async def status_update(self, event):
        # Send message to WebSocket
        await self.send(
            text_data=json.dumps(
                {
                    "status": event["status"],
                    "message": event["message"],
                    "data": event.get("data", {}),
                }
            )
        )
