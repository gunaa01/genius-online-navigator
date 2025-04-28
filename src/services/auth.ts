import { schemas } from '@/lib/validation';
import axios from 'axios';

export const authService = {
  async login(credentials: { email: string; password: string }) {
    // Validate input
    const validation = schemas.login().safeParse(credentials);
    if (!validation.success) {
      throw new Error('Validation failed');
    }

    // Call API
    const response = await axios.post('/api/auth', validation.data);
    return response.data;
  },
  
  // Other auth methods...
};
