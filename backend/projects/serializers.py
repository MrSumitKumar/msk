from rest_framework import serializers
from .models import Category, Language, Project


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ["id", "name"]


class ProjectSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    languages = LanguageSerializer(many=True, read_only=True)
    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), many=True, write_only=True, source="categories"
    )
    language_ids = serializers.PrimaryKeyRelatedField(
        queryset=Language.objects.all(), many=True, write_only=True, source="languages"
    )

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "link",
            "level",
            "description",
            "estimated_time",
            "categories",
            "languages",
            "category_ids",
            "language_ids",
        ]
