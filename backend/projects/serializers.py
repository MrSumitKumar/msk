from rest_framework import serializers
from .models import Category, ProgrammingLanguage, Project, Level

class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ["id", "name"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgrammingLanguage
        fields = ["id", "name"]


class ProjectSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    languages = LanguageSerializer(many=True, read_only=True)
    level = LevelSerializer(read_only=True)

    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), many=True, write_only=True, source="categories"
    )
    language_ids = serializers.PrimaryKeyRelatedField(
        queryset=ProgrammingLanguage.objects.all(), many=True, write_only=True, source="languages"
    )
    level_id = serializers.PrimaryKeyRelatedField(
        queryset=Level.objects.all(), write_only=True, source="level"
    )


    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "link",
            "level",
            "description",
            "categories",
            "languages",
            "category_ids",
            "language_ids",
        ]
