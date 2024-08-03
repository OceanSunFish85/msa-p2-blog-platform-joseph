import { useDispatch } from 'react-redux';

import type { AppDispatch } from './store';

// Use throughout your app instead of `useDispatch`
export function useAppDispatch() {
  return useDispatch<AppDispatch>();
}
