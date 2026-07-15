from django.db import models
from django.utils.text import slugify


class SiteConfiguration(models.Model):
    site_name = models.CharField(max_length=255, default="MyNiche")
    site_description = models.TextField(blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=50, blank=True)
    favicon_url = models.URLField(blank=True)
    seo_title = models.CharField(max_length=255, blank=True)
    seo_description = models.TextField(blank=True)
    seo_keywords = models.CharField(max_length=500, blank=True)
    open_graph_image = models.URLField(blank=True)
    canonical_url = models.URLField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site Configuration"
        verbose_name_plural = "Site Configuration"

    def __str__(self):
        return self.site_name

    class Meta:
        ordering = ["-updated_at"]
        verbose_name = "Site Configuration"
        verbose_name_plural = "Site Configuration"


class SiteContent(models.Model):
    class ContentType(models.TextChoices):
        PAGE = ("page", "Page")
        RESOURCE = ("resource", "Resource")
        HERO = ("hero", "Hero")
        FAQ = ("faq", "FAQ")
        CTA = ("cta", "Call to Action")

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    content_type = models.CharField(
        max_length=20,
        choices=ContentType.choices,
        default=ContentType.PAGE,
    )
    summary = models.TextField(blank=True)
    body = models.TextField(blank=True)
    payload = models.JSONField(default=dict, blank=True)
    is_published = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "title"]
        verbose_name = "Site Content"
        verbose_name_plural = "Site Content"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
