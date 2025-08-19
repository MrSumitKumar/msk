# mlm/tests.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Member, Plan, MemberPlan, CompanyWallet
from .services import process_commissions_for_purchase
from decimal import Decimal

User = get_user_model()

class MLMBasicTests(TestCase):
    def setUp(self):
        CompanyWallet.objects.create(balance=Decimal('100000.00'))
        self.user_a = User.objects.create_user(username='a', password='pass')
        self.user_b = User.objects.create_user(username='b', password='pass')
        # ensure Member created via post_save signal
        self.member_a = Member.objects.get(user=self.user_a)
        self.member_b = Member.objects.get(user=self.user_b)
        # place member_b under member_a
        self.member_b.head_member = self.user_a
        self.member_b.sponsor = self.user_a
        self.member_b.save()

        self.plan = Plan.objects.create(name='Starter', price=Decimal('499.00'), direct=Decimal('50.00'), matching=Decimal('10.00'))

    def test_member_plan_purchase_commission_flow(self):
        mp = MemberPlan.objects.create(member=self.member_b, plan=self.plan, status=MemberPlan.STATUS_PENDING)
        mp.mark_completed()
        # After processing direct income, sponsor (member_a) should have direct income credited
        self.member_a.refresh_from_db()
        self.assertGreaterEqual(self.member_a.direct_income, Decimal('50.00'))
