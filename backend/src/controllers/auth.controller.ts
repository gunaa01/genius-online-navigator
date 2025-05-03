import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../server';
import bcrypt from 'bcryptjs';
import { createTokens } from '../utils/auth';

interface SignupBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export const signup = async (request: FastifyRequest<{ Body: SignupBody }>, reply: FastifyReply) => {
  try {
    const { email, password, firstName, lastName } = request.body;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return reply.status(400).send({ error: 'Email already in use' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });
    
    // Create tokens
    const tokens = createTokens(request.server, { id: user.id, email: user.email });
    
    return { ...tokens, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } };
  } catch (error) {
    console.error('Signup error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const login = async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
  try {
    const { email, password } = request.body;
    
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }
    
    // Create tokens
    const tokens = createTokens(request.server, { id: user.id, email: user.email });
    
    return { ...tokens, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } };
  } catch (error) {
    console.error('Login error:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
};
