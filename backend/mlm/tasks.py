# mlm/tasks.py
from celery import shared_task
from django.utils import timezone
from decimal import Decimal
from .models import CompanyWallet, Member, IncomeHistory
import logging

logger = logging.getLogger(__name__)

@shared_task
def distribute_global_pool():
    """
    Example monthly distribution: shares a small pool among top sellers (top 10 by total_income).
    Pool = 2% of CompanyWallet.balance (or other logic).
    """
    try:
        wallet, _ = CompanyWallet.objects.get_or_create(pk=1)
        pool_amount = (wallet.balance * Decimal('0.02')).quantize(Decimal('0.01'))  # 2%
        if pool_amount <= 0:
            return {"distributed": 0}

        # Get top 10 members by total_income
        top_members = Member.objects.filter(status=Member.STATUS_ACTIVE).order_by('-total_income')[:10]
        if not top_members:
            return {"distributed": 0}

        share = (pool_amount / len(top_members)).quantize(Decimal('0.01'))

        for m in top_members:
            m.wallet_balance += share
            m.total_income += share
            m.save(update_fields=['wallet_balance', 'total_income'])
            IncomeHistory.objects.create(member=m, income_type=IncomeHistory.INCOME_REWARD,
                                         amount=share, description="Global pool monthly reward")
        try:
            wallet.deduct_from_wallet(pool_amount)
        except Exception:
            logger.exception("Failed to deduct company wallet for global pool")

        return {"distributed": float(pool_amount), "shares": float(share)}
    except Exception:
        logger.exception("Error distributing global pool")
        raise
