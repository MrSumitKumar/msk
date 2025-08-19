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
    auto_placement = serializers.BooleanField(required=False, default=False)
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=15, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=User.Role.choices, default=User.Role.STUDENT)

    def validate(self, data):
        if data.get('position'):
            data['position'] = data['position'].upper()
        return data

    @transaction.atomic
    def create(self, validated_data):
        sponsor_username = validated_data.get('sponsor_username')
        position = validated_data.get('position')
        auto_placement = validated_data.get('auto_placement', False)

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
            last_name=validated_data.get('last_name', '')
        )

        # Step 3: Create MLM Member
        new_member = Member.objects.create(user=user)

        # -------------------------------------------------
        # RULE 1: No sponsor + No position
        # -------------------------------------------------
        if not sponsor_username and not position:
            root = Member.objects.filter(head_member__isnull=True).exclude(pk=new_member.pk).first()

            if not root:
                # 👉 First ever member becomes ROOT (no sponsor/head/position)
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

            # If root exists → make root sponsor, and place automatically
            sponsor_member = root
            auto_placement = True

        # -------------------------------------------------
        # RULE 2 & 3: Sponsor is provided
        # -------------------------------------------------
        elif sponsor_username:
            try:
                sponsor_user = User.objects.get(username=sponsor_username)
                sponsor_member = sponsor_user.mlm_profile
            except User.DoesNotExist:
                raise serializers.ValidationError({"sponsor_username": "Invalid sponsor username."})
            except AttributeError:
                raise serializers.ValidationError({"sponsor_username": "Sponsor's MLM profile not found."})

            # ✅ If position not given → sponsor decides placement side
            if not position:
                auto_placement = False  # placement via sponsor’s counts
                position = None

        # -------------------------------------------------
        # RULE 1 (fallback): No sponsor but position is given
        # -------------------------------------------------
        else:
            sponsor_member = Member.objects.filter(head_member__isnull=True).exclude(pk=new_member.pk).first()
            auto_placement = True

        # -------------------------------------------------
        # Step 4: Placement using MLM logic
        # -------------------------------------------------
        try:
            head_member, final_position = sponsor_member.assign_new_member(
                new_member=new_member,
                position=position,
                auto_placement=auto_placement
            )
        except ValidationError as e:
            raise serializers.ValidationError({"placement": e.message})
        except Exception as e:
            raise serializers.ValidationError({"placement": str(e)})

        # -------------------------------------------------
        # Step 5: Return Success Response
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
                'auto_placed': auto_placement or not position
            }
        }

    def to_representation(self, instance):
        return instance


class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='get_role_display', read_only=True)
    gender = serializers.CharField(source='get_gender_display', read_only=True)
    status = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'role', 'phone', 'address',
            'picture', 'date_of_birth', 'gender', 'status', 'is_staff', 'is_superuser'
        ]


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

