from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.post import Post, PostStatus

router = APIRouter(tags=["seo"])

SITE_URL = "https://chikablog.com"


@router.get("/sitemap.xml", response_class=Response)
def sitemap(db: Session = Depends(get_db)):
    posts = (
        db.query(Post)
        .filter(Post.status == PostStatus.PUBLISHED)
        .order_by(Post.published_at.desc())
        .all()
    )

    urls = []

    # Static pages
    urls.append(f"""  <url>
    <loc>{SITE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>""")

    urls.append(f"""  <url>
    <loc>{SITE_URL}/bio</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>""")

    # Dynamic post pages
    for post in posts:
        lastmod = post.updated_at.strftime("%Y-%m-%d")
        urls.append(f"""  <url>
    <loc>{SITE_URL}/post/{post.slug}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>""")

    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(urls)}
</urlset>"""

    return Response(content=xml, media_type="application/xml")
