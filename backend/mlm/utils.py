# mlm/utils.py
from decimal import Decimal

def percent_of(amount, percent):
    amount = Decimal(amount)
    return (amount * Decimal(percent) / Decimal('100.00')).quantize(Decimal('0.01'))
