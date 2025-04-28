import { useState } from 'react';
import { verifyPostorder } from '../../utils/verifyPostorder';
import BSTVisualization from '../../components/BSTVisualization/BSTVisualization';

[Redacted for brevity]

const [input, setInput] = useState('');
const [parsedArray, setParsedArray] = useState<number[]>([]);
const [result, setResult] = useState<string>('');
const [isVerifying, setIsVerifying] = useState(false);

const handleVerify = () => {
  try {
    const numbers = input
      .split(',')
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n));
    setParsedArray(numbers);
    setIsVerifying(true);
    const isValid = verifyPostorder(numbers);
    setResult(isValid ? 'Valid BST Postorder' : 'Invalid BST Postorder');
  } catch (error) {
    setResult('Invalid input format');
  } finally {
    setIsVerifying(false);
  }
};

[Redacted for brevity]

<button 
  onClick={handleVerify}
  disabled={isVerifying}
>
  {isVerifying ? 'Verifying...' : 'Verify Sequence'}
</button>
