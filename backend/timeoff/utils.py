from decimal import Decimal
from timeoff.models import TimeOffBalance

def get_or_create_balance(user, timeoff_type, year):
    """
    Get or create a TimeOffBalance for a user, type, and year.
    If creating, uses the default allocation from TimeOffType.
    """
    balance, created = TimeOffBalance.objects.get_or_create(
        user=user,
        timeoff_type=timeoff_type,
        year=year,
        defaults={
            'allocated_days': timeoff_type.default_annual_allocation_days,
            'used_days': Decimal('0.0')
        }
    )
    return balance

def validate_balance_for_request(balance, requested_days):
    """
    Validate that the balance has enough available days.
    Returns error message if invalid, None if valid.
    """
    available = balance.available_days
    
    if requested_days > available:
        return (
            f"Insufficient balance. Requested: {requested_days} days, "
            f"Available: {available} days for {balance.timeoff_type.name}"
        )
    
    return None

def initialize_balances_for_user(user, year):
    """
    Initialize time off balances for a user for a given year.
    Creates balances for all active time off types.
    """
    from timeoff.models import TimeOffType
    
    active_types = TimeOffType.objects.filter(is_active=True)
    balances = []
    
    for timeoff_type in active_types:
        balance, created = TimeOffBalance.objects.get_or_create(
            user=user,
            timeoff_type=timeoff_type,
            year=year,
            defaults={
                'allocated_days': timeoff_type.default_annual_allocation_days,
                'used_days': Decimal('0.0')
            }
        )
        balances.append(balance)
    
    return balances
