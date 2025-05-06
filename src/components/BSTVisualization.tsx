import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Info, Plus, Trash, RefreshCw, Download } from 'lucide-react';

// Define the node structure for BST
interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

// Define the visualization props
interface BSTVisualizationProps {
  initialData?: number[];
  title?: string;
  description?: string;
}

const BSTVisualization: React.FC<BSTVisualizationProps> = ({
  initialData = [50, 30, 70, 20, 40, 60, 80],
  title = "Binary Search Tree Visualization",
  description = "Visualize and interact with a Binary Search Tree data structure"
}) => {
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [nodeValue, setNodeValue] = useState<string>('');
  const [animationSpeed, setAnimationSpeed] = useState<number>(1);
  const [operation, setOperation] = useState<'insert' | 'delete' | 'search'>('insert');
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info');
  const [treeHeight, setTreeHeight] = useState<number>(0);
  const [nodeCount, setNodeCount] = useState<number>(0);
  const [isBalanced, setIsBalanced] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>('visualization');
  const [presetData, setPresetData] = useState<string>('balanced');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Insert a node into the BST
  const insertNode = (root: TreeNode | null, value: number): TreeNode => {
    if (root === null) {
      return { value, left: null, right: null };
    }
    
    if (value < root.value) {
      root.left = insertNode(root.left, value);
    } else if (value > root.value) {
      root.right = insertNode(root.right, value);
    }
    
    return root;
  };
  
  // Delete a node from the BST
  const deleteNode = (root: TreeNode | null, value: number): TreeNode | null => {
    if (root === null) return null;
    
    if (value < root.value) {
      root.left = deleteNode(root.left, value);
    } else if (value > root.value) {
      root.right = deleteNode(root.right, value);
    } else {
      // Node with only one child or no child
      if (root.left === null) {
        return root.right;
      } else if (root.right === null) {
        return root.left;
      }
      
      // Node with two children
      // Get the inorder successor (smallest in the right subtree)
      root.value = findMinValue(root.right);
      
      // Delete the inorder successor
      root.right = deleteNode(root.right, root.value);
    }
    
    return root;
  };
  
  // Find the minimum value in a BST
  const findMinValue = (node: TreeNode): number => {
    let current = node;
    while (current.left !== null) {
      current = current.left;
    }
    return current.value;
  };
  
  // Search for a node in the BST
  const searchNode = (root: TreeNode | null, value: number): boolean => {
    if (root === null) return false;
    
    if (root.value === value) return true;
    
    if (value < root.value) {
      return searchNode(root.left, value);
    } else {
      return searchNode(root.right, value);
    }
  };
  
  // Calculate the height of the BST
  const calculateHeight = (node: TreeNode | null): number => {
    if (node === null) return 0;
    
    const leftHeight = calculateHeight(node.left);
    const rightHeight = calculateHeight(node.right);
    
    return Math.max(leftHeight, rightHeight) + 1;
  };
  
  // Count the number of nodes in the BST
  const countNodes = (node: TreeNode | null): number => {
    if (node === null) return 0;
    
    return 1 + countNodes(node.left) + countNodes(node.right);
  };
  
  // Check if the BST is balanced
  const isTreeBalanced = (node: TreeNode | null): boolean => {
    if (node === null) return true;
    
    const leftHeight = calculateHeight(node.left);
    const rightHeight = calculateHeight(node.right);
    
    if (Math.abs(leftHeight - rightHeight) <= 1 &&
        isTreeBalanced(node.left) &&
        isTreeBalanced(node.right)) {
      return true;
    }
    
    return false;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const value = parseInt(nodeValue);
    
    if (isNaN(value)) {
      setMessage('Please enter a valid number');
      setMessageType('error');
      return;
    }
    
    let newTree = { ...treeData } as TreeNode | null;
    
    switch (operation) {
      case 'insert':
        if (searchNode(treeData, value)) {
          setMessage(`Node ${value} already exists in the tree`);
          setMessageType('error');
          return;
        }
        newTree = insertNode(newTree, value);
        setMessage(`Node ${value} inserted successfully`);
        setMessageType('success');
        break;
      case 'delete':
        if (!searchNode(treeData, value)) {
          setMessage(`Node ${value} does not exist in the tree`);
          setMessageType('error');
          return;
        }
        newTree = deleteNode(newTree, value);
        setMessage(`Node ${value} deleted successfully`);
        setMessageType('success');
        break;
      case 'search':
        const found = searchNode(treeData, value);
        setMessage(found ? `Node ${value} found in the tree` : `Node ${value} not found in the tree`);
        setMessageType(found ? 'success' : 'error');
        break;
    }
    
    setTreeData(newTree);
    setNodeValue('');
  };
  
  // Reset the tree
  const resetTree = () => {
    setTreeData(null);
    setMessage('Tree reset successfully');
    setMessageType('info');
    
    // Rebuild with preset data
    buildPresetTree(presetData);
  };
  
  // Build a preset tree
  const buildPresetTree = (preset: string) => {
    let data: number[] = [];
    
    switch (preset) {
      case 'balanced':
        data = [50, 30, 70, 20, 40, 60, 80];
        break;
      case 'unbalanced':
        data = [10, 20, 30, 40, 50, 60, 70];
        break;
      case 'complex':
        data = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45, 55, 65, 75, 85];
        break;
      case 'empty':
        data = [];
        break;
      default:
        data = initialData;
    }
    
    let newTree: TreeNode | null = null;
    
    for (const value of data) {
      newTree = insertNode(newTree, value);
    }
    
    setTreeData(newTree);
    setPresetData(preset);
    setMessage(`${preset.charAt(0).toUpperCase() + preset.slice(1)} tree built successfully`);
    setMessageType('success');
  };
  
  // Draw the BST on the canvas
  const drawTree = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const height = calculateHeight(treeData);
    const nodeRadius = 20;
    const levelHeight = 70;
    
    // Draw the tree recursively
    const drawNode = (node: TreeNode | null, x: number, y: number, levelWidth: number) => {
      if (node === null) return;
      
      // Draw the node
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
      ctx.fillStyle = '#f9fafb';
      ctx.fill();
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw the value
      ctx.fillStyle = '#111827';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.value.toString(), x, y);
      
      // Calculate child positions
      const nextLevelWidth = levelWidth / 2;
      const leftX = x - nextLevelWidth;
      const rightX = x + nextLevelWidth;
      const childY = y + levelHeight;
      
      // Draw lines to children
      if (node.left) {
        ctx.beginPath();
        ctx.moveTo(x - nodeRadius / 2, y + nodeRadius / 2);
        ctx.lineTo(leftX + nodeRadius / 2, childY - nodeRadius / 2);
        ctx.strokeStyle = '#9ca3af';
        ctx.stroke();
        drawNode(node.left, leftX, childY, nextLevelWidth);
      }
      
      if (node.right) {
        ctx.beginPath();
        ctx.moveTo(x + nodeRadius / 2, y + nodeRadius / 2);
        ctx.lineTo(rightX - nodeRadius / 2, childY - nodeRadius / 2);
        ctx.strokeStyle = '#9ca3af';
        ctx.stroke();
        drawNode(node.right, rightX, childY, nextLevelWidth);
      }
    };
    
    if (treeData) {
      const startX = canvas.width / 2;
      const startY = 50;
      const startLevelWidth = canvas.width / 3;
      
      drawNode(treeData, startX, startY, startLevelWidth);
    }
  };
  
  // Update tree statistics
  const updateTreeStats = () => {
    const height = calculateHeight(treeData);
    const count = countNodes(treeData);
    const balanced = isTreeBalanced(treeData);
    
    setTreeHeight(height);
    setNodeCount(count);
    setIsBalanced(balanced);
  };
  
  // Initialize the tree with initial data
  useEffect(() => {
    buildPresetTree(presetData);
  }, []);
  
  // Draw the tree whenever it changes
  useEffect(() => {
    if (treeData) {
      drawTree();
      updateTreeStats();
    }
  }, [treeData]);
  
  // Resize the canvas when the window resizes
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.offsetWidth;
        canvasRef.current.height = 400;
        drawTree();
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="info">Information</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visualization" className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Label>Preset:</Label>
                <Select value={presetData} onValueChange={(value) => buildPresetTree(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select preset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Balanced Tree</SelectItem>
                    <SelectItem value="unbalanced">Unbalanced Tree</SelectItem>
                    <SelectItem value="complex">Complex Tree</SelectItem>
                    <SelectItem value="empty">Empty Tree</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" onClick={resetTree}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Tree
              </Button>
            </div>
            
            <div className="border rounded-md p-1">
              <canvas 
                ref={canvasRef} 
                className="w-full h-[400px]" 
                style={{ backgroundColor: '#f8fafc' }}
              />
            </div>
            
            {message && (
              <div className={`p-3 rounded-md ${
                messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                messageType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                <div className="flex items-center">
                  {messageType === 'success' ? (
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  ) : messageType === 'error' ? (
                    <AlertCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <Info className="h-4 w-4 mr-2" />
                  )}
                  <span>{message}</span>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="operations" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow space-y-2">
                  <Label htmlFor="nodeValue">Node Value</Label>
                  <Input
                    id="nodeValue"
                    type="number"
                    placeholder="Enter a number"
                    value={nodeValue}
                    onChange={(e) => setNodeValue(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="operation">Operation</Label>
                  <Select value={operation} onValueChange={(value: 'insert' | 'delete' | 'search') => setOperation(value)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select operation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="insert">Insert</SelectItem>
                      <SelectItem value="delete">Delete</SelectItem>
                      <SelectItem value="search">Search</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button type="submit">
                    {operation === 'insert' ? (
                      <Plus className="h-4 w-4 mr-2" />
                    ) : operation === 'delete' ? (
                      <Trash className="h-4 w-4 mr-2" />
                    ) : (
                      <Info className="h-4 w-4 mr-2" />
                    )}
                    {operation.charAt(0).toUpperCase() + operation.slice(1)}
                  </Button>
                </div>
              </div>
            </form>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Tree Height</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{treeHeight}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Node Count</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{nodeCount}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Balanced</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isBalanced ? 'Yes' : 'No'}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="info" className="space-y-4">
            <div className="prose max-w-none">
              <h3>Binary Search Tree (BST)</h3>
              <p>
                A Binary Search Tree is a node-based binary tree data structure that has the following properties:
              </p>
              <ul>
                <li>The left subtree of a node contains only nodes with keys less than the node's key.</li>
                <li>The right subtree of a node contains only nodes with keys greater than the node's key.</li>
                <li>Both the left and right subtrees must also be binary search trees.</li>
              </ul>
              
              <h4>Time Complexity</h4>
              <ul>
                <li><strong>Search:</strong> O(log n) average, O(n) worst case</li>
                <li><strong>Insert:</strong> O(log n) average, O(n) worst case</li>
                <li><strong>Delete:</strong> O(log n) average, O(n) worst case</li>
              </ul>
              
              <h4>Applications</h4>
              <ul>
                <li>Searching for a specific key in a database</li>
                <li>Implementing dictionaries and maps</li>
                <li>Priority queues</li>
                <li>Maintaining sorted data</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <span className="text-sm text-muted-foreground">
          BST Visualization Tool
        </span>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Tree
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BSTVisualization;
