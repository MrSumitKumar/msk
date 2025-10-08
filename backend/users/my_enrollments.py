from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from courses.models import Enrollment
from courses.serializers import EnrollmentSerializer

class MyEnrollmentsView(generics.ListAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(
            user=self.request.user
        ).select_related(
            'course'
        ).order_by('-enrolled_at')