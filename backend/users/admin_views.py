# users/admin_views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta
from django.db import models
from .models import CustomUser
from .serializers import UserSerializer
from courses.models import Course, Enrollment
from mlm.models import WalletTransaction, PaymentRequest, Member
from .serializers import UserSerializer
import csv
from django.http import HttpResponse
from .serializers import UserSerializer
from django.shortcuts import get_object_or_404

class AdminDashboardStatsView(generics.RetrieveAPIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        # Get current date and start of month
        now = timezone.now()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        # Calculate statistics
        total_students = CustomUser.objects.filter(role=CustomUser.Role.STUDENT).count()
        total_teachers = CustomUser.objects.filter(role=CustomUser.Role.TEACHER).count()
        total_courses = Course.objects.count()
        active_enrollments = Enrollment.objects.filter(status='active').count()
        
        # Revenue calculations from wallet transactions and payment requests
        revenue_this_month = WalletTransaction.objects.filter(
            timestamp__gte=month_start,
            transaction_type__in=['credit', 'recharge']
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # Add completed payment requests
        completed_payments = PaymentRequest.objects.filter(
            completed_date__gte=month_start,
            status='completed'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        revenue_this_month += completed_payments

        pending_approvals = (
            CustomUser.objects.filter(is_approved=False).count() +
            Course.objects.filter(is_approved=False).count()
        )

        completion_rate = Enrollment.objects.filter(
            status='completed'
        ).count() / Enrollment.objects.count() * 100 if Enrollment.objects.exists() else 0

        return Response({
            'totalStudents': total_students,
            'totalTeachers': total_teachers,
            'totalCourses': total_courses,
            'activeEnrollments': active_enrollments,
            'revenueThisMonth': revenue_this_month,
            'pendingApprovals': pending_approvals,
            'completionRate': round(completion_rate, 2),
            'totalRevenue': (WalletTransaction.objects.filter(
                transaction_type__in=['credit', 'recharge']
            ).aggregate(total=Sum('amount'))['total'] or 0) + (
                PaymentRequest.objects.filter(
                    status='completed'
                ).aggregate(total=Sum('amount'))['total'] or 0
            )
        })

class AdminRecentActivitiesView(generics.ListAPIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        # Get activities from the last 30 days
        thirty_days_ago = timezone.now() - timedelta(days=30)
        
        # Combine recent activities from different models
        activities = []
        
        # New user registrations
        new_users = CustomUser.objects.filter(date_joined__gte=thirty_days_ago)
        for user in new_users:
            activities.append({
                'id': f'user_{user.id}',
                'type': 'registration',
                'description': f'New user registered: {user.email}',
                'timestamp': user.date_joined
            })
        
        # New course creations
        new_courses = Course.objects.filter(created_at__gte=thirty_days_ago)
        for course in new_courses:
            activities.append({
                'id': f'course_{course.id}',
                'type': 'course_creation',
                'description': f'New course created: {course.title}',
                'timestamp': course.created_at
            })
        
        # Sort activities by timestamp
        activities.sort(key=lambda x: x['timestamp'], reverse=True)
        return Response(activities[:20])  # Return last 20 activities

class AdminPendingApprovalsView(generics.ListAPIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        # Get pending approvals from different models
        pending_users = CustomUser.objects.filter(is_approved=False)
        pending_courses = Course.objects.filter(is_approved=False)
        
        approvals = []
        
        # Add pending user approvals
        for user in pending_users:
            approvals.append({
                'id': f'user_{user.id}',
                'type': 'teacher' if user.role == CustomUser.Role.TEACHER else 'student',
                'title': f'Teacher Application: {user.email}',
                'description': f'New teacher registration pending approval',
                'created_at': user.date_joined
            })
        
        # Add pending course approvals
        for course in pending_courses:
            approvals.append({
                'id': f'course_{course.id}',
                'type': 'course',
                'title': f'Course: {course.title}',
                'description': f'New course pending approval',
                'created_at': course.created_at
            })
        
        # Sort by creation date
        approvals.sort(key=lambda x: x['created_at'], reverse=True)
        return Response(approvals)

class AdminNotificationsView(generics.ListAPIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        # Get recent notifications (last 7 days)
        seven_days_ago = timezone.now() - timedelta(days=7)
        
        notifications = []
        
        # Add system notifications
        urgent_approvals = CustomUser.objects.filter(
            is_approved=False,
            date_joined__gte=seven_days_ago
        ).count()
        
        if urgent_approvals > 0:
            notifications.append({
                'id': 'sys_1',
                'type': 'approval',
                'message': f'{urgent_approvals} new teacher applications pending approval',
                'created_at': timezone.now()
            })
        
        # Add course notifications
        new_courses = Course.objects.filter(
            created_at__gte=seven_days_ago,
            is_approved=False
        ).count()
        
        if new_courses > 0:
            notifications.append({
                'id': 'sys_2',
                'type': 'course',
                'message': f'{new_courses} new courses pending review',
                'created_at': timezone.now()
            })
        
        return Response(notifications)

class AdminApproveRequestView(generics.UpdateAPIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk, *args, **kwargs):
        request_type, id = pk.split('_')
        status = request.data.get('status')
        
        if request_type == 'user':
            user = CustomUser.objects.get(pk=id)
            user.is_approved = status == 'approved'
            user.save()
        elif request_type == 'course':
            course = Course.objects.get(pk=id)
            course.is_approved = status == 'approved'
            course.save()
        
        return Response({'status': 'success'})

class AdminExportDataView(generics.RetrieveAPIView):
    permission_classes = [IsAdminUser]

    def get(self, request, data_type, *args, **kwargs):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{data_type}_export.csv"'
        
        writer = csv.writer(response)
        
        if data_type == 'users':
            # Export users data
            writer.writerow(['ID', 'Email', 'Role', 'Date Joined', 'Status'])
            users = CustomUser.objects.all()
            for user in users:
                writer.writerow([
                    user.id,
                    user.email,
                    user.role,
                    user.date_joined,
                    'Approved' if user.is_approved else 'Pending'
                ])
        
        elif data_type == 'courses':
            # Export courses data
            writer.writerow(['ID', 'Title', 'Teacher', 'Students', 'Status'])
            courses = Course.objects.all()
            for course in courses:
                writer.writerow([
                    course.id,
                    course.title,
                    course.teacher.email,
                    course.enrolled_students.count(),
                    'Approved' if course.is_approved else 'Pending'
                ])
        
        return response

class AdminUserManagementView(generics.ListCreateAPIView):
    permission_classes = [IsAdminUser]
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        pk = self.kwargs.get('pk')
        if pk:
            return get_object_or_404(CustomUser, pk=pk)
        return None

    def get_queryset(self):
        queryset = CustomUser.objects.all()
        
        # Role filtering
        role = self.request.query_params.get('role', None)
        if role and role != 'all':
            queryset = queryset.filter(role=role)
        
        # Status filtering
        status = self.request.query_params.get('status', None)
        print(f"Status filter: {status}")
        if status and status != 'all':
            queryset = queryset.filter(status=status)
            print(f"Filtered queryset count: {queryset.count()}")
        
        # Search functionality
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(phone__icontains=search)
            )
        
        print(f"Final queryset count: {queryset.count()}")
        
        # Search functionality
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                models.Q(username__icontains=search) |
                models.Q(email__icontains=search) |
                models.Q(first_name__icontains=search) |
                models.Q(last_name__icontains=search) |
                models.Q(phone__icontains=search)
            )
        
        # Sorting
        ordering = self.request.query_params.get('ordering', '-date_joined')
        if ordering.startswith('-'):
            field = ordering[1:]
        else:
            field = ordering
            
        if hasattr(CustomUser, field):
            queryset = queryset.order_by(ordering)
        
        return queryset

    def patch(self, request, *args, **kwargs):
        user_id = kwargs.get('pk')
        if user_id:
            try:
                user = CustomUser.objects.get(pk=user_id)
                serializer = self.get_serializer(user, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                return Response(serializer.errors, status=400)
            except CustomUser.DoesNotExist:
                return Response({'error': 'User not found'}, status=404)
        return Response({'error': 'User ID required'}, status=400)

    def delete(self, request, *args, **kwargs):
        user_id = kwargs.get('pk')
        if user_id:
            try:
                user = CustomUser.objects.get(pk=user_id)
                user.delete()
                return Response(status=204)
            except CustomUser.DoesNotExist:
                return Response({'error': 'User not found'}, status=404)
        return Response({'error': 'User ID required'}, status=400)

class AdminBulkActionView(generics.GenericAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = UserSerializer
    
    def post(self, request, *args, **kwargs):
        action = request.data.get('action')
        user_ids = request.data.get('user_ids', [])
        
        if not action or not user_ids:
            return Response({'error': 'Action and user_ids are required'}, status=400)
            
        users = CustomUser.objects.filter(id__in=user_ids)
        
        if not users.exists():
            return Response({'error': 'No users found'}, status=404)
            
        try:
            if action == 'approve':
                users.update(is_approved=True, status=CustomUser.Status.ACTIVE)
            elif action == 'deactivate':
                users.update(status=CustomUser.Status.INACTIVE)
            elif action == 'delete':
                users.delete()
            else:
                return Response({'error': 'Invalid action'}, status=400)
                
            return Response({'message': f'Bulk {action} completed successfully'})
        except Exception as e:
            return Response({'error': str(e)}, status=400)
