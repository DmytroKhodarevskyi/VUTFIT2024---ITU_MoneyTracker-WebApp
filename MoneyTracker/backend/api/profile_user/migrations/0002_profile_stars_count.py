# Generated by Django 5.1 on 2024-10-27 19:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profile_user', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='stars_count',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
