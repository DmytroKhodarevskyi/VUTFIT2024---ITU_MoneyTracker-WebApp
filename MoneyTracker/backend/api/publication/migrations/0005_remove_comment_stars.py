from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publication', '0004_comment_stars_count'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comment',
            name='stars',
        ),
    ]