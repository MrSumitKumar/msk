# mlm/services.py
from decimal import Decimal
from django.db import transaction
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import (
    MemberPlan, Member, Plan, Level, IncomeHistory, WalletTransaction, CompanyWallet, MemberPlan
)
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

TDS_PERCENT = Decimal('10.0')  # 10% TDS on payouts (applied when users withdraw)

def safe_decimal(v):
    return v if isinstance(v, Decimal) else Decimal(str(v or '0.00'))


@transaction.atomic
def process_commissions_for_purchase(member_plan: MemberPlan):
    """
    Main entry: called when MemberPlan.mark_completed is called.
    Distributes Direct Income, Level Income, Resale Income, and triggers matching update.
    """
    try:
        member = member_plan.member
        plan = member_plan.plan

        # Ensure company wallet exists
        company_wallet, _ = CompanyWallet.objects.get_or_create(pk=1)

        # 1) Direct Income: pay to sponsor (if exists)
        sponsor_user = member.sponsor
        direct_paid = Decimal('0.00')
        if sponsor_user:
            try:
                sponsor_member = Member.objects.get(user=sponsor_user)
                direct_paid = safe_decimal(plan.direct)
                _credit_member(sponsor_member, direct_paid, IncomeHistory.INCOME_DIRECT,
                               f"Direct income from purchase of {member.user.username} for plan {plan.name}")
                # deduct from company wallet
                try:
                    company_wallet.deduct_from_wallet(direct_paid)
                except Exception:
                    logger.exception("Company wallet deduct failed for direct income.")
            except Member.DoesNotExist:
                logger.exception("Sponsor Member not found for user %s", sponsor_user)

        # 2) Level Income: traverse uplines upto 10 levels and distribute Level.distributed_amount
        level_paid_total = Decimal('0.00')
        current_user = member.head_member
        level_index = 1
        while current_user and level_index <= 10:
            try:
                upline_member = Member.objects.get(user=current_user)
            except Member.DoesNotExist:
                break

            try:
                level_conf = Level.objects.get(plan=plan, level=level_index)
                amount = safe_decimal(level_conf.distributed_amount)
                if amount > 0:
                    _credit_member(upline_member, amount, IncomeHistory.INCOME_LEVEL,
                                   f"Level {level_index} income from purchase by {member.user.username}")
                    level_paid_total += amount
                    try:
                        company_wallet.deduct_from_wallet(amount)
                    except Exception:
                        logger.exception("Company wallet deduct failed for level income.")
            except Level.DoesNotExist:
                # skip if no configuration
                pass

            # move up
            if upline_member.head_member:
                current_user = upline_member.head_member
            else:
                break
            level_index += 1

        # 3) Resale Income: distribute resale percentage for levels configured
        resale_paid_total = Decimal('0.00')
        current_user = member.head_member
        level_index = 1
        while current_user and level_index <= 10:
            try:
                upline_member = Member.objects.get(user=current_user)
            except Member.DoesNotExist:
                break

            try:
                level_conf = Level.objects.get(plan=plan, level=level_index)
                resale_pct = safe_decimal(level_conf.resale_percentage)
                if resale_pct > 0:
                    resale_amount = (plan.price * resale_pct / Decimal('100.00')).quantize(Decimal('0.01'))
                    _credit_member(upline_member, resale_amount, IncomeHistory.INCOME_RESALE,
                                   f"Resale level {level_index} income from purchase by {member.user.username}")
                    resale_paid_total += resale_amount
                    try:
                        company_wallet.deduct_from_wallet(resale_amount)
                    except Exception:
                        logger.exception("Company wallet deduct failed for resale income.")
            except Level.DoesNotExist:
                pass

            if upline_member.head_member:
                current_user = upline_member.head_member
            else:
                break
            level_index += 1

        # 4) Matching income: call update_matching_income (it will itself create IncomeHistory)
        from .models import update_matching_income
        try:
            update_matching_income(member_plan)
        except Exception:
            logger.exception("update_matching_income failed for member_plan %s", member_plan.pk)

        # (Optional) Return a summary
        return {
            'direct_paid': float(direct_paid),
            'level_paid_total': float(level_paid_total),
            'resale_paid_total': float(resale_paid_total)
        }

    except Exception as exc:
        logger.exception("process_commissions_for_purchase failed: %s", exc)
        raise


def _credit_member(member_obj: Member, amount: Decimal, income_type: str, description: str):
    """
    Credit amount to a member's wallet/account, record IncomeHistory and WalletTransaction.
    """
    try:
        amt = safe_decimal(amount)
        if amt <= 0:
            return
        # credit account_balance and wallet_balance
        member_obj.account_balance += amt
        member_obj.wallet_balance += amt
        member_obj.total_income += amt
        member_obj.today_income += amt
        # track type-specific counters
        if income_type == IncomeHistory.INCOME_DIRECT:
            member_obj.direct_income += amt
        elif income_type == IncomeHistory.INCOME_LEVEL:
            member_obj.level_income += amt
        elif income_type == IncomeHistory.INCOME_RESALE:
            member_obj.resale_income += amt
        elif income_type == IncomeHistory.INCOME_MATCHING:
            member_obj.matching_income += amt

        member_obj.save(update_fields=[
            'account_balance', 'wallet_balance', 'total_income', 'today_income',
            'direct_income', 'level_income', 'resale_income', 'matching_income'
        ])

        # create income history
        IncomeHistory.objects.create(member=member_obj, income_type=income_type, amount=amt, description=description)

        # create wallet transaction
        WalletTransaction.objects.create(user=member_obj, transaction_type=WalletTransaction.TRANSACTION_CREDIT,
                                         amount=amt, balance_after=member_obj.wallet_balance, description=description)
    except Exception:
        logger.exception("Failed to credit member %s amount %s", getattr(member_obj, 'pk', None), amount)
        raise
