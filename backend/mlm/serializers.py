# mlm/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Member, MemberBankDetails, Plan, Level, RankAndRewards, MemberPlan,
    IncomeHistory, WalletTransaction, PaymentRequest, CompanyWallet, DirectTeam
)

User = get_user_model()


class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ['id', 'name', 'price', 'direct', 'matching']


class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ['id', 'plan', 'level', 'distributed_amount', 'resale_percentage']


class RankAndRewardsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RankAndRewards
        fields = ['rank_no', 'rank_name', 'royalty', 'pairs', 'amount', 'reward_name']


class MemberBankSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberBankDetails
        fields = ['id', 'member', 'upi_id', 'bank_name', 'bank_account', 'bank_ifsc']


class MemberSerializer(serializers.ModelSerializer):
    user = UserSimpleSerializer(read_only=True)
    sponsor = UserSimpleSerializer(read_only=True)
    head_member = UserSimpleSerializer(read_only=True)

    class Meta:
        model = Member
        exclude = []


class MemberPlanSerializer(serializers.ModelSerializer):
    member = MemberSerializer(read_only=True)
    plan_id = serializers.PrimaryKeyRelatedField(source='plan', queryset=Plan.objects.all(), write_only=True)

    class Meta:
        model = MemberPlan
        fields = ['id', 'member', 'plan', 'plan_id', 'purchased_date', 'status']
        read_only_fields = ['purchased_date', 'plan']


class IncomeHistorySerializer(serializers.ModelSerializer):
    member = MemberSerializer(read_only=True)

    class Meta:
        model = IncomeHistory
        fields = ['id', 'member', 'income_type', 'amount', 'description', 'created_at']


class WalletTransactionSerializer(serializers.ModelSerializer):
    user = MemberSerializer(read_only=True)

    class Meta:
        model = WalletTransaction
        fields = ['id', 'user', 'transaction_type', 'amount', 'balance_after', 'description', 'timestamp']


class PaymentRequestSerializer(serializers.ModelSerializer):
    member = MemberSerializer(read_only=True)

    class Meta:
        model = PaymentRequest
        fields = [
            'id', 'member', 'request_type', 'amount', 'wallet_balance_before', 'bank_name', 'account_number',
            'ifsc_code', 'account_holder_name', 'upi_id', 'description', 'status', 'request_date', 'approved_by',
            'approval_date', 'admin_notes', 'rejection_reason', 'transaction_id', 'completed_date'
        ]
        read_only_fields = ['wallet_balance_before', 'request_date', 'status']
