from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import XMLResponse
from datetime import datetime
import xml.etree.ElementTree as ET
from typing import List, Dict, Optional

router = APIRouter(prefix="/api/seo", tags=["seo"])

# List of routes to include in sitemap
ROUTES = [
    {"path": "/", "priority": 1.0, "changefreq": "weekly"},
    {"path": "/offline-to-online", "priority": 0.9, "changefreq": "weekly"},
    {"path": "/hire", "priority": 0.9, "changefreq": "weekly"},
    {"path": "/hiring", "priority": 0.9, "changefreq": "weekly"},
    {"path": "/about-us", "priority": 0.8, "changefreq": "monthly"},
    {"path": "/contact", "priority": 0.8, "changefreq": "monthly"},
    {"path": "/blog", "priority": 0.9, "changefreq": "daily"},
    {"path": "/careers", "priority": 0.7, "changefreq": "monthly"},
    {"path": "/pricing", "priority": 0.9, "changefreq": "monthly"},
    {"path": "/faq", "priority": 0.8, "changefreq": "monthly"},
    {"path": "/docs", "priority": 0.8, "changefreq": "weekly"},
]

@router.get("/sitemap.xml", response_class=XMLResponse)
async def sitemap(request: Request) -> XMLResponse:
    """Generate a sitemap for the website."""
    root = ET.Element("urlset")
    root.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
    
    base_url = str(request.base_url).rstrip('/')
    
    # Add static routes
    for route in ROUTES:
        url = ET.SubElement(root, "url")
        loc = ET.SubElement(url, "loc")
        loc.text = f"{base_url}{route['path']}"
        
        lastmod = ET.SubElement(url, "lastmod")
        lastmod.text = datetime.now().strftime("%Y-%m-%d")
        
        changefreq = ET.SubElement(url, "changefreq")
        changefreq.text = route["changefreq"]
        
        priority = ET.SubElement(url, "priority")
        priority.text = str(route["priority"])
    
    # Convert XML to string
    xml_string = ET.tostring(root, encoding="utf-8", method="xml")
    return XMLResponse(content=xml_string, media_type="application/xml")

@router.get("/robots.txt")
async def robots(request: Request) -> str:
    """Generate a robots.txt file."""
    base_url = str(request.base_url).rstrip('/')
    
    return f"""User-agent: *
Allow: /
Sitemap: {base_url}/api/seo/sitemap.xml
"""

@router.get("/meta-tags")
async def get_meta_tags(path: str) -> Dict[str, str]:
    """Get meta tags for a specific page."""
    # Define default meta tags
    default_tags = {
        "title": "Genius Online Navigator - Transform Your Business Online",
        "description": "All-in-one platform to transform your offline business into a thriving online presence with AI-powered tools.",
        "keywords": "online business, digital transformation, AI marketing, SEO tools"
    }
    
    # Path-specific meta tags
    path_tags = {
        "/": {
            "title": "Genius Online Navigator - Your AI-Powered Business Transformation Platform",
            "description": "Transform your offline business with our comprehensive suite of AI tools, analytics, and marketing solutions.",
            "keywords": "AI business tools, digital transformation, online business strategy, marketing automation"
        },
        "/offline-to-online": {
            "title": "Transform Your Offline Business to Online - Genius Navigator",
            "description": "Complete toolkit to seamlessly transition your brick-and-mortar business to a profitable online presence.",
            "keywords": "offline to online, business transformation, digital transition, e-commerce setup"
        }
        # Add more paths as needed
    }
    
    # Return path-specific tags if available, otherwise default tags
    return path_tags.get(path, default_tags) 