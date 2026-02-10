from django.db import models
from django.utils import timezone

class Member(models.Model):
    SEX_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
    ]
    
    MARITAL_CHOICES = [
        ('Single', 'Single'),
        ('Married', 'Married'),
        ('Divorced', 'Divorced'),
        ('Widowed', 'Widowed'),
    ]

    full_name = models.CharField(max_length=255)
    age = models.PositiveIntegerField()
    sex = models.CharField(max_length=10, choices=SEX_CHOICES, default='Male')
    marital_status = models.CharField(max_length=20, choices=MARITAL_CHOICES, default='Single')
    children = models.PositiveIntegerField(default=0)
    phone = models.CharField(max_length=20)  # Handles format like +255 ...
    reg_date = models.DateField()
    exp_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    membershipPlan = models.CharField(max_length=255)

    @property
    def is_active(self):
        """Calculates status dynamically based on current date"""
        return self.exp_date > timezone.now().date()

    def __str__(self):
        return self.full_name

    class Meta:
        ordering = ['-created_at']
