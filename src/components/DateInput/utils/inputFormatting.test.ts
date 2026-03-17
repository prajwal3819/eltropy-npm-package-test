import { describe, it, expect } from 'vitest';
import {
  formatInputWithSeparators,
  validateDateInput,
  restrictToDateCharacters,
} from './inputFormatting';

describe('inputFormatting', () => {
  describe('formatInputWithSeparators', () => {
    it('auto-inserts slash separators for MM/DD/YYYY', () => {
      const { formatted } = formatInputWithSeparators('01152025', 'MM/DD/YYYY');
      expect(formatted).toBe('01/15/2025');
    });

    it('preserves manually typed separators', () => {
      const { formatted } = formatInputWithSeparators('01/15/2025', 'MM/DD/YYYY');
      expect(formatted).toBe('01/15/2025');
    });

    it('handles partial input', () => {
      const { formatted } = formatInputWithSeparators('011', 'MM/DD/YYYY');
      expect(formatted).toBe('01/1');
    });

    it('handles dash-based format', () => {
      const { formatted } = formatInputWithSeparators('2025-01-15', 'YYYY-MM-DD');
      expect(formatted).toBe('2025-01-15');
    });

    it('strips non-digit non-separator characters', () => {
      const { formatted } = formatInputWithSeparators('0a1/1b5/2025', 'MM/DD/YYYY');
      expect(formatted).toBe('01/15/2025');
    });

    it('does not exceed format length', () => {
      const { formatted } = formatInputWithSeparators('011520259999', 'MM/DD/YYYY');
      expect(formatted).toBe('01/15/2025');
    });
  });

  describe('validateDateInput', () => {
    it('returns valid for empty input', () => {
      expect(validateDateInput('', 'MM/DD/YYYY')).toEqual({ isValid: true });
    });

    it('returns valid for whitespace-only input', () => {
      expect(validateDateInput('   ', 'MM/DD/YYYY')).toEqual({ isValid: true });
    });

    it('returns valid for a correct date', () => {
      expect(validateDateInput('01/15/2025', 'MM/DD/YYYY')).toEqual({ isValid: true });
    });

    it('returns error for incomplete date', () => {
      const result = validateDateInput('01/15', 'MM/DD/YYYY');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('returns error for invalid month (>12)', () => {
      const result = validateDateInput('13/15/2025', 'MM/DD/YYYY');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Month');
    });

    it('returns error for invalid month (0)', () => {
      const result = validateDateInput('00/15/2025', 'MM/DD/YYYY');
      expect(result.isValid).toBe(false);
    });

    it('returns error for invalid day (>31)', () => {
      const result = validateDateInput('01/32/2025', 'MM/DD/YYYY');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Day');
    });

    it('returns error for invalid day (0)', () => {
      const result = validateDateInput('01/00/2025', 'MM/DD/YYYY');
      expect(result.isValid).toBe(false);
    });

    it('returns error for year out of range (<1900)', () => {
      const result = validateDateInput('01/15/1899', 'MM/DD/YYYY');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Year');
    });

    it('returns error for year out of range (>2100)', () => {
      const result = validateDateInput('01/15/2101', 'MM/DD/YYYY');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Year');
    });

    it('returns error for Feb 30', () => {
      const result = validateDateInput('02/30/2025', 'MM/DD/YYYY');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid day');
    });

    it('accepts Feb 29 in a leap year', () => {
      expect(validateDateInput('02/29/2024', 'MM/DD/YYYY')).toEqual({ isValid: true });
    });

    it('rejects Feb 29 in a non-leap year', () => {
      const result = validateDateInput('02/29/2025', 'MM/DD/YYYY');
      expect(result.isValid).toBe(false);
    });

    it('validates DD/MM/YYYY format', () => {
      expect(validateDateInput('15/01/2025', 'DD/MM/YYYY')).toEqual({ isValid: true });
    });

    it('validates YYYY-MM-DD format', () => {
      expect(validateDateInput('2025-01-15', 'YYYY-MM-DD')).toEqual({ isValid: true });
    });
  });

  describe('restrictToDateCharacters', () => {
    it('allows digits and separators', () => {
      expect(restrictToDateCharacters('01/15/2025')).toBe('01/15/2025');
    });

    it('allows dashes', () => {
      expect(restrictToDateCharacters('2025-01-15')).toBe('2025-01-15');
    });

    it('strips alphabetic characters', () => {
      expect(restrictToDateCharacters('0a1/1b5/2c025')).toBe('01/15/2025');
    });

    it('strips special characters', () => {
      expect(restrictToDateCharacters('01@15#2025')).toBe('01152025');
    });

    it('returns empty string for all invalid chars', () => {
      expect(restrictToDateCharacters('abcdef')).toBe('');
    });
  });
});
