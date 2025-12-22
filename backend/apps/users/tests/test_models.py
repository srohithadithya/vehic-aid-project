import pytest
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
def test_create_user():
    user = User.objects.create_user(
        username="testuser",
        email="test@example.com",
        password="password123",
        first_name="Test",
        last_name="User",
    )
    assert user.username == "testuser"
    assert user.email == "test@example.com"
    assert user.check_password("password123")
    assert user.is_active
    assert not user.is_staff
