import type { TypedUseSelectorHook } from 'react-redux';
import { useSelector } from 'react-redux';

import type { RootState } from './store';
// Use throughout your app instead of `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
