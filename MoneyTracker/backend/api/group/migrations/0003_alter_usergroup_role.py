# Generated by Django 5.1 on 2024-11-18 19:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('group', '0002_group_group_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usergroup',
            name='role',
            field=models.CharField(choices=[('creator', 'Creator'), ('moderator', 'Moderator'), ('member', 'Member')], default='member', max_length=10),
        ),
    ]
