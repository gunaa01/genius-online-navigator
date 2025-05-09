"""SEO Analyst Agent tools for AgentForge OSS
This module provides RAG-enhanced SEO analysis tools using LlamaIndex and Weaviate.
"""

from typing import Dict, List, Any, Optional, Union
import logging
import json
import asyncio
import re
from datetime import datetime

try:
    from llama_index import VectorStoreIndex, SimpleDirectoryReader, ServiceContext, StorageContext
    from llama_index.vector_stores import WeaviateVectorStore
    from llama_index.schema import Document
except ImportError:
    logging.warning("LlamaIndex not installed. Install with: pip install llama-index")

from ...core.marketing_types import RAGConfig, SEOConfig, SEOContentTypes

logger = logging.getLogger(__name__)

class SEOAnalystToolset:
    """SEO Analyst toolset using RAG and LlamaIndex"""
    
    def __init__(self, config: SEOConfig, rag_config: RAGConfig):
        """Initialize the SEO Analyst toolset with configuration"""
        self.config = config
        self.rag_config = rag_config
        self.tools = self._register_tools()
        self.vector_store = None
        self.index = None
        self.weaviate_client = None
        logger.info(f"SEO Analyst toolset initialized with {len(self.tools)} tools")
    
    def _register_tools(self) -> Dict[str, Any]:
        """Register all SEO Analyst tools"""
        return {
            "analyze_keyword_opportunities": self.analyze_keyword_opportunities,
            "grade_content_seo": self.grade_content_seo,
            "generate_content_recommendations": self.generate_content_recommendations,
            "analyze_competitor_content": self.analyze_competitor_content,
            "find_backlink_opportunities": self.find_backlink_opportunities,
        }
    
    async def _initialize_vector_store(self):
        """Initialize the vector store using Weaviate"""
        if self.vector_store is not None:
            return self.vector_store
        
        try:
            import weaviate
            from weaviate.auth import AuthApiKey
            
            # Initialize Weaviate client
            auth_config = AuthApiKey(api_key=self.rag_config.extra_params.get("api_key", ""))
            self.weaviate_client = weaviate.Client(
                url=self.rag_config.connection_string,
                auth_client_secret=auth_config if self.rag_config.extra_params.get("api_key") else None,
                additional_headers=self.rag_config.extra_params.get("headers", {})
            )
            
            # Create vector store
            self.vector_store = WeaviateVectorStore(
                weaviate_client=self.weaviate_client,
                index_name=self.rag_config.collection_name,
                text_key="content"
            )
            
            # Create storage context
            storage_context = StorageContext.from_defaults(
                vector_store=self.vector_store
            )
            
            # Create service context using Ollama model
            from llama_index.llms import Ollama
            
            # Use the specified model from config, or default to Mistral
            model_name = self.config.model_name or "mistral"
            
            # Initialize LLM
            llm = Ollama(model=model_name)
            
            # Create service context
            service_context = ServiceContext.from_defaults(
                llm=llm,
                embed_model=self.rag_config.embedding_model
            )
            
            # Create empty index if needed
            if not self.vector_store.index_exists():
                self.index = VectorStoreIndex.from_documents(
                    [],
                    storage_context=storage_context,
                    service_context=service_context
                )
            else:
                # Load existing index
                self.index = VectorStoreIndex(
                    storage_context=storage_context,
                    service_context=service_context
                )
            
            logger.info(f"Initialized vector store and index with model {model_name}")
            return self.vector_store
        except Exception as e:
            logger.error(f"Error initializing vector store: {str(e)}")
            raise
    
    async def _add_documents_to_index(self, documents: List[Dict[str, Any]]):
        """Add documents to the vector index"""
        try:
            # Initialize vector store if needed
            await self._initialize_vector_store()
            
            # Convert to LlamaIndex documents
            llama_docs = []
            for doc in documents:
                metadata = {
                    "source": doc.get("source", ""),
                    "url": doc.get("url", ""),
                    "title": doc.get("title", ""),
                    "content_type": doc.get("content_type", SEOContentTypes.BLOG_POST.value),
                    "keywords": doc.get("keywords", []),
                    "created_at": doc.get("created_at", datetime.now().isoformat()),
                }
                
                llama_doc = Document(
                    text=doc.get("content", ""),
                    metadata=metadata
                )
                llama_docs.append(llama_doc)
            
            # Insert documents into index
            self.index.insert_nodes(llama_docs)
            
            logger.info(f"Added {len(llama_docs)} documents to index")
            return {"success": True, "count": len(llama_docs)}
        except Exception as e:
            logger.error(f"Error adding documents to index: {str(e)}")
            return {"success": False, "error": str(e)}
    
    async def analyze_keyword_opportunities(self, 
                                          target_keywords: List[str], 
                                          competitor_urls: Optional[List[str]] = None) -> Dict[str, Any]:
        """Analyze keyword opportunities using RAG"""
        logger.info(f"Analyzing keyword opportunities for: {target_keywords}")
        
        try:
            # Initialize vector store
            await self._initialize_vector_store()
            
            # Create query engine
            query_engine = self.index.as_query_engine()
            
            # Analyze each keyword
            keyword_analysis = {}
            for keyword in target_keywords:
                # Query similar content
                query = f"Analyze SEO opportunity for keyword: {keyword}. What content already exists and what gaps can be filled?"
                response = query_engine.query(query)
                
                # Extract keyword difficulty if available in RAG
                difficulty_match = re.search(r"difficulty:?\s*(\d+(?:\.\d+)?)", response.response, re.IGNORECASE)
                difficulty = float(difficulty_match.group(1)) if difficulty_match else None
                
                # Extract search volume if available in RAG
                volume_match = re.search(r"volume:?\s*(\d+(?:,\d+)?)", response.response, re.IGNORECASE)
                volume = int(volume_match.group(1).replace(',', '')) if volume_match else None
                
                # Extract competitive landscape
                competitors = []
                for url in competitor_urls or []:
                    if url.lower() in response.response.lower():
                        competitors.append(url)
                
                # Create structured analysis
                keyword_analysis[keyword] = {
                    "difficulty": difficulty,
                    "search_volume": volume,
                    "competitors": competitors,
                    "content_gaps": self._extract_section(response.response, "gap", 300),
                    "opportunity_score": await self._calculate_opportunity_score(keyword, difficulty, volume),
                    "recommended_topics": await self._generate_topic_ideas(keyword),
                }
            
            return {
                "success": True,
                "keyword_analysis": keyword_analysis,
                "total_keywords_analyzed": len(keyword_analysis),
            }
        except Exception as e:
            logger.error(f"Error analyzing keyword opportunities: {str(e)}")
            return {"error": f"Failed to analyze keyword opportunities: {str(e)}"}
    
    async def _calculate_opportunity_score(self, keyword: str, difficulty: Optional[float], 
                                          volume: Optional[int]) -> float:
        """Calculate opportunity score based on difficulty and volume"""
        # Default values if not available
        if difficulty is None:
            difficulty = 50.0  # Medium difficulty
        if volume is None:
            volume = 1000  # Medium volume
        
        # Normalize volume (0-100 scale)
        volume_score = min(100, volume / 100)
        
        # Invert difficulty (lower is better)
        difficulty_score = 100 - difficulty
        
        # Calculate opportunity score (higher is better)
        # 60% volume, 40% difficulty
        return (volume_score * 0.6) + (difficulty_score * 0.4)
    
    async def _generate_topic_ideas(self, keyword: str) -> List[str]:
        """Generate topic ideas for a keyword using the LLM"""
        try:
            from llama_index.llms import Ollama
            
            # Use the specified model from config, or default to Mistral
            model_name = self.config.model_name or "mistral"
            
            # Initialize LLM
            llm = Ollama(model=model_name)
            
            # Generate topic ideas
            prompt = f"""Generate 5 compelling content topic ideas for the keyword: "{keyword}".
            
            For each topic:
            1. Make it specific and actionable
            2. Include a clear value proposition
            3. Target the search intent behind the keyword
            
            Format each topic as a bullet point.
            """
            
            response = await llm.acomplete(prompt)
            
            # Extract bullet points
            topics = []
            for line in response.text.split("\n"):
                if line.strip().startswith("- ") or line.strip().startswith("* "):
                    topics.append(line.strip()[2:].strip())
            
            return topics[:5]  # Return at most 5 topics
        except Exception as e:
            logger.error(f"Error generating topic ideas: {str(e)}")
            return [f"Topic idea for {keyword} (error generating more ideas)"]
    
    def _extract_section(self, text: str, keyword: str, max_length: int = 200) -> str:
        """Extract a section of text around a keyword"""
        keyword_idx = text.lower().find(keyword.lower())
        if keyword_idx == -1:
            return ""
        
        # Get some context before and after the keyword
        start_idx = max(0, keyword_idx - 50)
        end_idx = min(len(text), keyword_idx + max_length)
        
        # Try to find sentence boundaries
        if start_idx > 0:
            sentence_start = text.rfind(".", 0, keyword_idx)
            if sentence_start != -1:
                start_idx = sentence_start + 1
        
        if end_idx < len(text):
            sentence_end = text.find(".", keyword_idx)
            if sentence_end != -1:
                end_idx = sentence_end + 1
        
        return text[start_idx:end_idx].strip()
    
    async def grade_content_seo(self, 
                              content: str, 
                              target_keyword: str,
                              content_type: SEOContentTypes = SEOContentTypes.BLOG_POST) -> Dict[str, Any]:
        """Grade content for SEO optimization"""
        logger.info(f"Grading content SEO for keyword: {target_keyword}")
        
        try:
            # Initialize vector store if needed
            await self._initialize_vector_store()
            
            # Create analysis prompt
            analysis_prompt = f"""Analyze and grade this content for SEO optimization for the target keyword: "{target_keyword}".
            
            Content Type: {content_type.value}
            
            Content:
            {content[:2000]}... [truncated for analysis]
            
            Provide a detailed analysis including:
            1. Keyword usage analysis (density, placement, etc.)
            2. Content structure analysis (headings, paragraphs, etc.)
            3. Readability analysis
            4. Entity coverage analysis
            5. Overall SEO score (0-100)
            
            Format the response with clear sections and provide actionable recommendations.
            """
            
            # Get LLM
            from llama_index.llms import Ollama
            llm = Ollama(model=self.config.model_name or "mistral")
            
            # Generate analysis
            response = await llm.acomplete(analysis_prompt)
            analysis = response.text
            
            # Extract score
            score_match = re.search(r"score:?\s*(\d+(?:\.\d+)?)", analysis, re.IGNORECASE)
            score = float(score_match.group(1)) if score_match else 65.0  # Default to average if not found
            
            # Extract recommendations
            recommendations = []
            recs_section = self._extract_section(analysis, "recommendation", 500)
            for line in recs_section.split("\n"):
                line = line.strip()
                if line and (line.startswith("-") or line.startswith("*") or re.match(r"^\d+\.", line)):
                    recommendations.append(line.lstrip("- *1234567890.").strip())
            
            # Check keyword density
            keyword_count = content.lower().count(target_keyword.lower())
            word_count = len(content.split())
            keyword_density = (keyword_count * len(target_keyword.split())) / word_count if word_count > 0 else 0
            
            # Analyze headings
            heading_score = self._analyze_headings(content, target_keyword)
            
            return {
                "success": True,
                "score": score,
                "content_type": content_type.value,
                "target_keyword": target_keyword,
                "word_count": word_count,
                "analysis": {
                    "keyword_density": keyword_density,
                    "keyword_count": keyword_count,
                    "heading_score": heading_score,
                    "readability": self._analyze_readability(content),
                },
                "recommendations": recommendations,
                "full_analysis": analysis,
            }
        except Exception as e:
            logger.error(f"Error grading content SEO: {str(e)}")
            return {"error": f"Failed to grade content SEO: {str(e)}"}
    
    def _analyze_headings(self, content: str, target_keyword: str) -> Dict[str, Any]:
        """Analyze headings for SEO"""
        heading_patterns = [
            (r"<h1[^>]*>(.*?)<\/h1>", "h1"),  # HTML h1
            (r"<h2[^>]*>(.*?)<\/h2>", "h2"),  # HTML h2
            (r"<h3[^>]*>(.*?)<\/h3>", "h3"),  # HTML h3
            (r"^#\s+(.*)$", "h1"),            # Markdown h1
            (r"^##\s+(.*)$", "h2"),           # Markdown h2
            (r"^###\s+(.*)$", "h3"),          # Markdown h3
        ]
        
        # Extract headings
        headings = []
        lines = content.split("\n")
        for line in lines:
            for pattern, h_type in heading_patterns:
                matches = re.findall(pattern, line, re.MULTILINE)
                for match in matches:
                    headings.append({"type": h_type, "text": match})
        
        # Count headings with keyword
        keyword_in_headings = sum(1 for h in headings if target_keyword.lower() in h["text"].lower())
        
        return {
            "total_headings": len(headings),
            "headings_with_keyword": keyword_in_headings,
            "has_keyword_in_h1": any(h["type"] == "h1" and target_keyword.lower() in h["text"].lower() for h in headings),
            "heading_structure_score": 10 if len(headings) > 0 else 0,  # Simple score
        }
    
    def _analyze_readability(self, content: str) -> Dict[str, Any]:
        """Analyze content readability"""
        # Count sentences
        sentences = re.split(r'[.!?]+', content)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        # Count words
        words = content.split()
        
        # Calculate average sentence length
        avg_sentence_length = len(words) / len(sentences) if sentences else 0
        
        # Simplified readability score (0-100)
        # Lower average sentence length is better (ideal: 15-20 words)
        if avg_sentence_length < 10:
            readability_score = 80  # Short sentences, might be too simple
        elif 10 <= avg_sentence_length <= 20:
            readability_score = 100  # Ideal range
        elif 20 < avg_sentence_length <= 25:
            readability_score = 80  # Getting a bit long
        elif 25 < avg_sentence_length <= 30:
            readability_score = 60  # Too long
        else:
            readability_score = 40  # Very hard to read
        
        return {
            "score": readability_score,
            "avg_sentence_length": avg_sentence_length,
            "sentence_count": len(sentences),
            "word_count": len(words),
        }
    
    async def generate_content_recommendations(self,
                                             topic: str,
                                             target_keywords: List[str],
                                             content_type: SEOContentTypes = SEOContentTypes.BLOG_POST) -> Dict[str, Any]:
        """Generate content recommendations for a topic"""
        logger.info(f"Generating content recommendations for topic: {topic}")
        
        try:
            # Initialize vector store
            await self._initialize_vector_store()
            
            # Create query engine
            query_engine = self.index.as_query_engine()
            
            # Query for similar content
            query = f"""Generate content recommendations for a {content_type.value} about "{topic}" 
            targeting these keywords: {', '.join(target_keywords)}.
            What should be included to rank well?"""
            
            response = query_engine.query(query)
            
            # Extract structured recommendations
            structure_rec = self._extract_section(response.response, "structure", 500)
            keyword_rec = self._extract_section(response.response, "keyword", 300)
            
            # Use LLM to generate outline
            from llama_index.llms import Ollama
            llm = Ollama(model=self.config.model_name or "mistral")
            
            outline_prompt = f"""Create a detailed outline for a {content_type.value} about "{topic}" 
            targeting these keywords: {', '.join(target_keywords)}.
            
            The outline should include:
            - A compelling title
            - Introduction with hook and thesis
            - 3-5 main sections with subheadings
            - Conclusion
            
            Format as a hierarchical outline with clear headings and subheadings.
            """
            
            outline_response = await llm.acomplete(outline_prompt)
            
            return {
                "success": True,
                "topic": topic,
                "content_type": content_type.value,
                "target_keywords": target_keywords,
                "recommendations": {
                    "structure": structure_rec,
                    "keyword_usage": keyword_rec,
                    "outline": outline_response.text,
                },
                "similar_content": self._extract_section(response.response, "similar", 300),
            }
        except Exception as e:
            logger.error(f"Error generating content recommendations: {str(e)}")
            return {"error": f"Failed to generate content recommendations: {str(e)}"}
    
    async def analyze_competitor_content(self,
                                       competitor_urls: List[str],
                                       target_keywords: List[str]) -> Dict[str, Any]:
        """Analyze competitor content for the given keywords"""
        logger.info(f"Analyzing competitor content for urls: {competitor_urls}")
        
        try:
            # Initialize common results
            results = {
                "success": True,
                "competitor_analysis": {},
                "keyword_coverage": {k: 0 for k in target_keywords},
                "overall_insights": ""
            }
            
            # Import required libraries
            try:
                import requests
                from bs4 import BeautifulSoup
                import trafilatura
            except ImportError:
                return {"error": "Required libraries not installed. Install with: pip install requests beautifulsoup4 trafilatura"}
            
            # Analyze each competitor URL
            for url in competitor_urls:
                try:
                    # Fetch content
                    downloaded = trafilatura.fetch_url(url)
                    content = trafilatura.extract(downloaded)
                    
                    if not content:
                        # Fallback to requests + BeautifulSoup
                        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
                        soup = BeautifulSoup(response.text, 'html.parser')
                        # Extract text content
                        for script in soup(["script", "style"]):
                            script.extract()
                        content = soup.get_text()
                    
                    # Count keywords
                    keyword_counts = {}
                    word_count = len(content.split())
                    
                    for keyword in target_keywords:
                        count = content.lower().count(keyword.lower())
                        keyword_counts[keyword] = count
                        
                        # Update overall keyword coverage
                        if count > 0:
                            results["keyword_coverage"][keyword] += 1
                    
                    # Analyze headings
                    soup = BeautifulSoup(content, 'html.parser')
                    headings = []
                    for tag in ['h1', 'h2', 'h3']:
                        for heading in soup.find_all(tag):
                            headings.append({"type": tag, "text": heading.text.strip()})
                    
                    # Store results for this competitor
                    results["competitor_analysis"][url] = {
                        "word_count": word_count,
                        "keyword_counts": keyword_counts,
                        "headings": headings[:5],  # First 5 headings
                        "keyword_density": {k: (v / word_count) if word_count > 0 else 0 
                                          for k, v in keyword_counts.items()}
                    }
                except Exception as url_error:
                    logger.error(f"Error analyzing competitor URL {url}: {str(url_error)}")
                    results["competitor_analysis"][url] = {"error": str(url_error)}
            
            # Generate overall insights using LLM
            if any(results["competitor_analysis"].values()):
                from llama_index.llms import Ollama
                llm = Ollama(model=self.config.model_name or "mistral")
                
                # Create insights prompt
                insights_data = json.dumps(results["competitor_analysis"], indent=2)
                insights_prompt = f"""Analyze this competitor content data and provide strategic insights:
                
                {insights_data}
                
                What patterns do you see? What's working well? What keywords are they focusing on?
                How can we differentiate our content? Provide 3-5 specific actionable recommendations.
                """
                
                insights_response = await llm.acomplete(insights_prompt)
                results["overall_insights"] = insights_response.text
            
            return results
        except Exception as e:
            logger.error(f"Error analyzing competitor content: {str(e)}")
            return {"error": f"Failed to analyze competitor content: {str(e)}"}
    
    async def find_backlink_opportunities(self,
                                        target_keywords: List[str],
                                        target_domain: str) -> Dict[str, Any]:
        """Find backlink opportunities for the target domain"""
        logger.info(f"Finding backlink opportunities for domain: {target_domain}")
        
        # This is a placeholder implementation
        # In a real implementation, you would connect to backlink APIs
        return {
            "success": True,
            "message": "Backlink opportunity analysis not fully implemented yet",
            "sample_opportunities": [
                {
                    "domain": "example.com",
                    "authority": 45,
                    "relevance": 0.8,
                    "contact_info": "contact@example.com"
                }
            ]
        } 