"""
SEO Content Optimization Workflow Template

This module defines a reusable workflow template for SEO content optimization
that leverages multiple agents and tools in a coordinated workflow.
"""

from typing import Dict, Any
import asyncio
import logging

from ..graph_engine import (
    NodeType,
    EdgeCondition
)
from ..engine import (
    create_workflow,
    add_agent_node,
    add_tool_node,
    add_merge_node,
    connect_nodes
)
from ..registry import get_workflow_registry


logger = logging.getLogger(__name__)


def create_seo_workflow_template() -> str:
    """Create and register the SEO content optimization workflow template"""
    # Create the workflow graph
    workflow = create_workflow(
        name="SEO Content Optimization Workflow",
        description="A workflow for optimizing content for search engines"
    )
    
    # Add nodes
    # 1. Topic Research
    topic_research = add_agent_node(
        graph=workflow,
        id="topic_research",
        name="Topic Research",
        agent_name="seo_analyst",
        agent_type="react",
        query="Research the most relevant keywords and topics for {content_topic}. "
              "Focus on search volume, competition, and user intent.",
        max_steps=5
    )
    
    # 2. Competitor Analysis
    competitor_analysis = add_agent_node(
        graph=workflow,
        id="competitor_analysis",
        name="Competitor Analysis",
        agent_name="seo_analyst",
        agent_type="react",
        query="Analyze the top 3 competing content pieces for {primary_keyword}. "
              "Identify content gaps, structure, and unique selling points.",
        max_steps=5,
        input_mappings=[
            {
                "source_node": "topic_research",
                "source_key": "output.result.keyword_data.results.0.keyword",
                "target_key": "primary_keyword"
            }
        ]
    )
    
    # 3. Content Outline
    content_outline = add_agent_node(
        graph=workflow,
        id="content_outline",
        name="Content Outline Creation",
        agent_name="content_strategist",
        agent_type="react",
        query="Create a detailed content outline for {content_topic} targeting {primary_keyword}. "
              "Include headings, subheadings, and key points for each section.",
        max_steps=7,
        input_mappings=[
            {
                "source_node": "topic_research",
                "source_key": "output.result.keyword_data.results.0.keyword",
                "target_key": "primary_keyword"
            }
        ]
    )
    
    # 4. SEO Title Generation
    title_generation = add_tool_node(
        graph=workflow,
        id="title_generation",
        name="SEO Title Generation",
        tool_name="seo_title_generator",
        arguments={
            "num_variations": 5
        },
        input_mappings=[
            {
                "source_node": "topic_research",
                "source_key": "output.result.keyword_data.results",
                "target_key": "keywords"
            },
            {
                "source_node": "content_outline",
                "source_key": "output.output",
                "target_key": "content_outline"
            }
        ]
    )
    
    # 5. Content Creation
    content_creation = add_agent_node(
        graph=workflow,
        id="content_creation",
        name="Content Creation",
        agent_name="content_writer",
        agent_type="human_in_loop",
        query="Write a comprehensive, SEO-optimized article based on the provided outline. "
              "Include the primary keyword in the first paragraph, and use secondary keywords naturally "
              "throughout the content. Follow best practices for readability and engagement.",
        max_steps=15,
        input_mappings=[
            {
                "source_node": "topic_research",
                "source_key": "output.result.keyword_data.results",
                "target_key": "keywords"
            },
            {
                "source_node": "content_outline",
                "source_key": "output.output",
                "target_key": "outline"
            },
            {
                "source_node": "title_generation",
                "source_key": "output.titles.0",
                "target_key": "title"
            }
        ]
    )
    
    # 6. SEO Optimization Check
    seo_check = add_agent_node(
        graph=workflow,
        id="seo_check",
        name="SEO Optimization Check",
        agent_name="seo_analyst",
        agent_type="react",
        query="Analyze the content for SEO optimization. Check keyword density, "
              "heading structure, meta description, and internal linking opportunities. "
              "Provide specific recommendations for improvement.",
        max_steps=5,
        input_mappings=[
            {
                "source_node": "topic_research",
                "source_key": "output.result.keyword_data.results",
                "target_key": "keywords"
            },
            {
                "source_node": "content_creation",
                "source_key": "output.output",
                "target_key": "content"
            }
        ]
    )
    
    # 7. Content Revision
    content_revision = add_agent_node(
        graph=workflow,
        id="content_revision",
        name="Content Revision",
        agent_name="content_writer",
        agent_type="human_in_loop",
        query="Revise the content based on the SEO recommendations. "
              "Improve keyword usage, heading structure, and internal linking as suggested.",
        max_steps=8,
        input_mappings=[
            {
                "source_node": "content_creation",
                "source_key": "output.output",
                "target_key": "original_content"
            },
            {
                "source_node": "seo_check",
                "source_key": "output.output",
                "target_key": "seo_recommendations"
            }
        ]
    )
    
    # 8. Final Review
    final_review = add_agent_node(
        graph=workflow,
        id="final_review",
        name="Final Review",
        agent_name="editor",
        agent_type="human_in_loop",
        query="Review the final content for quality, accuracy, and SEO optimization. "
              "Check for grammar, clarity, and overall impact. Approve or request further revisions.",
        max_steps=5,
        input_mappings=[
            {
                "source_node": "content_revision",
                "source_key": "output.output",
                "target_key": "revised_content"
            },
            {
                "source_node": "seo_check",
                "source_key": "output.output",
                "target_key": "seo_recommendations"
            }
        ]
    )
    
    # 9. Results Aggregation
    results = add_merge_node(
        graph=workflow,
        id="results",
        name="Results Aggregation",
        input_mappings=[
            {
                "source_node": "final_review",
                "source_key": "output.output",
                "target_key": "final_content"
            },
            {
                "source_node": "topic_research",
                "source_key": "output.result.keyword_data",
                "target_key": "keyword_data"
            },
            {
                "source_node": "title_generation",
                "source_key": "output.titles",
                "target_key": "title_options"
            }
        ]
    )
    
    # Connect nodes to form the workflow
    connect_nodes(workflow, "start", topic_research)
    connect_nodes(workflow, topic_research, competitor_analysis)
    connect_nodes(workflow, topic_research, content_outline)
    connect_nodes(workflow, competitor_analysis, content_outline)
    connect_nodes(workflow, content_outline, title_generation)
    connect_nodes(workflow, title_generation, content_creation)
    connect_nodes(workflow, content_creation, seo_check)
    connect_nodes(workflow, seo_check, content_revision)
    connect_nodes(workflow, content_revision, final_review)
    connect_nodes(workflow, final_review, results)
    connect_nodes(workflow, results, "end")
    
    # Add error handling paths
    connect_nodes(workflow, content_creation, seo_check, 
                 condition=EdgeCondition.FAILURE)
    connect_nodes(workflow, content_revision, final_review, 
                 condition=EdgeCondition.FAILURE)
    
    # Register the workflow as a template
    registry = get_workflow_registry("./data/workflows")
    workflow_id = registry.register_workflow(
        workflow=workflow,
        tags=["seo", "content", "marketing"],
        is_template=True,
        version="1.0.0"
    )
    
    logger.info(f"Registered SEO workflow template with ID: {workflow_id}")
    
    return workflow_id


def create_seo_workflow_instance(content_topic: str, instance_name: str = None) -> Dict[str, Any]:
    """Create an instance of the SEO workflow for a specific content topic"""
    registry = get_workflow_registry("./data/workflows")
    
    # Create a name for the instance if not provided
    if not instance_name:
        instance_name = f"SEO Optimization - {content_topic}"
    
    # Create an instance from the template
    instance_id = registry.create_workflow_instance(
        template_id="seo_content_optimization_workflow",
        instance_name=instance_name,
        instance_description=f"SEO content optimization workflow for: {content_topic}"
    )
    
    if not instance_id:
        logger.error("Failed to create SEO workflow instance")
        return {"error": "Failed to create workflow instance"}
    
    # Return the instance information
    return {
        "workflow_id": instance_id,
        "name": instance_name,
        "content_topic": content_topic,
        "initial_context": {
            "content_topic": content_topic
        }
    }


async def run_seo_workflow(content_topic: str, agent_registry: Dict[str, Any], 
                         tool_registry: Dict[str, Any]) -> Dict[str, Any]:
    """Run the SEO workflow for a specific content topic"""
    from ..engine import GraphWorkflowEngine
    
    # Create a workflow instance
    instance_info = create_seo_workflow_instance(content_topic)
    
    if "error" in instance_info:
        return instance_info
    
    # Get the workflow
    registry = get_workflow_registry("./data/workflows")
    workflow = registry.get_workflow(instance_info["workflow_id"])
    
    if not workflow:
        return {"error": "Failed to load workflow"}
    
    # Initialize the workflow engine
    engine = GraphWorkflowEngine(
        agent_registry=agent_registry,
        tool_registry=tool_registry
    )
    
    # Execute the workflow
    try:
        result = await engine.execute_workflow(
            workflow=workflow,
            initial_context=instance_info["initial_context"]
        )
        
        return {
            "workflow_id": instance_info["workflow_id"],
            "status": "completed",
            "content_topic": content_topic,
            "results": result.get("results", {}).get("results", {})
        }
    
    except Exception as e:
        logger.error(f"Error executing SEO workflow: {e}")
        return {
            "workflow_id": instance_info["workflow_id"],
            "status": "error",
            "content_topic": content_topic,
            "error": str(e)
        } 