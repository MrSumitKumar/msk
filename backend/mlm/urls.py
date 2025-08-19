# mlm/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PlanViewSet, MemberViewSet, MemberPlanViewSet, IncomeHistoryViewSet, WalletTransactionViewSet, PaymentRequestViewSet

router = DefaultRouter()
router.register(r'plans', PlanViewSet, basename='plan')
router.register(r'members', MemberViewSet, basename='member')
router.register(r'member-plans', MemberPlanViewSet, basename='memberplan')
router.register(r'income-history', IncomeHistoryViewSet, basename='incomehistory')
router.register(r'wallet-transactions', WalletTransactionViewSet, basename='wallettransaction')
router.register(r'payment-requests', PaymentRequestViewSet, basename='paymentrequest')

urlpatterns = [
    path('', include(router.urls)),
]
