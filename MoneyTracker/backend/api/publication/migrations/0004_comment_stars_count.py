# Generated by Django 5.1 on 2024-11-19 16:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('publication', '0003_alter_publication_title'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='stars_count',
            field=models.PositiveIntegerField(default=0),
        ),
    ]