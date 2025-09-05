# users/serializers.py
from rest_framework import serializers
from .models import CustomUser
from backend.utils import generate_username
from django.db import transaction
from mlm.models import Member
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()


class UserRegistrationSerializer(serializers.Serializer):
    sponsor_username = serializers.CharField(required=False, allow_blank=True)
    position = serializers.ChoiceField(
        choices=Member.Position.choices,
        required=False,
        allow_null=True
    )
    # NOTE: auto_placement will be honored ONLY if sponsor is provided.
    auto_placement = serializers.BooleanField(required=False, default=False)
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=15, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=User.Role.choices, default=User.Role.STUDENT)
    gender = serializers.ChoiceField(
            choices=[("MALE", "Male"), ("FEMALE", "Female")],
            required=False,
            allow_null=True,
            allow_blank=True
        )
    date_of_birth = serializers.DateField(required=False, allow_null=True)


    def validate(self, data):
        if data.get('position'):
            data['position'] = data['position'].upper()
        return data

    @transaction.atomic
    def create(self, validated_data):
        sponsor_username = (validated_data.get('sponsor_username') or '').strip()
        position = validated_data.get('position')
        req_auto_placement = bool(validated_data.get('auto_placement', False))

        # Step 1: Generate unique username
        username = generate_username(validated_data.get('first_name'))

        # Step 2: Create User
        user = User.objects.create_user(
            username=username,
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', User.Role.STUDENT),
            phone=validated_data.get('phone', ''),
            first_name=validated_data['first_name'],
            last_name=validated_data.get('last_name', ''),
            gender=validated_data.get('gender', None),
            date_of_birth=validated_data.get('date_of_birth', None)     
        )

        # Step 3: Create MLM Member shell (no placement yet)
        new_member = Member.objects.create(user=user)

        # -------------------------------------------------
        # RULE A: If NO sponsor is provided → DO NOT place.
        #         Only create member profile.
        #         (Exception: first-ever member becomes root)
        # -------------------------------------------------
        if not sponsor_username:
            existing_root = Member.objects.filter(head_member__isnull=True).exclude(pk=new_member.pk).first()

            if not existing_root:
                # First-ever member: keep as root (no head/sponsor/position)
                return {
                    'success': True,
                    'user': {
                        'role': user.role,
                        'email': user.email,
                        'username': user.username,
                        'first_name': user.first_name,
                        'last_name': user.last_name
                    },
                    'mlm': {
                        'sponsor_username': None,
                        'head_member': None,
                        'position': None,
                        'auto_placed': False
                    }
                }

            # Root exists → just profile creation; no placement/sponsor/position
            return {
                'success': True,
                'user': {
                    'role': user.role,
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                },
                'mlm': {
                    'sponsor_username': None,
                    'head_member': None,
                    'position': None,
                    'auto_placed': False
                }
            }

        # -------------------------------------------------
        # RULE B: Sponsor is provided → placement allowed.
        #         If position is absent, allow auto-placement.
        # -------------------------------------------------
        try:
            sponsor_user = User.objects.get(username=sponsor_username)
            sponsor_member = sponsor_user.mlm_profile
        except User.DoesNotExist:
            raise serializers.ValidationError({"sponsor_username": "Invalid sponsor username."})
        except AttributeError:
            raise serializers.ValidationError({"sponsor_username": "Sponsor's MLM profile not found."})

        # If explicit position given → disable auto placement
        # If no position → enable auto placement (under sponsor)
        if position:
            auto_placement = False
        else:
            auto_placement = True

        # (Even if client requested auto_placement incorrectly,
        # we enforce the above rule set based on presence of sponsor/position.)
        try:
            head_member, final_position = sponsor_member.assign_new_member(
                new_member=new_member,
                position=position,           # may be None
                auto_placement=auto_placement
            )
        except ValidationError as e:
            raise serializers.ValidationError({"placement": e.message})
        except Exception as e:
            raise serializers.ValidationError({"placement": str(e)})

        # -------------------------------------------------
        # Step 4: Success Response
        # -------------------------------------------------
        return {
            'success': True,
            'user': {
                'role': user.role,
                'email': user.email,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name
            },
            'mlm': {
                'sponsor_username': sponsor_member.user.username if sponsor_member else None,
                'head_member': head_member.user.username if head_member else None,
                'position': final_position,
                'auto_placed': auto_placement
            }
        }

    def to_representation(self, instance):
        return instance



class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    date_joined = serializers.DateTimeField(read_only=True)
    last_login = serializers.DateTimeField(read_only=True)
    role = serializers.ChoiceField(choices=CustomUser.Role.choices)
    gender = serializers.ChoiceField(choices=CustomUser.Role.choices, required=False)
    status = serializers.ChoiceField(choices=CustomUser.Status.choices)

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'full_name', 'first_name', 'last_name',
            'role', 'phone', 'address', 'picture', 'date_of_birth', 'gender',
            'status', 'is_staff', 'is_superuser', 'is_approved', 'date_joined',
            'last_login'
        ]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username


class UserProfileSerializer(serializers.ModelSerializer):
    picture = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = [ 'username', 'email', 'first_name', 'last_name',
            'phone', 'address', 'date_of_birth', 'gender', 'picture',
        ]
        read_only_fields = ['username', 'email']

    def get_picture(self, obj):
        request = self.context.get('request', None)
        if request and obj.picture:
            return request.build_absolute_uri(obj.picture.url)
        elif obj.picture:
            return obj.picture.url
        return None

    def update(self, instance, validated_data):
        picture = self.context['request'].FILES.get('picture')
        if picture:
            instance.picture = picture

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

