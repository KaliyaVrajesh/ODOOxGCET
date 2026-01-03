from rest_framework import permissions

class IsAdminOrHR(permissions.BasePermission):
    """
    Custom permission to only allow Admin or HR users.
    """
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.role in ['ADMIN', 'HR']
        )
