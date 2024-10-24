from django.db import migrations

def create_default_category(apps, schema_editor):
    Category = apps.get_model('api', 'Category')
    Category.objects.create(name='Default', color='#000000')

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_alter_category_color_alter_transaction_category'),  
    ]

    operations = [
        migrations.RunPython(create_default_category),
    ]