# mlm/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Member, Plan, MemberPlan, IncomeHistory, WalletTransaction, PaymentRequest
from .serializers import (
    MemberSerializer, PlanSerializer, MemberPlanSerializer,
    IncomeHistorySerializer, WalletTransactionSerializer, PaymentRequestSerializer
)
from rest_framework.permissions import IsAuthenticated
from django.db import transaction

class PlanViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer
    permission_classes = []


class MemberViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Member.objects.select_related('user').all()
    serializer_class = MemberSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        member = get_object_or_404(Member, user=request.user)
        serializer = self.get_serializer(member)
        return Response(serializer.data)


class MemberPlanViewSet(viewsets.ModelViewSet):
    queryset = MemberPlan.objects.select_related('member', 'plan').all()
    serializer_class = MemberPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # users see their own plans, staff can see all
        if self.request.user.is_staff:
            return self.queryset
        member = get_object_or_404(Member, user=self.request.user)
        return self.queryset.filter(member=member)

    def perform_create(self, serializer):
        member = get_object_or_404(Member, user=self.request.user)
        serializer.save(member=member)

    @action(detail=True, methods=['post'])
    def mark_complete(self, request, pk=None):
        plan_obj = self.get_object()
        try:
            plan_obj.mark_completed()
            return Response({"detail": "Marked completed and processed."})
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class IncomeHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = IncomeHistory.objects.select_related('member', 'member__user').all()
    serializer_class = IncomeHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset
        member = get_object_or_404(Member, user=self.request.user)
        return self.queryset.filter(member=member)


class WalletTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = WalletTransaction.objects.select_related('user', 'user__user').all()
    serializer_class = WalletTransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset
        member = get_object_or_404(Member, user=self.request.user)
        return self.queryset.filter(user=member)


class PaymentRequestViewSet(viewsets.ModelViewSet):
    queryset = PaymentRequest.objects.select_related('member').all()
    serializer_class = PaymentRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset
        member = get_object_or_404(Member, user=self.request.user)
        return self.queryset.filter(member=member)

    def perform_create(self, serializer):
        member = get_object_or_404(Member, user=self.request.user)
        serializer.save(member=member)
