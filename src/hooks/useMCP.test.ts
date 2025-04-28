import { renderHook, act } from '@testing-library/react';
import { useMCP } from './useMCP';
import { createClient } from '@supabase/supabase-js';

jest.mock('@supabase/supabase-js');
const mockFrom = jest.fn().mockReturnThis();
const mockSelect = jest.fn();
const mockEq = jest.fn().mockReturnThis();
const mockOrder = jest.fn().mockReturnThis();
const mockInsert = jest.fn().mockReturnThis();
(createClient as jest.Mock).mockReturnValue({
  from: mockFrom,
  select: mockSelect,
  eq: mockEq,
  order: mockOrder,
  insert: mockInsert,
});

describe('useMCP', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads context chain by session_id', async () => {
    mockSelect.mockResolvedValueOnce({ data: [{ id: '1', session_id: 'abc', context: {} }], error: null });
    const { result } = renderHook(() => useMCP('user1'));
    const data = await result.current.loadContext('abc');
    expect(data[0].session_id).toBe('abc');
  });

  it('saves new context entry', async () => {
    mockInsert.mockReturnThis();
    mockSelect.mockResolvedValueOnce({ data: [{ id: '2', session_id: 'def', context: {} }], error: null });
    const { result } = renderHook(() => useMCP('user1'));
    const data = await result.current.saveContext('gpt-4', {}, 'def');
    expect(data[0].session_id).toBe('def');
  });
});
