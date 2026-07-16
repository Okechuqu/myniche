from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import serializers

from .models import User
from .services.supabase_profile import SupabaseProfileService


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    agreed_to_privacy = serializers.BooleanField(write_only=True)

    class Meta:
        model = User
        fields = ("email", "username", "password", "agreed_to_privacy")

    def create(self, validated_data):
        # Ensure agreement is present and truthy
        agreed = validated_data.pop("agreed_to_privacy", False)
        if not agreed:
            raise serializers.ValidationError({
                "agreed_to_privacy": "You must accept the privacy policy to register"
            })

        return User.objects.create_user(
            email=validated_data["email"],
            username=validated_data["username"],
            password=validated_data["password"],
            provider="email",
            agreed_to_privacy=True,
        )


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class UserSerializer(serializers.ModelSerializer):
    niche = serializers.SerializerMethodField()
    main_platform = serializers.SerializerMethodField()
    creator_goal = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    has_usable_password = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "username",
            "niche",
            "main_platform",
            "creator_goal",
            "avatar",
            "provider",
            "plan_name",
            "script_quota",
            "created_at",
            "has_usable_password",
        )

    def _profile_data(self, user):
        if not hasattr(self, "_cached_profile"):
            self._cached_profile = SupabaseProfileService.get_profile(user.id) or {
            }
        return self._cached_profile

    def get_niche(self, user):
        return self._profile_data(user).get("niche", "")

    def get_main_platform(self, user):
        return self._profile_data(user).get("main_platform", "")

    def get_creator_goal(self, user):
        return self._profile_data(user).get("creator_goal", "")

    def get_avatar(self, user):
        return self._profile_data(user).get("avatar", "")

    def get_has_usable_password(self, user):
        return user.has_usable_password()


class ProfileUpdateSerializer(serializers.ModelSerializer):
    niche = serializers.CharField(required=False, allow_blank=True)
    main_platform = serializers.CharField(required=False, allow_blank=True)
    creator_goal = serializers.CharField(required=False, allow_blank=True)
    avatar = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = (
            "username",
            "niche",
            "main_platform",
            "creator_goal",
            "avatar",
        )
        extra_kwargs = {
            "username": {"required": True},
        }

    def validate_username(self, value):
        user = self.context["request"].user
        if (
            User.objects
            .exclude(pk=user.pk)
            .filter(username__iexact=value)
            .exists()
        ):
            raise serializers.ValidationError("Username is already in use")

        return value

    def update(self, instance, validated_data):
        username = validated_data.get("username", instance.username)
        profile_fields = {
            key: validated_data[key]
            for key in ("niche", "main_platform", "creator_goal", "avatar")
            if key in validated_data
        }

        update_fields = []

        if username != instance.username:
            instance.username = username
            update_fields.append("username")

        if profile_fields:
            for key, value in profile_fields.items():
                setattr(instance, key, value)
                update_fields.append(key)

            try:
                SupabaseProfileService.upsert_profile(
                    instance.id, profile_fields)
            except RuntimeError:
                # Keep local user mirror values if Supabase is unavailable.
                pass

        if update_fields:
            instance.save(update_fields=update_fields)

        return instance


class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(
        required=False,
        allow_blank=True,
        write_only=True,
    )
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = self.context["request"].user
        current_password = attrs.get("current_password", "")
        new_password = attrs["new_password"]
        confirm_password = attrs["confirm_password"]

        if new_password != confirm_password:
            raise serializers.ValidationError(
                {
                    "confirm_password": "Passwords must match"
                }
            )

        if user.has_usable_password() and not user.check_password(
            current_password
        ):
            raise serializers.ValidationError(
                {
                    "current_password": "Current password is incorrect"
                }
            )

        validate_password(new_password, user)
        return attrs

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save(update_fields=["password"])
        return user


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def save(self, **kwargs):
        email = self.validated_data["email"]
        user = User.objects.filter(
            email__iexact=email,
            is_active=True,
        ).first()

        if not user:
            return None

        uid = urlsafe_base64_encode(
            force_bytes(user.pk)
        )
        token = default_token_generator.make_token(
            user
        )
        reset_url = (
            f"{settings.FRONTEND_URL}/reset-password"
            f"?uid={uid}&token={token}"
        )

        send_mail(
            "Reset your MyNiche password",
            (
                "Use this link to reset your MyNiche password:\n\n"
                f"{reset_url}\n\n"
                "If you did not request this, you can ignore this email."
            ),
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=True,
        )

        return reset_url


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    default_error_messages = {
        "invalid_token": "Reset link is invalid or expired"
    }

    def validate(self, attrs):
        try:
            user_id = force_str(
                urlsafe_base64_decode(attrs["uid"])
            )
            user = User.objects.get(
                pk=user_id,
                is_active=True,
            )
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError(
                {
                    "detail": self.error_messages["invalid_token"]
                }
            )

        if not default_token_generator.check_token(
            user,
            attrs["token"],
        ):
            raise serializers.ValidationError(
                {
                    "detail": self.error_messages["invalid_token"]
                }
            )

        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {
                    "confirm_password": "Passwords must match"
                }
            )

        validate_password(
            attrs["new_password"],
            user,
        )
        attrs["user"] = user
        return attrs

    def save(self, **kwargs):
        user = self.validated_data["user"]
        user.set_password(
            self.validated_data["new_password"]
        )
        user.save(update_fields=["password"])
        return user
