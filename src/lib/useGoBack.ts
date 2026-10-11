import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Go back one screen. If this screen was opened directly (a shared link, a new tab),
 * there is nothing to go back to, so go to `fallback` instead.
 */
export function useGoBack(fallback: string) {
  const navigate = useNavigate();
  const { key } = useLocation();
  // react-router gives the first screen of a visit the key 'default'
  return useCallback(() => (key === 'default' ? navigate(fallback, { replace: true }) : navigate(-1)), [key, fallback, navigate]);
}
