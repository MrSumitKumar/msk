# mlm/models.py
from django.db import models, transaction
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save
from django.dispatch import receiver
from decimal import Decimal
import logging
from collections import deque
from django.core.exceptions import ValidationError
from django.db.models import F

logger = logging.getLogger(__name__)


# ---------------------------
# Company wallet (singleton-like usage)
# ---------------------------
class CompanyWallet(models.Model):
    balance = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    charges_balance = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))

    class Meta:
        verbose_name = "Company Wallet"
        verbose_name_plural = "Company Wallets"

    def __str__(self):
        return f"Company Wallet: ₹{self.balance}"

    def add_to_wallet(self, amount):
        amount = Decimal(amount)
        if amount < 0:
            raise ValueError("Amount to add cannot be negative.")
        self.balance += amount
        self.save(update_fields=['balance'])
        return self.balance

    def deduct_from_wallet(self, amount):
        amount = Decimal(amount)
        if amount < 0:
            raise ValueError("Amount to deduct cannot be negative.")
        if amount > self.balance:
            raise ValueError("Insufficient balance in the wallet.")
        self.balance -= amount
        self.save(update_fields=['balance'])
        return self.balance


# ---------------------------
# Plan, Level and rank models
# ---------------------------
class Plan(models.Model):
    """
    Plan defines a price-tier and base incomes used in commission calculations.
    You should create three Plan instances for the platform:
      - Starter (₹499)
      - Pro (₹999)
      - Premium (e.g. ₹15000+)
    """
    name = models.CharField(max_length=80, unique=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    # direct and matching stored as absolute amounts (₹)
    direct = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    matching = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))

    def __str__(self):
        return f"{self.name} - ₹{self.price}"


class Level(models.Model):
    """
    Level distribution for Level Income and Resale income percentages/amounts.
    Each Plan will have related Level rows (level 1..10).
    distributed_amount is stored as absolute amount (₹) for level income.
    resale_percentage is stored as percentage (0-100).
    """
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, related_name="levels")
    level = models.PositiveSmallIntegerField()
    distributed_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    resale_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'))

    class Meta:
        unique_together = ('plan', 'level')
        ordering = ['level']
        verbose_name = "Level Distribution"
        verbose_name_plural = "Level Distributions"

    def __str__(self):
        return f"{self.plan.name} | Level {self.level} -> ₹{self.distributed_amount} | Resale {self.resale_percentage}%"


class RankAndRewards(models.Model):
    """
    Ranks used for overriding / leadership benefits and rewards.
    pairs indicates required matching pairs to achieve the rank.
    """
    rank_no = models.PositiveIntegerField(unique=True)
    rank_name = models.CharField(max_length=60)
    royalty = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    pairs = models.PositiveIntegerField(default=0)
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    reward_name = models.CharField(max_length=150, null=True, blank=True)

    class Meta:
        ordering = ['rank_no']
        verbose_name = "Rank and Reward"
        verbose_name_plural = "Ranks and Rewards"

    def __str__(self):
        return f"{self.rank_no} - {self.rank_name}"


# ---------------------------
# Member profile
# ---------------------------

class Member(models.Model):
    class Position(models.TextChoices):
        LEFT = 'LEFT', 'Left'
        RIGHT = 'RIGHT', 'Right'
    
    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        INACTIVE = 'INACTIVE', 'Inactive'

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mlm_profile' )

    # sponsorship and placement (upline/head)
    sponsor = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='sponsored_user' )
    head_member = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='head_user' )
    position = models.CharField(max_length=10, choices=Position.choices, null=True, blank=True )

    # direct left/right pointers (store User refs for quick traversal)
    left = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='left_user' )
    right = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='right_user' )

    # subtree counters
    left_count = models.PositiveIntegerField(default=0)
    right_count = models.PositiveIntegerField(default=0)

    # levels/rank/matching
    level = models.PositiveIntegerField(default=0)
    rank_no = models.PositiveIntegerField(default=0)
    matching_pairs = models.PositiveIntegerField(default=0)
    all_matching_pairs = models.PositiveIntegerField(default=0)

    # incomes & balances
    account_balance = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    wallet_balance = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    total_withdrawal = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))

    today_income = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    total_income = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    direct_income = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    level_income = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    resale_income = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    matching_income = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))

    status = models.CharField( max_length=10, choices=Status.choices, default=Status.INACTIVE )
    block = models.BooleanField(default=False)

    joined_on = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "MLM Member"
        verbose_name_plural = "MLM Members"
        ordering = ['-joined_on']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['status']),
            models.Index(fields=['sponsor']),
            models.Index(fields=['head_member']),
        ]

    def __str__(self):
        return f"{self.user.username} ({self.status})"


    # ---------------------------
    # Utility methods (Updated)
    # ---------------------------

    def activate(self):
        """Activate this member safely."""
        if self.status == self.Status.ACTIVE:
            return  # already active, avoid redundant save
        self.status = self.Status.ACTIVE
        self.save(update_fields=['status'])

    def get_direct_team(self):
        """
        Return all direct referrals (direct team members).
        These are the members whose sponsor == self.
        """
        return Member.objects.filter(sponsor=self)

    def get_left_team(self):
        """
        Get all members in the left subtree using BFS.
        """
        team = []
        if self.left:
            queue = deque([self.left])
            while queue:
                member = queue.popleft()
                team.append(member)
                if member.left:
                    queue.append(member.left)
                if member.right:
                    queue.append(member.right)
        return team

    def get_right_team(self):
        """
        Get all members in the right subtree using BFS.
        """
        team = []
        if self.right:
            queue = deque([self.right])
            while queue:
                member = queue.popleft()
                team.append(member)
                if member.left:
                    queue.append(member.left)
                if member.right:
                    queue.append(member.right)
        return team

    def get_team_sizes(self):
        """Return cached counters instantly (O(1))."""
        return self.left_count, self.right_count


    # ---------------------------------------
    # 🔑 Placement Finder
    # ---------------------------------------
    def find_placement(self, position=None):
        """
        Sponsor-based placement finder.
        Rules:
        1. If position is given (LEFT/RIGHT), strictly place in that branch using BFS.
        2. If position is not given → choose smaller side (if equal → choose LEFT).
        3. Return (head_member, final_position).
        """

        # Step 1: Decide which side to go
        if position:
            preferred_side = position
        else:
            # Auto-balance based on team counts
            if self.left_count <= self.right_count:
                preferred_side = Member.Position.LEFT
            else:
                preferred_side = Member.Position.RIGHT

        # Step 2: BFS traversal in chosen side
        queue = deque()

        if preferred_side == Member.Position.LEFT:
            if not self.left:
                return self, Member.Position.LEFT
            queue.append(self.left)
            side = Member.Position.LEFT
        else:
            if not self.right:
                return self, Member.Position.RIGHT
            queue.append(self.right)
            side = Member.Position.RIGHT

        while queue:
            current = queue.popleft()

            # Check if current node has empty slot
            if side == Member.Position.LEFT and not current.left:
                return current, Member.Position.LEFT
            elif side == Member.Position.RIGHT and not current.right:
                return current, Member.Position.RIGHT

            # Continue BFS deeper into same side
            if side == Member.Position.LEFT:
                if current.left:
                    queue.append(current.left)
            else:
                if current.right:
                    queue.append(current.right)

        raise ValidationError("No placement found (tree side unexpectedly full).")

    # ---------------------------------------
    # 🔑 Assign New Member
    # ---------------------------------------

    @transaction.atomic
    def assign_new_member(self, new_member: "Member", position=None, auto_placement=False):
        """
        Final placement logic:
        - Sponsor = always the referrer (self) OR root if first placement.
        - Head = jiske niche actually lagaya gaya (find_placement).
        - Position = LEFT/RIGHT auto decided (balance) if not given.
        """

        if new_member == self:
            raise ValidationError("A member cannot be placed under themselves.")

        # Step 1: Lock sponsor
        sponsor_locked = Member.objects.select_for_update().get(pk=self.pk)

        # Step 2: Special case: first ever member (root)
        root = Member.objects.filter(head_member__isnull=True).first()
        if not root:
            # system me koi root nahi hai → new_member root banega
            new_member.head_member = None
            new_member.sponsor = None
            new_member.position = None
            new_member.save(update_fields=['head_member', 'sponsor', 'position'])
            return new_member, None

        # Step 3: Find placement head under sponsor
        head_member, final_position = sponsor_locked.find_placement(position=position)

        # Step 4: Lock head
        head_locked = Member.objects.select_for_update().get(pk=head_member.pk)

        # Step 5: Validate slot
        if final_position == Member.Position.LEFT and head_locked.left_id:
            raise ValidationError("Left position already occupied.")
        if final_position == Member.Position.RIGHT and head_locked.right_id:
            raise ValidationError("Right position already occupied.")

        # Step 6: Save relationships
        new_member.sponsor = sponsor_locked
        new_member.head_member = head_locked
        new_member.position = final_position
        new_member.save(update_fields=['sponsor', 'head_member', 'position'])

        # Step 7: Attach into tree
        if final_position == Member.Position.LEFT:
            head_locked.left = new_member
        else:
            head_locked.right = new_member
        head_locked.save(update_fields=['left', 'right'])

        # Step 8: Update counts up the ancestor chain
        current, child = head_locked, new_member
        while current:
            if current.left_id == child.id:
                Member.objects.filter(pk=current.pk).update(left_count=F('left_count') + 1)
            elif current.right_id == child.id:
                Member.objects.filter(pk=current.pk).update(right_count=F('right_count') + 1)
            child, current = current, current.head_member

        return head_locked, final_position


# ---------------------------
# Bank details for members
# ---------------------------
class MemberBankDetails(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='bank_details')
    upi_id = models.CharField(max_length=120, null=True, blank=True)
    bank_name = models.CharField(max_length=120, null=True, blank=True)
    bank_account = models.CharField(max_length=30, null=True, blank=True)
    bank_ifsc = models.CharField(max_length=20, null=True, blank=True)

    class Meta:
        verbose_name = "Member Bank Detail"
        verbose_name_plural = "Member Bank Details"

    def __str__(self):
        return f"{self.member.user.username} - Bank/UPI"


# ---------------------------
# Member plan purchases
# ---------------------------
class MemberPlan(models.Model):
    STATUS_PENDING = 'Pending'
    STATUS_COMPLETED = 'Completed'
    STATUS_FAILED = 'Failed'
    PURCHASE_STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_COMPLETED, 'Completed'),
        (STATUS_FAILED, 'Failed'),
    ]

    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='plans')
    plan = models.ForeignKey(Plan, on_delete=models.PROTECT)
    purchased_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=PURCHASE_STATUS_CHOICES, default=STATUS_PENDING)

    class Meta:
        verbose_name = "Member Plan"
        verbose_name_plural = "Member Plans"
        ordering = ['-purchased_date']

    def __str__(self):
        return f"{self.member.user.username} - {self.plan.name}"

    def mark_completed(self):
        """
        Mark purchase completed and trigger commission processing.
        Commission allocation logic should be implemented in a service function (see update_matching_income below).
        """
        if self.status == self.STATUS_COMPLETED:
            return
        self.status = self.STATUS_COMPLETED
        self.save(update_fields=['status'])
        # trigger commission distribution (call external task/service)
        try:
            from mlm.services import process_commissions_for_purchase
            process_commissions_for_purchase(self)
        except Exception:
            logger.exception("Failed to trigger commission processing for MemberPlan id=%s", self.pk)


# ---------------------------
# Income history, wallet & payment models
# ---------------------------
class IncomeHistory(models.Model):
    INCOME_DIRECT = 'direct_income'
    INCOME_LEVEL = 'level_income'
    INCOME_MATCHING = 'matching_income'
    INCOME_RESALE = 'resale_income'
    INCOME_ROYALTY = 'royalty_income'
    INCOME_REWARD = 'reward_income'

    INCOME_TYPE_CHOICES = [
        (INCOME_DIRECT, 'Direct Income'),
        (INCOME_LEVEL, 'Level Income'),
        (INCOME_MATCHING, 'Matching Income'),
        (INCOME_RESALE, 'Resale Income'),
        (INCOME_ROYALTY, 'Royalty Income'),
        (INCOME_REWARD, 'Reward Income'),
    ]

    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='income_history')
    income_type = models.CharField(max_length=30, choices=INCOME_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=18, decimal_places=2)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Income History"
        verbose_name_plural = "Income Histories"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.member.user.username} - {self.income_type} - ₹{self.amount}"


class WalletTransaction(models.Model):
    TRANSACTION_CREDIT = 'credit'
    TRANSACTION_DEBIT = 'debit'
    TRANSACTION_WITHDRAWAL = 'withdrawal'
    TRANSACTION_RECHARGE = 'recharge'
    TRANSACTION_TRANSFER = 'transfer'

    TRANSACTION_TYPE_CHOICES = [
        (TRANSACTION_CREDIT, 'Credit'),
        (TRANSACTION_DEBIT, 'Debit'),
        (TRANSACTION_WITHDRAWAL, 'Withdrawal'),
        (TRANSACTION_RECHARGE, 'Recharge'),
        (TRANSACTION_TRANSFER, 'Transfer'),
    ]

    user = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='wallet_transactions')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=18, decimal_places=2)
    balance_after = models.DecimalField(max_digits=18, decimal_places=2)
    description = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Wallet Transaction"
        verbose_name_plural = "Wallet Transactions"
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user.user.username} - {self.transaction_type} - ₹{self.amount}"


class PaymentRequest(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_APPROVED = 'approved'
    STATUS_REJECTED = 'rejected'
    STATUS_COMPLETED = 'completed'
    STATUS_CANCELLED = 'cancelled'

    REQUEST_WITHDRAWAL = 'withdrawal'
    REQUEST_BANK = 'bank_transfer'
    REQUEST_UPI = 'upi_transfer'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_APPROVED, 'Approved'),
        (STATUS_REJECTED, 'Rejected'),
        (STATUS_COMPLETED, 'Completed'),
        (STATUS_CANCELLED, 'Cancelled'),
    ]

    REQUEST_TYPE_CHOICES = [
        (REQUEST_WITHDRAWAL, 'Withdrawal'),
        (REQUEST_BANK, 'Bank Transfer'),
        (REQUEST_UPI, 'UPI Transfer'),
    ]

    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='payment_requests')
    request_type = models.CharField(max_length=30, choices=REQUEST_TYPE_CHOICES, default=REQUEST_WITHDRAWAL)
    amount = models.DecimalField(max_digits=18, decimal_places=2)
    wallet_balance_before = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))

    bank_name = models.CharField(max_length=120, null=True, blank=True)
    account_number = models.CharField(max_length=40, null=True, blank=True)
    ifsc_code = models.CharField(max_length=20, null=True, blank=True)
    account_holder_name = models.CharField(max_length=120, null=True, blank=True)
    upi_id = models.CharField(max_length=120, null=True, blank=True)

    description = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    request_date = models.DateTimeField(auto_now_add=True)

    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True,
                                    on_delete=models.SET_NULL, related_name='approved_payment_requests')
    approval_date = models.DateTimeField(null=True, blank=True)
    admin_notes = models.TextField(null=True, blank=True)
    rejection_reason = models.TextField(null=True, blank=True)
    transaction_id = models.CharField(max_length=100, null=True, blank=True)
    completed_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Payment Request"
        verbose_name_plural = "Payment Requests"
        ordering = ['-request_date']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['request_date']),
            models.Index(fields=['member']),
        ]

    def __str__(self):
        return f"{self.member.user.username} - {self.request_type} - ₹{self.amount} ({self.status})"

    def save(self, *args, **kwargs):
        created = self._state.adding
        if created:
            self.wallet_balance_before = self.member.wallet_balance
        super().save(*args, **kwargs)

        # Automatic approval flow: When status set to approved, deduct from wallet and complete
        if self.status == self.STATUS_APPROVED:
            if self.member.wallet_balance < self.amount:
                raise ValueError("Insufficient wallet balance for approval.")
            with transaction.atomic():
                self.member.wallet_balance -= self.amount
                self.member.total_withdrawal += self.amount
                self.member.save(update_fields=['wallet_balance', 'total_withdrawal'])
                WalletTransaction.objects.create(
                    user=self.member,
                    transaction_type=self.TRANSACTION_WITHDRAWAL,
                    amount=self.amount,
                    balance_after=self.member.wallet_balance,
                    description=f"Approved payment request {self.pk}"
                )
                self.status = self.STATUS_COMPLETED
                self.completed_date = timezone.now()
                self.admin_notes = (self.admin_notes or "") + " | Auto-completed on approve."
                super().save(update_fields=['status', 'completed_date', 'admin_notes'])


# ---------------------------
# Helper service: matching update
# ---------------------------
def update_matching_income(member_plan):
    """
    Update matching pairs, rank, and matching income for each head member up the chain.
    This function mirrors your original logic but is cleaned for clarity.
    - member_plan: MemberPlan instance whose purchase triggered the update.
    """
    try:
        member = member_plan.member
        # traverse to immediate head (Member instance) via member.head_member (User) -> Member
        parent_user = member.head_member
        if not parent_user:
            return

        # iterate uplines until admin or None
        while parent_user:
            try:
                parent_member = Member.objects.get(user=parent_user)
            except Member.DoesNotExist:
                break

            # counts on left/right active members
            left_counts = parent_member.count_team_members('left')
            right_counts = parent_member.count_team_members('right')
            all_left_active = left_counts.get('active', 0)
            all_right_active = right_counts.get('active', 0)

            current_matching_pairs = min(all_left_active, all_right_active)
            new_pairs = current_matching_pairs - parent_member.all_matching_pairs

            if new_pairs > 0:
                last_plan = parent_member.plans.last()
                if not last_plan:
                    # if upline has no plan, use the purchased plan amount as fallback
                    base_matching_amount = Decimal(member_plan.plan.matching)
                else:
                    base_matching_amount = Decimal(last_plan.plan.matching)

                # credit matching income per new pair (original logic used absolute matching amount)
                total_matching_income = base_matching_amount * Decimal(new_pairs)

                parent_member.matching_income += total_matching_income
                parent_member.total_income += total_matching_income
                parent_member.today_income += total_matching_income
                parent_member.account_balance += total_matching_income
                parent_member.all_matching_pairs += new_pairs
                parent_member.matching_pairs += new_pairs
                parent_member.save(update_fields=[
                    'matching_income', 'total_income', 'today_income', 'account_balance',
                    'all_matching_pairs', 'matching_pairs'
                ])

                # log income history (one entry per credit)
                IncomeHistory.objects.create(
                    member=parent_member,
                    income_type=IncomeHistory.INCOME_MATCHING,
                    amount=total_matching_income,
                    description=f"Matching income for {new_pairs} new pair(s) from purchase by {member.user.username}"
                )

                # update rank if needed
                parent_member.update_rank_if_needed()

                # deduct from company wallet if available
                try:
                    company_wallet, _ = CompanyWallet.objects.get_or_create(pk=1)
                    # Attempt safe deduct (wrap in try to avoid hard failures)
                    try:
                        company_wallet.deduct_from_wallet(total_matching_income)
                    except Exception:
                        logger.exception("Company wallet deduction failed for matching income.")
                except Exception:
                    logger.exception("Company wallet get/create failed.")

            # move up
            if parent_member.head_member:
                parent_user = parent_member.head_member
                if getattr(parent_user, 'username', '').lower() == 'admin':
                    break
            else:
                break

    except Exception as e:
        logger.exception("Error in update_matching_income: %s", e)


