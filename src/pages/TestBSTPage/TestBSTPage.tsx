
import React from 'react';
import { Button } from '@/components/ui/button';

interface Node {
  value: number;
  left: Node | null;
  right: Node | null;
}

const TestBSTPage: React.FC = () => {
  const [tree, setTree] = React.useState<Node | null>(null);
  const [nodeValue, setNodeValue] = React.useState<string>('');
  const [inorder, setInorder] = React.useState<number[]>([]);
  const [preorder, setPreorder] = React.useState<number[]>([]);
  const [postorder, setPostorder] = React.useState<number[]>([]);

  const insert = (value: number) => {
    const insertNode = (node: Node | null, value: number): Node => {
      if (node === null) {
        return { value, left: null, right: null };
      }
      
      if (value < node.value) {
        node.left = insertNode(node.left, value);
      } else if (value > node.value) {
        node.right = insertNode(node.right, value);
      }
      
      return node;
    };
    
    setTree(prevTree => {
      if (prevTree === null) {
        return { value, left: null, right: null };
      } else {
        return insertNode(prevTree, value);
      }
    });
  };

  const handleInsert = () => {
    const value = parseInt(nodeValue);
    if (!isNaN(value)) {
      insert(value);
      setNodeValue('');
      traverseTree();
    }
  };

  const traverseTree = () => {
    const inorderArr: number[] = [];
    const preorderArr: number[] = [];
    const postorderArr: number[] = [];
    
    const inorderTraversal = (node: Node | null) => {
      if (node !== null) {
        inorderTraversal(node.left);
        inorderArr.push(node.value);
        inorderTraversal(node.right);
      }
    };
    
    const preorderTraversal = (node: Node | null) => {
      if (node !== null) {
        preorderArr.push(node.value);
        preorderTraversal(node.left);
        preorderTraversal(node.right);
      }
    };
    
    const postorderTraversal = (node: Node | null) => {
      if (node !== null) {
        postorderTraversal(node.left);
        postorderTraversal(node.right);
        postorderArr.push(node.value);
      }
    };
    
    inorderTraversal(tree);
    preorderTraversal(tree);
    postorderTraversal(tree);
    
    setInorder(inorderArr);
    setPreorder(preorderArr);
    setPostorder(postorderArr);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Binary Search Tree Visualization</h1>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={nodeValue}
          onChange={(e) => setNodeValue(e.target.value)}
          placeholder="Enter node value"
          className="border p-2 rounded"
        />
        <Button onClick={handleInsert}>Insert Node</Button>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Tree Traversals:</h2>
        <p><strong>Inorder:</strong> {inorder.join(', ')}</p>
        <p><strong>Preorder:</strong> {preorder.join(', ')}</p>
        <p><strong>Postorder:</strong> {postorder.join(', ')}</p>
      </div>
      
      <div className="p-4 border rounded bg-gray-50">
        <p className="text-center">Tree visualization would be rendered here</p>
      </div>
    </div>
  );
};

export default TestBSTPage;
