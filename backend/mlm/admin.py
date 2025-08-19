# mlm/admin.py
from django.contrib import admin
from .models import (
    CompanyWallet, Plan, Level, RankAndRewards, Member, MemberBankDetails,
    MemberPlan, IncomeHistory, WalletTransaction, PaymentRequest
)

@admin.register(CompanyWallet)
class CompanyWalletAdmin(admin.ModelAdmin):
    list_display = ['id', 'balance', 'charges_balance']
    readonly_fields = []

@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'direct', 'matching']

@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ['plan', 'level', 'distributed_amount', 'resale_percentage']
    list_filter = ['plan']

@admin.register(RankAndRewards)
class RankAdmin(admin.ModelAdmin):
    list_display = ['rank_no', 'rank_name', 'pairs', 'amount', 'royalty']

@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ['user', 'position', 'get_head_member_username', 'get_sponsor_username']
    search_fields = ['user__username', 'user__email', 'sponsor__user__username']
    readonly_fields = ['joined_on', 'last_updated']

    def get_sponsor_username(self, obj):
        return obj.sponsor.user.username if obj.sponsor and obj.sponsor.user else '-'
    get_sponsor_username.short_description = 'Sponsor Username'

    def get_head_member_username(self, obj):
        return obj.head_member.user.username if obj.head_member and obj.head_member.user else '-'
    get_head_member_username.short_description = 'Head Username'


@admin.register(MemberBankDetails)
class MemberBankAdmin(admin.ModelAdmin):
    list_display = ['member', 'bank_name', 'upi_id']

@admin.register(MemberPlan)
class MemberPlanAdmin(admin.ModelAdmin):
    list_display = ['member', 'plan', 'status', 'purchased_date']
    actions = ['mark_completed']

    def mark_completed(self, request, queryset):
        for obj in queryset:
            obj.mark_completed()
        self.message_user(request, "Selected plans marked completed and processed.")
    mark_completed.short_description = "Mark selected plans as completed"

@admin.register(IncomeHistory)
class IncomeHistoryAdmin(admin.ModelAdmin):
    list_display = ['member', 'income_type', 'amount', 'created_at']
    list_filter = ['income_type']

@admin.register(WalletTransaction)
class WalletTransactionAdmin(admin.ModelAdmin):
    list_display = ['user', 'transaction_type', 'amount', 'balance_after', 'timestamp']

@admin.register(PaymentRequest)
class PaymentRequestAdmin(admin.ModelAdmin):
    list_display = ['member', 'request_type', 'amount', 'status', 'request_date', 'approved_by']
    list_filter = ['status']
