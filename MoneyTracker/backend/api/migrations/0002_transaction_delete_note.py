# Generated by Django 5.1 on 2024-08-26 18:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('category', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('amount', models.IntegerField()),
                ('incomeOrSpend', models.BooleanField()),
            ],
        ),
        migrations.DeleteModel(
            name='Note',
        ),
    ]