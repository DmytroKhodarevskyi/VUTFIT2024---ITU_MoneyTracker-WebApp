# Generated by Django 5.1.1 on 2024-10-19 16:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_alter_transaction_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='category',
            field=models.CharField(max_length=100),
        ),
    ]
