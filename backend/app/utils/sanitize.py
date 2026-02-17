import bleach

ALLOWED_TAGS = [
    'p', 'br', 'strong', 'em', 'u', 's',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'a', 'img', 'hr',
    'div',
]

ALLOWED_ATTRIBUTES = {
    'a': ['href', 'title', 'target', 'rel'],
    'img': ['src', 'alt', 'title', 'width', 'height'],
    'div': ['data-image-carousel'],
}


def sanitize_html(html: str) -> str:
    """Sanitize HTML content using a whitelist approach."""
    if not html:
        return html
    return bleach.clean(
        html,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        strip=True,
    )
