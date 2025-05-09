#!/usr/bin/env python3
"""
Marketing RAG Initialization Script

This script initializes the Weaviate vector database with marketing knowledge documents
for use with the RAG-powered AI marketing agents.
"""

import os
import sys
import argparse
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

try:
    import weaviate
    from weaviate.auth import AuthApiKey
    from sentence_transformers import SentenceTransformer
except ImportError:
    logger.error("Required libraries not installed. Install with: pip install weaviate-client sentence-transformers")
    sys.exit(1)

def parse_args():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(description="Initialize Marketing RAG Knowledge Base")
    parser.add_argument("--data-path", type=str, required=True, help="Path to marketing documents directory")
    parser.add_argument("--weaviate-url", type=str, default="http://localhost:8080", help="Weaviate URL")
    parser.add_argument("--collection-name", type=str, default="MarketingKnowledge", help="Weaviate collection name")
    parser.add_argument("--api-key", type=str, default="", help="Weaviate API key (if required)")
    parser.add_argument("--embedding-model", type=str, default="all-MiniLM-L6-v2", help="SentenceTransformer model name")
    parser.add_argument("--clean", action="store_true", help="Delete existing collection before initialization")
    
    return parser.parse_args()

def get_weaviate_client(url: str, api_key: Optional[str] = None) -> weaviate.Client:
    """Get a Weaviate client instance"""
    auth_config = None
    if api_key:
        auth_config = AuthApiKey(api_key=api_key)
    
    try:
        client = weaviate.Client(
            url=url,
            auth_client_secret=auth_config
        )
        logger.info(f"Connected to Weaviate at {url}")
        return client
    except Exception as e:
        logger.error(f"Failed to connect to Weaviate: {str(e)}")
        raise

def create_schema(client: weaviate.Client, collection_name: str) -> None:
    """Create the schema for the marketing knowledge collection"""
    # Check if collection exists
    if client.schema.exists(collection_name):
        logger.info(f"Collection {collection_name} already exists")
        return
    
    # Define collection properties
    properties = [
        {
            "name": "title",
            "dataType": ["text"],
            "description": "Title of the marketing document",
        },
        {
            "name": "content",
            "dataType": ["text"],
            "description": "Main content of the marketing document",
        },
        {
            "name": "source",
            "dataType": ["text"],
            "description": "Source of the document (filename, URL, etc.)",
        },
        {
            "name": "category",
            "dataType": ["text"],
            "description": "Category of the marketing document",
        },
        {
            "name": "tags",
            "dataType": ["text[]"],
            "description": "Tags associated with the document",
        },
        {
            "name": "created_at",
            "dataType": ["date"],
            "description": "When the document was created",
        },
    ]
    
    # Create the class
    client.schema.create_class({
        "class": collection_name,
        "description": "Marketing knowledge documents for RAG",
        "vectorizer": "text2vec-transformers",
        "properties": properties
    })
    
    logger.info(f"Created schema for collection {collection_name}")

def clean_collection(client: weaviate.Client, collection_name: str) -> None:
    """Delete existing collection to start fresh"""
    if client.schema.exists(collection_name):
        client.schema.delete_class(collection_name)
        logger.info(f"Deleted existing collection {collection_name}")

def read_document(file_path: str) -> Dict[str, Any]:
    """Read a document file and extract its metadata"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract filename and extension
        filename = os.path.basename(file_path)
        file_ext = os.path.splitext(filename)[1].lower()
        
        # Default metadata
        document = {
            "title": filename,
            "content": content,
            "source": file_path,
            "category": "general",
            "tags": [],
            "created_at": datetime.now().isoformat()
        }
        
        # Extract metadata from content if available
        if file_ext == '.md':
            # Try to extract title from first heading
            lines = content.split('\n')
            for line in lines:
                if line.startswith('# '):
                    document["title"] = line[2:].strip()
                    break
                
            # Try to extract tags from frontmatter if available
            if content.startswith('---'):
                end_idx = content.find('---', 3)
                if end_idx != -1:
                    frontmatter = content[3:end_idx].strip()
                    for line in frontmatter.split('\n'):
                        if ':' in line:
                            key, value = line.split(':', 1)
                            key = key.strip().lower()
                            value = value.strip()
                            
                            if key == 'title':
                                document["title"] = value
                            elif key == 'category':
                                document["category"] = value
                            elif key == 'tags' and value:
                                if value.startswith('[') and value.endswith(']'):
                                    # Parse JSON array
                                    try:
                                        document["tags"] = json.loads(value)
                                    except:
                                        document["tags"] = [tag.strip() for tag in value[1:-1].split(',')]
                                else:
                                    document["tags"] = [tag.strip() for tag in value.split(',')]
                            elif key == 'date':
                                document["created_at"] = value
        
        # Use file directory as category if not specified
        if document["category"] == "general":
            parent_dir = os.path.basename(os.path.dirname(file_path))
            if parent_dir and parent_dir != '.':
                document["category"] = parent_dir
        
        return document
    
    except Exception as e:
        logger.error(f"Error reading document {file_path}: {str(e)}")
        return None

def load_documents(data_path: str) -> List[Dict[str, Any]]:
    """Load all marketing documents from the data path"""
    documents = []
    
    # Get list of text files
    extensions = ['.txt', '.md', '.json', '.csv']
    
    for ext in extensions:
        for file_path in Path(data_path).rglob(f'*{ext}'):
            doc = read_document(str(file_path))
            if doc:
                documents.append(doc)
    
    logger.info(f"Loaded {len(documents)} documents from {data_path}")
    return documents

def import_documents(client: weaviate.Client, collection_name: str, documents: List[Dict[str, Any]]) -> None:
    """Import documents into Weaviate"""
    batch_size = 50
    with client.batch as batch:
        batch.batch_size = batch_size
        
        for i, doc in enumerate(documents):
            # Create data object
            properties = {
                "title": doc["title"],
                "content": doc["content"],
                "source": doc["source"],
                "category": doc["category"],
                "tags": doc["tags"],
                "created_at": doc["created_at"]
            }
            
            # Add to batch
            batch.add_data_object(
                properties,
                collection_name,
                uuid=None  # Let Weaviate generate UUID
            )
            
            # Log progress
            if (i + 1) % batch_size == 0 or i == len(documents) - 1:
                logger.info(f"Imported {i + 1}/{len(documents)} documents")
    
    logger.info(f"Successfully imported {len(documents)} documents into {collection_name}")

def create_example_documents(data_path: str) -> None:
    """Create example marketing documents if the directory is empty"""
    if list(Path(data_path).glob('*.*')):
        logger.info(f"Skipping example document creation - directory not empty")
        return
    
    logger.info(f"Creating example marketing documents in {data_path}")
    
    # Create subdirectories
    os.makedirs(os.path.join(data_path, "seo"), exist_ok=True)
    os.makedirs(os.path.join(data_path, "social_media"), exist_ok=True)
    os.makedirs(os.path.join(data_path, "email"), exist_ok=True)
    os.makedirs(os.path.join(data_path, "ppc"), exist_ok=True)
    
    # SEO example
    with open(os.path.join(data_path, "seo", "seo_best_practices.md"), 'w', encoding='utf-8') as f:
        f.write("""---
title: SEO Best Practices 2023
category: seo
tags: [on-page-seo, technical-seo, content-strategy]
date: 2023-01-15
---

# SEO Best Practices for 2023

## On-Page SEO Factors

1. **Title Tags**: Keep under 60 characters, include primary keyword near the beginning.
2. **Meta Descriptions**: Keep under 160 characters, include call-to-action and keywords.
3. **Heading Structure**: Use proper H1-H6 hierarchy with keywords in headings.
4. **Content Quality**: Create comprehensive, well-researched content that answers user intent.
5. **Keyword Usage**: Include primary and secondary keywords naturally throughout content.
6. **URL Structure**: Keep URLs short, descriptive, and include target keywords.

## Technical SEO

1. **Site Speed**: Aim for page load times under 2 seconds.
2. **Mobile Optimization**: Ensure fully responsive design and mobile-friendly experience.
3. **Schema Markup**: Implement appropriate schema.org markup for rich results.
4. **XML Sitemap**: Maintain updated XML sitemap submitted to search engines.
5. **Core Web Vitals**: Optimize LCP, FID, and CLS metrics for better user experience.

## Link Building Strategies

1. **Quality Guest Posts**: Contribute high-quality content to authoritative sites.
2. **Resource Link Building**: Create linkable assets like research reports and infographics.
3. **Broken Link Building**: Find and replace broken links on other websites.
4. **HARO Responses**: Respond to journalist queries for potential media mentions.
""")
    
    # Social media example
    with open(os.path.join(data_path, "social_media", "platform_best_times.md"), 'w', encoding='utf-8') as f:
        f.write("""---
title: Best Times to Post on Social Media Platforms
category: social_media
tags: [timing, engagement, platforms]
date: 2023-02-22
---

# Best Times to Post on Social Media Platforms

## Instagram
- **Best Days**: Wednesday, Thursday, and Friday
- **Best Times**: 10am-12pm, 7pm-9pm
- **Worst Day**: Sunday
- **Post Frequency**: 3-5 times per week

## Facebook
- **Best Days**: Tuesday, Wednesday, and Thursday
- **Best Times**: 8am-12pm, 1pm-3pm
- **Worst Day**: Saturday
- **Post Frequency**: 1-2 times per day

## Twitter
- **Best Days**: Monday, Wednesday, and Friday
- **Best Times**: 8am-10am, 3pm-4pm
- **Worst Day**: Saturday
- **Post Frequency**: 3-5 times per day

## LinkedIn
- **Best Days**: Tuesday, Wednesday, and Thursday
- **Best Times**: 9am-11am, 1pm-2pm
- **Worst Day**: Weekend
- **Post Frequency**: 2-5 times per week

## TikTok
- **Best Days**: Tuesday, Thursday, and Friday
- **Best Times**: 7pm-9pm, 10pm-12am
- **Worst Day**: Monday
- **Post Frequency**: 1-3 times per day

## Pinterest
- **Best Days**: Saturday, Sunday
- **Best Times**: 8pm-11pm
- **Worst Day**: Weekdays
- **Post Frequency**: 3-5 times per day
""")
    
    # Email marketing example
    with open(os.path.join(data_path, "email", "subject_line_formulas.md"), 'w', encoding='utf-8') as f:
        f.write("""---
title: Effective Email Subject Line Formulas
category: email
tags: [subject-lines, open-rates, email-marketing]
date: 2023-03-10
---

# Effective Email Subject Line Formulas

## Curiosity-Based Subject Lines
- "The Unexpected Reason Why [Topic] Is [Result]"
- "What Nobody Tells You About [Topic]"
- "I Was Shocked When I Discovered [Fact]"
- "[Number] Secrets About [Topic] You Need to Know"

## Urgency/Scarcity Subject Lines
- "Last Chance: [Offer] Ends Tonight"
- "Only [Number] Spots Left for [Event/Offer]"
- "[Time] Left to Claim Your [Benefit]"
- "Don't Miss Out on [Benefit]"

## Value Proposition Subject Lines
- "How to [Achieve Benefit] in [Timeframe]"
- "[Number] Ways to [Solve Problem]"
- "Get [Benefit] Without [Common Pain Point]"
- "[Do Something] Like [Expert/Authority]"

## Personalized Subject Lines
- "[Name], I Thought You'd Like This [Topic]"
- "We Made This [Product/Content] Just for You"
- "Based on Your Interest in [Topic]..."
- "Because You Purchased [Product]..."

## Question-Based Subject Lines
- "Are You Making These [Topic] Mistakes?"
- "Do You Know the [Number] Signs of [Problem]?"
- "Is Your [Process/Item] Missing This Key Element?"
- "Ready to [Achieve Desired Outcome]?"

## Tips for Subject Line Testing:
1. Test one variable at a time
2. Use meaningful sample sizes (at least 1,000 recipients per variation)
3. Measure both open rates AND click-through rates
4. Test at different times/days for your audience
""")
    
    # PPC example
    with open(os.path.join(data_path, "ppc", "ad_copy_techniques.md"), 'w', encoding='utf-8') as f:
        f.write("""---
title: PPC Ad Copy Techniques That Convert
category: ppc
tags: [ad-copy, google-ads, conversions]
date: 2023-04-05
---

# PPC Ad Copy Techniques That Convert

## Headlines That Grab Attention
1. **Use Numbers and Statistics**: "Increase Conversions by 27% in 30 Days"
2. **Ask Questions**: "Struggling with [Problem]? Our Solution Works"
3. **Address Pain Points**: "Eliminate [Pain Point] Forever with [Product]"
4. **Make Bold Claims**: "The Most Effective [Product] on the Market"
5. **Include Prices/Discounts**: "Professional [Service] Starting at $X"

## Description Copy Best Practices
1. **Focus on Benefits, Not Features**: Explain how your product/service improves customers' lives
2. **Create Urgency**: Use "limited time," "ending soon," or specific deadlines
3. **Add Social Proof**: Mention customer counts, reviews, or testimonials
4. **Include Clear CTAs**: Tell users exactly what action to take
5. **Highlight USPs**: Explain what makes you different from competitors

## Extensions to Improve Performance
1. **Sitelink Extensions**: Add 4-6 relevant deep links to important pages
2. **Callout Extensions**: Highlight key benefits or offers (free shipping, 24/7 support)
3. **Structured Snippets**: List specific features, services, or catalog items
4. **Price Extensions**: Display products/services with prices for comparison
5. **Lead Form Extensions**: Collect leads directly from your ad

## A/B Testing Framework
1. Test one element at a time (headline, description, extensions)
2. Run tests for at least 1-2 weeks or 100+ clicks
3. Monitor CTR, conversion rate, and quality score
4. Implement winners and test new variations continuously
""")
    
    logger.info("Created 4 example marketing documents")

def main():
    """Main function"""
    args = parse_args()
    
    # Create example documents if needed
    create_example_documents(args.data_path)
    
    # Get Weaviate client
    client = get_weaviate_client(args.weaviate_url, args.api_key)
    
    # Clean existing collection if requested
    if args.clean:
        clean_collection(client, args.collection_name)
    
    # Create schema
    create_schema(client, args.collection_name)
    
    # Load documents
    documents = load_documents(args.data_path)
    
    # Import documents
    import_documents(client, args.collection_name, documents)
    
    logger.info("Marketing RAG knowledge base initialization complete!")
    logger.info(f"Imported {len(documents)} documents into collection {args.collection_name}")

if __name__ == "__main__":
    main()