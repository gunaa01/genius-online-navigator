"""
Calculator tool for AgentForge OSS.
Provides the ability to perform mathematical calculations.
"""

import logging
import ast
import math
import operator
from typing import Dict, Any, Union, List

logger = logging.getLogger(__name__)

# Supported operators for safe evaluation
OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.FloorDiv: operator.floordiv,
    ast.Pow: operator.pow,
    ast.Mod: operator.mod,
    ast.USub: operator.neg,
    ast.UAdd: operator.pos
}

# Supported math functions
MATH_FUNCTIONS = {
    'sin': math.sin,
    'cos': math.cos,
    'tan': math.tan,
    'asin': math.asin,
    'acos': math.acos,
    'atan': math.atan,
    'sqrt': math.sqrt,
    'exp': math.exp,
    'log': math.log,
    'log10': math.log10,
    'abs': abs,
    'round': round,
    'floor': math.floor,
    'ceil': math.ceil,
    'pi': math.pi,
    'e': math.e
}

class SafeEvaluator(ast.NodeVisitor):
    """
    Safe evaluator for mathematical expressions.
    Prevents code execution and only allows math operations.
    """
    
    def __init__(self):
        self.math_funcs = MATH_FUNCTIONS
    
    def visit_BinOp(self, node):
        left = self.visit(node.left)
        right = self.visit(node.right)
        
        if type(node.op) not in OPERATORS:
            raise ValueError(f"Unsupported operation: {type(node.op).__name__}")
        
        return OPERATORS[type(node.op)](left, right)
    
    def visit_UnaryOp(self, node):
        operand = self.visit(node.operand)
        
        if type(node.op) not in OPERATORS:
            raise ValueError(f"Unsupported unary operation: {type(node.op).__name__}")
        
        return OPERATORS[type(node.op)](operand)
    
    def visit_Num(self, node):
        return node.n
    
    def visit_Constant(self, node):
        if isinstance(node.value, (int, float)):
            return node.value
        raise ValueError(f"Unsupported constant: {node.value}")
    
    def visit_Name(self, node):
        if node.id in self.math_funcs:
            return self.math_funcs[node.id]
        raise ValueError(f"Undefined variable: {node.id}")
    
    def visit_Call(self, node):
        func = self.visit(node.func)
        args = [self.visit(arg) for arg in node.args]
        
        if not callable(func):
            raise ValueError(f"'{node.func.id}' is not a callable function")
        
        return func(*args)
    
    def generic_visit(self, node):
        raise ValueError(f"Unsupported expression type: {type(node).__name__}")

def safe_eval(expr: str) -> float:
    """
    Safely evaluate a mathematical expression.
    
    Args:
        expr: The mathematical expression to evaluate
        
    Returns:
        The result of the evaluation
    """
    try:
        tree = ast.parse(expr, mode='eval')
        evaluator = SafeEvaluator()
        return evaluator.visit(tree.body)
    except Exception as e:
        raise ValueError(f"Error evaluating expression '{expr}': {str(e)}")

def calculate(expression: Union[str, Dict[str, Any]]) -> Dict[str, Any]:
    """
    Perform a mathematical calculation.
    
    Args:
        expression: The expression to calculate, either as a string or a dict with 'expression' key
        
    Returns:
        A dictionary containing the result
    """
    # Extract expression from input
    if isinstance(expression, dict):
        expr_str = expression.get('expression', '')
    else:
        expr_str = expression
    
    logger.info(f"Calculating expression: {expr_str}")
    
    try:
        # Clean up the expression
        expr_str = expr_str.strip()
        
        # Handle function syntax with math. prefix
        for func_name in MATH_FUNCTIONS:
            expr_str = expr_str.replace(f"math.{func_name}", func_name)
        
        # Evaluate the expression
        result = safe_eval(expr_str)
        
        return {
            "expression": expr_str,
            "result": result,
            "success": True
        }
    except Exception as e:
        logger.error(f"Error calculating expression: {e}")
        
        return {
            "expression": expr_str,
            "error": str(e),
            "success": False
        } 