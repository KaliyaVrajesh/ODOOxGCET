from datetime import datetime
import secrets
import string

def generate_login_id(company_name, full_name, joining_year=None):
    """
    Generate login_id in format: {company_code}{name_code}{year}{serial}
    Example: OIJODO20220001
    
    - company_code: First 2 letters of company name (uppercase) - e.g., "OI" for "Odoo India"
    - name_code: First 2 letters of first name + first 2 letters of last name (uppercase)
    - year: Year of joining (4-digit)
    - serial: 4-digit incremental number for that year
    """
    from accounts.models import User
    
    # Extract company code (first 2 letters)
    company_code = ''.join(filter(str.isalpha, company_name))[:2].upper()
    if len(company_code) < 2:
        company_code = company_code.ljust(2, 'X')
    
    # Extract name code (first 2 of first name + first 2 of last name)
    name_parts = full_name.strip().split()
    first_name = name_parts[0] if name_parts else 'XX'
    last_name = name_parts[-1] if len(name_parts) > 1 else 'XX'
    
    first_code = ''.join(filter(str.isalpha, first_name))[:2].upper()
    last_code = ''.join(filter(str.isalpha, last_name))[:2].upper()
    
    if len(first_code) < 2:
        first_code = first_code.ljust(2, 'X')
    if len(last_code) < 2:
        last_code = last_code.ljust(2, 'X')
    
    name_code = first_code + last_code
    
    # Use provided joining_year or current year
    year = joining_year if joining_year else datetime.now().year
    
    # Find the next serial number for this year
    prefix = f"{company_code}{name_code}{year}"
    
    # Get all login_ids that start with this prefix
    existing_ids = User.objects.filter(
        login_id__startswith=prefix
    ).values_list('login_id', flat=True)
    
    # Extract serial numbers and find the max
    serial_numbers = []
    for login_id in existing_ids:
        try:
            serial = int(login_id[-4:])
            serial_numbers.append(serial)
        except (ValueError, IndexError):
            continue
    
    next_serial = max(serial_numbers, default=0) + 1
    serial_str = str(next_serial).zfill(4)
    
    return f"{prefix}{serial_str}"


def generate_random_password(length=12):
    """
    Generate a secure random password for new users.
    Password contains uppercase, lowercase, digits, and special characters.
    """
    # Ensure password has at least one of each type
    password_chars = [
        secrets.choice(string.ascii_uppercase),
        secrets.choice(string.ascii_lowercase),
        secrets.choice(string.digits),
        secrets.choice('!@#$%^&*')
    ]
    
    # Fill the rest with random characters
    all_chars = string.ascii_letters + string.digits + '!@#$%^&*'
    password_chars += [secrets.choice(all_chars) for _ in range(length - 4)]
    
    # Shuffle to avoid predictable patterns
    secrets.SystemRandom().shuffle(password_chars)
    
    return ''.join(password_chars)
