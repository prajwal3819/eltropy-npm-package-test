import { useEffect } from 'react';
import type { RefObject } from 'react';

const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export const useFocusTrap = (
  containerRef: RefObject<HTMLElement>,
  isActive: boolean,
  returnFocusRef?: RefObject<HTMLElement>,
) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const previousActiveElement = document.activeElement as HTMLElement;

    const getFocusableElements = (): HTMLElement[] => {
      return Array.from(container.querySelectorAll(FOCUSABLE_ELEMENTS));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);

      if (returnFocusRef?.current) {
        returnFocusRef.current.focus();
      } else if (
        previousActiveElement &&
        previousActiveElement !== document.body
      ) {
        previousActiveElement.focus();
      }
    };
  }, [isActive, containerRef, returnFocusRef]);
};
