/**
 * Optimized state management hook with performance optimizations
 * Implements efficient updates, memoization, and selective re-renders
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { debounce } from 'lodash';

interface StateConfig<T> {
  // Enable debounced updates for frequent changes
  debounceMs?: number;
  // Enable deep comparison for complex objects
  deepCompare?: boolean;
  // Enable state persistence
  persist?: {
    key: string;
    storage?: 'localStorage' | 'sessionStorage';
  };
  // Validation function
  validate?: (value: T) => boolean | string;
}

interface OptimizedStateReturn<T> {
  state: T;
  setState: (value: T | ((prev: T) => T)) => void;
  debouncedSetState: (value: T | ((prev: T) => T)) => void;
  resetState: () => void;
  isValid: boolean;
  validationError: string | null;
}

export function useOptimizedState<T>(
  initialState: T,
  config: StateConfig<T> = {}
): OptimizedStateReturn<T> {
  const {
    debounceMs = 300,
    deepCompare = false,
    persist,
    validate
  } = config;

  // Load initial state from persistence if configured
  const getInitialState = useCallback(() => {
    if (persist) {
      try {
        const storage = persist.storage === 'sessionStorage' ? sessionStorage : localStorage;
        const stored = storage.getItem(persist.key);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (error) {
        console.warn(`Failed to load persisted state for key "${persist.key}":`, error);
      }
    }
    return initialState;
  }, [initialState, persist]);

  const [state, setInternalState] = useState<T>(getInitialState);
  const [validationError, setValidationError] = useState<string | null>(null);
  const previousState = useRef<T>(state);

  // Validation
  const isValid = useMemo(() => {
    if (!validate) return true;
    const result = validate(state);
    if (typeof result === 'string') {
      setValidationError(result);
      return false;
    }
    setValidationError(null);
    return result;
  }, [state, validate]);

  // Deep comparison utility
  const hasChanged = useCallback((newValue: T, oldValue: T): boolean => {
    if (!deepCompare) return newValue !== oldValue;
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  }, [deepCompare]);

  // Optimized setState with change detection
  const setState = useCallback((value: T | ((prev: T) => T)) => {
    setInternalState(prev => {
      const newValue = typeof value === 'function' 
        ? (value as (prev: T) => T)(prev)
        : value;

      // Skip update if value hasn't changed
      if (!hasChanged(newValue, prev)) {
        return prev;
      }

      // Persist state if configured
      if (persist) {
        try {
          const storage = persist.storage === 'sessionStorage' ? sessionStorage : localStorage;
          storage.setItem(persist.key, JSON.stringify(newValue));
        } catch (error) {
          console.warn(`Failed to persist state for key "${persist.key}":`, error);
        }
      }

      previousState.current = prev;
      return newValue;
    });
  }, [hasChanged, persist]);

  // Debounced setState for frequent updates
  const debouncedSetState = useMemo(() => {
    return debounce(setState, debounceMs);
  }, [setState, debounceMs]);

  // Reset to initial state
  const resetState = useCallback(() => {
    setState(initialState);
    setValidationError(null);
  }, [setState, initialState]);

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSetState.cancel();
    };
  }, [debouncedSetState]);

  return {
    state,
    setState,
    debouncedSetState,
    resetState,
    isValid,
    validationError
  };
}

/**
 * Hook for managing form state with optimizations
 */
export function useOptimizedFormState<T extends Record<string, any>>(
  initialValues: T,
  validationRules?: Partial<Record<keyof T, (value: any) => boolean | string>>
) {
  const [formState, setFormState] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  // Track previous values to avoid unnecessary updates
  const prevValues = useRef<Partial<T>>({} as Partial<T>);
  
  // Optimized field update with update batching and value comparison
  const updateField = useCallback(<K extends keyof T>(
    field: K,
    value: T[K]
  ) => {
    // Skip update if value hasn't changed to prevent loops
    if (prevValues.current[field] === value) {
      return;
    }
    
    // Update previous value cache
    prevValues.current[field] = value;
    
    // Batch state updates for better performance
    setFormState(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate field if rules exist
    if (validationRules?.[field]) {
      const validationResult = validationRules[field]!(value);
      setErrors(prev => ({
        ...prev,
        [field]: typeof validationResult === 'string' ? validationResult : undefined
      }));
    }
  }, [validationRules]);

  // Validate entire form
  const validateForm = useCallback(() => {
    if (!validationRules) return true;

    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const fieldKey = field as keyof T;
      const rule = validationRules[fieldKey];
      if (rule) {
        const result = rule(formState[fieldKey]);
        if (typeof result === 'string') {
          newErrors[fieldKey] = result;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formState, validationRules]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormState(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    formState,
    errors,
    touched,
    updateField,
    validateForm,
    resetForm,
    isValid: Object.keys(errors).length === 0
  };
}
