# Generated by Django 5.1.1 on 2024-11-13 10:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('publication', '0002_star'),
    ]

    operations = [
        migrations.AlterField(
            model_name='publication',
            name='title',
            field=models.CharField(max_length=128),
        ),
    ]