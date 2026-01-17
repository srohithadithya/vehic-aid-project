# Generated migration for adding all vehicle types

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0013_chatmessage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vehicle',
            name='vehicle_type',
            field=models.CharField(
                choices=[
                    ('TWO_WHEELER', 'Two Wheeler (Bike/Scooter)'),
                    ('THREE_WHEELER', 'Three Wheeler (Auto Rickshaw)'),
                    ('FOUR_WHEELER', 'Four Wheeler (Car/Sedan/Hatchback)'),
                    ('SUV', 'SUV (Sport Utility Vehicle)'),
                    ('VAN', 'Van (Minivan/Cargo Van)'),
                    ('TRUCK', 'Truck (Light/Medium Commercial)'),
                    ('HEAVY_VEHICLE', 'Heavy Vehicle (Bus/Heavy Truck)')
                ],
                default='FOUR_WHEELER',
                help_text='Type of vehicle for appropriate service and pricing',
                max_length=20
            ),
        ),
    ]
