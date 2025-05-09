"""Report Generator Agent tools for AgentForge OSS
This module provides tools for generating marketing reports using DSPy.
"""

from typing import Dict, List, Any, Optional, Union
import logging
import json
import asyncio
from datetime import datetime, timedelta
import os
import tempfile

try:
    import dspy
    from dspy.predict import Predict
    from dspy.signatures import Signature, InputField, OutputField
except ImportError:
    logging.warning("DSPy not installed. Install with: pip install dspy-ai")

from ...core.marketing_types import ReportConfig, ReportType

logger = logging.getLogger(__name__)

class ReportGeneratorToolset:
    """Report Generator toolset for creating marketing performance reports"""
    
    def __init__(self, config: ReportConfig):
        """Initialize the Report Generator toolset with configuration"""
        self.config = config
        self.tools = self._register_tools()
        self.dspy_model = self._setup_dspy()
        logger.info(f"Report Generator toolset initialized with {len(self.tools)} tools")
    
    def _register_tools(self) -> Dict[str, Any]:
        """Register all Report Generator tools"""
        return {
            "generate_performance_report": self.generate_performance_report,
            "generate_campaign_summary": self.generate_campaign_summary,
            "generate_forecast_report": self.generate_forecast_report,
            "generate_competitor_analysis": self.generate_competitor_analysis,
            "save_report_to_pdf": self.save_report_to_pdf,
        }
    
    def _setup_dspy(self):
        """Set up DSPy model for report generation"""
        try:
            # Configure LLM 
            if hasattr(dspy.models, "Ollama"):
                # Use Ollama for local models if available
                model_name = self.config.model_name or "mistral"
                llm = dspy.models.Ollama(model=model_name)
            else:
                # Fall back to OpenAI-compatible endpoint if specified
                llm = dspy.models.OpenAI(
                    model=self.config.model_name or "gpt-3.5-turbo",
                    api_key=self.config.api_key or "sk-",
                    api_base=self.config.api_endpoint or "http://localhost:8000/v1"
                )
            
            # Set up DSPy with LLM
            dspy.settings.configure(lm=llm)
            
            logger.info(f"DSPy initialized with model: {self.config.model_name}")
            return llm
        except Exception as e:
            logger.error(f"Failed to initialize DSPy: {str(e)}")
            return None
    
    async def generate_performance_report(self, 
                                       performance_data: Dict[str, Any],
                                       report_type: ReportType = ReportType.EXECUTIVE_SUMMARY,
                                       time_period: str = "Last 30 days") -> Dict[str, Any]:
        """Generate a performance report using DSPy"""
        logger.info(f"Generating {report_type} performance report for period: {time_period}")
        
        try:
            if not self.dspy_model:
                return {"error": "DSPy model not initialized"}
            
            # Define DSPy signature for performance report
            class PerformanceReportSignature(Signature):
                """Generate a detailed marketing performance report."""
                performance_data = InputField(desc="Marketing performance metrics and data as JSON")
                report_type = InputField(desc="Type of report to generate")
                time_period = InputField(desc="Time period for the report")
                report = OutputField(desc="Generated report with clear sections and insights")
            
            # Create DSPy predictor
            generate_report = Predict(PerformanceReportSignature)
            
            # Create input data
            input_data = {
                "performance_data": json.dumps(performance_data, indent=2),
                "report_type": report_type.value,
                "time_period": time_period
            }
            
            # Generate report
            result = generate_report(**input_data)
            
            # Process and structure the report
            report_sections = self._structure_report(result.report)
            
            return {
                "success": True,
                "report_type": report_type.value,
                "time_period": time_period,
                "generated_at": datetime.now().isoformat(),
                "report": result.report,
                "structured_report": report_sections
            }
        except Exception as e:
            logger.error(f"Error generating performance report: {str(e)}")
            return {"error": f"Failed to generate performance report: {str(e)}"}
    
    def _structure_report(self, report_text: str) -> Dict[str, Any]:
        """Structure a report text into sections"""
        sections = {}
        current_section = "summary"
        section_text = []
        
        # Split report into lines
        lines = report_text.split("\n")
        
        for line in lines:
            line = line.strip()
            # Check if line is a heading (simplistic approach)
            if line and line == line.upper() and len(line) < 50:
                # Save previous section
                if section_text:
                    sections[current_section] = "\n".join(section_text)
                # Start new section
                current_section = line.lower().replace(" ", "_").replace(":", "")
                section_text = []
            elif line.startswith("# "):
                # Markdown heading
                if section_text:
                    sections[current_section] = "\n".join(section_text)
                current_section = line[2:].lower().replace(" ", "_").replace(":", "")
                section_text = []
            elif line:
                section_text.append(line)
        
        # Save the last section
        if section_text:
            sections[current_section] = "\n".join(section_text)
        
        return sections
    
    async def generate_campaign_summary(self,
                                     campaign_data: Dict[str, Any],
                                     include_recommendations: bool = True) -> Dict[str, Any]:
        """Generate a campaign summary report using DSPy"""
        logger.info(f"Generating campaign summary for campaign: {campaign_data.get('campaign_name', 'Unknown')}")
        
        try:
            if not self.dspy_model:
                return {"error": "DSPy model not initialized"}
            
            # Define DSPy signature for campaign summary
            class CampaignSummarySignature(Signature):
                """Generate a concise campaign summary with key metrics and insights."""
                campaign_data = InputField(desc="Campaign performance data as JSON")
                include_recommendations = InputField(desc="Whether to include recommendations for improvements")
                summary = OutputField(desc="Campaign summary with metrics, insights, and optional recommendations")
            
            # Create DSPy predictor
            generate_summary = Predict(CampaignSummarySignature)
            
            # Generate summary
            result = generate_summary(
                campaign_data=json.dumps(campaign_data, indent=2),
                include_recommendations=str(include_recommendations)
            )
            
            # Extract KPIs
            kpis = self._extract_kpis(result.summary, campaign_data)
            
            return {
                "success": True,
                "campaign_name": campaign_data.get("campaign_name", "Unknown Campaign"),
                "campaign_period": f"{campaign_data.get('start_date', 'Unknown')} to {campaign_data.get('end_date', 'Now')}",
                "summary": result.summary,
                "kpis": kpis,
                "recommendations": self._extract_recommendations(result.summary) if include_recommendations else []
            }
        except Exception as e:
            logger.error(f"Error generating campaign summary: {str(e)}")
            return {"error": f"Failed to generate campaign summary: {str(e)}"}
    
    def _extract_kpis(self, summary: str, campaign_data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract KPIs from summary and campaign data"""
        kpis = {}
        
        # Try to extract standard metrics from campaign data
        standard_kpis = ["impressions", "clicks", "conversions", "spend", "revenue", "roas", "ctr", "cvr"]
        for kpi in standard_kpis:
            if kpi in campaign_data:
                kpis[kpi] = campaign_data[kpi]
        
        # Extract any KPIs mentioned in the summary
        import re
        
        # Pattern to match KPI: value format
        kpi_pattern = r'([A-Za-z\s]+):\s*([\d,.]+%?)'
        for match in re.finditer(kpi_pattern, summary):
            kpi_name = match.group(1).strip().lower().replace(" ", "_")
            kpi_value = match.group(2).strip()
            
            # Convert numeric values
            if kpi_value.endswith("%"):
                try:
                    kpis[kpi_name] = float(kpi_value.rstrip("%")) / 100
                except ValueError:
                    kpis[kpi_name] = kpi_value
            else:
                try:
                    kpis[kpi_name] = float(kpi_value.replace(",", ""))
                except ValueError:
                    kpis[kpi_name] = kpi_value
        
        return kpis
    
    def _extract_recommendations(self, text: str) -> List[str]:
        """Extract recommendations from report text"""
        recommendations = []
        
        # Find recommendations section
        rec_section = ""
        sections = ["recommendations", "recommendation", "suggested actions", "next steps"]
        for section in sections:
            if section in text.lower():
                start_idx = text.lower().find(section)
                end_idx = len(text)
                for next_section in sections:
                    if next_section != section and next_section in text.lower()[start_idx + len(section):]:
                        next_idx = text.lower()[start_idx + len(section):].find(next_section)
                        end_idx = min(end_idx, start_idx + len(section) + next_idx)
                rec_section = text[start_idx:end_idx].strip()
                break
        
        if not rec_section:
            # No clear recommendations section, return empty list
            return recommendations
        
        # Extract bullet points or numbered items
        import re
        bullet_pattern = r'(?:^|\n)(?:\d+\.|\*|\-)\s*(.+?)(?=(?:\n(?:\d+\.|\*|\-|$))|$)'
        matches = re.finditer(bullet_pattern, rec_section)
        for match in matches:
            recommendations.append(match.group(1).strip())
        
        # If no bullet points found, try to extract sentences
        if not recommendations:
            sentences = re.split(r'(?<=[.!?])\s+', rec_section)
            for sentence in sentences:
                if len(sentence.split()) >= 5:  # Only include reasonably long sentences
                    recommendations.append(sentence.strip())
        
        return recommendations
    
    async def generate_forecast_report(self,
                                    historical_data: Dict[str, Any],
                                    forecast_period: int = 30,
                                    metrics: List[str] = None) -> Dict[str, Any]:
        """Generate a forecast report using DSPy"""
        logger.info(f"Generating forecast report for period: {forecast_period} days")
        
        try:
            if not self.dspy_model:
                return {"error": "DSPy model not initialized"}
            
            # Use default metrics if none provided
            if not metrics:
                metrics = ["impressions", "clicks", "conversions", "revenue"]
            
            # Define DSPy signature for forecast report
            class ForecastReportSignature(Signature):
                """Generate a forecast report based on historical marketing data."""
                historical_data = InputField(desc="Historical marketing performance data as JSON")
                forecast_period = InputField(desc="Forecast period in days")
                metrics = InputField(desc="List of metrics to forecast")
                report = OutputField(desc="Forecast report with predictions and confidence intervals")
            
            # Create DSPy predictor
            generate_forecast = Predict(ForecastReportSignature)
            
            # Generate forecast
            result = generate_forecast(
                historical_data=json.dumps(historical_data, indent=2),
                forecast_period=str(forecast_period),
                metrics=", ".join(metrics)
            )
            
            # Extract forecast values
            forecast_values = self._extract_forecast_values(result.report, metrics)
            
            return {
                "success": True,
                "forecast_period": f"{datetime.now().strftime('%Y-%m-%d')} to {(datetime.now() + timedelta(days=forecast_period)).strftime('%Y-%m-%d')}",
                "metrics": metrics,
                "report": result.report,
                "forecast_values": forecast_values
            }
        except Exception as e:
            logger.error(f"Error generating forecast report: {str(e)}")
            return {"error": f"Failed to generate forecast report: {str(e)}"}
    
    def _extract_forecast_values(self, report: str, metrics: List[str]) -> Dict[str, Any]:
        """Extract forecast values from the report"""
        import re
        
        forecast_values = {}
        
        for metric in metrics:
            # Look for metric predictions in format: Metric: X (range: Y-Z)
            pattern = rf'{metric}\s*:\s*([\d,.]+)(?:\s*\(range:\s*([\d,.]+)\s*-\s*([\d,.]+)\))?'
            matches = re.search(pattern, report, re.IGNORECASE)
            
            if matches:
                forecast = float(matches.group(1).replace(",", ""))
                forecast_values[metric] = {
                    "forecast": forecast,
                }
                
                # Add range if available
                if matches.group(2) and matches.group(3):
                    forecast_values[metric]["range_low"] = float(matches.group(2).replace(",", ""))
                    forecast_values[metric]["range_high"] = float(matches.group(3).replace(",", ""))
        
        return forecast_values
    
    async def generate_competitor_analysis(self,
                                        our_data: Dict[str, Any],
                                        competitor_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate a competitor analysis report using DSPy"""
        logger.info(f"Generating competitor analysis report for {len(competitor_data)} competitors")
        
        try:
            if not self.dspy_model:
                return {"error": "DSPy model not initialized"}
            
            # Define DSPy signature for competitor analysis
            class CompetitorAnalysisSignature(Signature):
                """Generate a competitor analysis report comparing our performance with competitors."""
                our_data = InputField(desc="Our marketing performance data as JSON")
                competitor_data = InputField(desc="Competitor marketing data as JSON array")
                report = OutputField(desc="Competitor analysis report with strengths, weaknesses, and opportunities")
            
            # Create DSPy predictor
            generate_analysis = Predict(CompetitorAnalysisSignature)
            
            # Generate analysis
            result = generate_analysis(
                our_data=json.dumps(our_data, indent=2),
                competitor_data=json.dumps(competitor_data, indent=2)
            )
            
            # Extract SWOT analysis
            swot = self._extract_swot(result.report)
            
            return {
                "success": True,
                "report": result.report,
                "swot_analysis": swot,
                "competitors_analyzed": [comp.get("name", f"Competitor {i+1}") for i, comp in enumerate(competitor_data)],
                "generated_at": datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error generating competitor analysis: {str(e)}")
            return {"error": f"Failed to generate competitor analysis: {str(e)}"}
    
    def _extract_swot(self, report: str) -> Dict[str, List[str]]:
        """Extract SWOT (Strengths, Weaknesses, Opportunities, Threats) from report"""
        swot = {
            "strengths": [],
            "weaknesses": [],
            "opportunities": [],
            "threats": []
        }
        
        # Look for SWOT sections
        for category in swot:
            # Find section header
            pattern = rf"{category}:?.*?(?=\n\n|\n[A-Z]|$)"
            import re
            match = re.search(pattern, report, re.IGNORECASE | re.DOTALL)
            
            if match:
                section = match.group(0)
                # Extract bullet points
                bullets = []
                for line in section.split("\n"):
                    line = line.strip()
                    if line and (line.startswith("-") or line.startswith("*") or re.match(r"^\d+\.", line)):
                        bullets.append(line.lstrip("- *1234567890.").strip())
                
                if bullets:
                    swot[category] = bullets
                else:
                    # If no bullets, try to extract the sentence after the heading
                    lines = section.split("\n")
                    if len(lines) > 1:
                        swot[category] = [lines[1].strip()]
        
        return swot
    
    async def save_report_to_pdf(self,
                              report_content: Dict[str, Any],
                              filename: str = None) -> Dict[str, Any]:
        """Save a report to PDF format"""
        logger.info(f"Saving report to PDF: {filename}")
        
        try:
            # Import required libraries
            try:
                from reportlab.lib.pagesizes import letter
                from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
                from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
                from reportlab.lib import colors
            except ImportError:
                return {"error": "Required libraries not installed. Install with: pip install reportlab"}
            
            # Generate filename if not provided
            if not filename:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"report_{timestamp}.pdf"
            
            # Ensure pdf extension
            if not filename.endswith(".pdf"):
                filename += ".pdf"
            
            # Create PDF directory if it doesn't exist
            reports_dir = self.config.report_directory or "reports"
            os.makedirs(reports_dir, exist_ok=True)
            
            # Full path
            filepath = os.path.join(reports_dir, filename)
            
            # Create the PDF document
            doc = SimpleDocTemplate(filepath, pagesize=letter)
            styles = getSampleStyleSheet()
            
            # Add custom styles
            styles.add(ParagraphStyle(
                name='Heading1',
                parent=styles['Heading1'],
                fontSize=16,
                spaceAfter=12
            ))
            styles.add(ParagraphStyle(
                name='Heading2',
                parent=styles['Heading2'],
                fontSize=14,
                spaceAfter=10
            ))
            
            # Create content elements
            elements = []
            
            # Add title
            report_title = report_content.get("title", "Marketing Report")
            elements.append(Paragraph(report_title, styles["Heading1"]))
            elements.append(Spacer(1, 12))
            
            # Add date and period
            date_text = f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}"
            period = report_content.get("period", report_content.get("time_period", ""))
            if period:
                date_text += f" | Period: {period}"
            elements.append(Paragraph(date_text, styles["Normal"]))
            elements.append(Spacer(1, 12))
            
            # Add summary if available
            if "summary" in report_content:
                elements.append(Paragraph("Summary", styles["Heading2"]))
                elements.append(Paragraph(report_content["summary"], styles["Normal"]))
                elements.append(Spacer(1, 12))
            
            # Add KPIs if available
            if "kpis" in report_content and isinstance(report_content["kpis"], dict):
                elements.append(Paragraph("Key Metrics", styles["Heading2"]))
                
                # Format KPI table
                kpi_data = [["Metric", "Value"]]
                for key, value in report_content["kpis"].items():
                    # Format value
                    if isinstance(value, float):
                        if key in ["ctr", "cvr", "roas"]:
                            formatted_value = f"{value:.2%}"
                        else:
                            formatted_value = f"{value:,.2f}"
                    else:
                        formatted_value = str(value)
                    
                    # Format key
                    formatted_key = key.replace("_", " ").title()
                    
                    kpi_data.append([formatted_key, formatted_value])
                
                # Create table
                table = Table(kpi_data, colWidths=[250, 100])
                table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                    ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                    ('GRID', (0, 0), (-1, -1), 1, colors.black)
                ]))
                elements.append(table)
                elements.append(Spacer(1, 12))
            
            # Add structured report content
            if "structured_report" in report_content and isinstance(report_content["structured_report"], dict):
                for section, content in report_content["structured_report"].items():
                    # Format section title
                    section_title = section.replace("_", " ").title()
                    elements.append(Paragraph(section_title, styles["Heading2"]))
                    elements.append(Paragraph(content, styles["Normal"]))
                    elements.append(Spacer(1, 12))
            elif "report" in report_content:
                # Add full report text
                elements.append(Paragraph("Report Details", styles["Heading2"]))
                
                # Split by lines to handle formatting
                for line in report_content["report"].split("\n"):
                    if line.strip():
                        if line.startswith("#"):
                            # Handle markdown headings
                            heading_level = line.count("#")
                            heading_text = line.strip("#").strip()
                            if heading_level == 1:
                                elements.append(Paragraph(heading_text, styles["Heading1"]))
                            else:
                                elements.append(Paragraph(heading_text, styles["Heading2"]))
                        else:
                            elements.append(Paragraph(line, styles["Normal"]))
                    else:
                        elements.append(Spacer(1, 6))
            
            # Build the PDF
            doc.build(elements)
            
            return {
                "success": True,
                "filepath": filepath,
                "filename": filename,
                "report_type": report_content.get("report_type", "Unknown")
            }
        except Exception as e:
            logger.error(f"Error saving report to PDF: {str(e)}")
            return {"error": f"Failed to save report to PDF: {str(e)}"}