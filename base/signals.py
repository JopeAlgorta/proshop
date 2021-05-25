from django.db.models.signals import pre_save
from .models import User


def update_user(sender, instance, **kwarks):
    if instance.email != '':
        instance.username = instance.email


pre_save.connect(update_user, sender=User)
