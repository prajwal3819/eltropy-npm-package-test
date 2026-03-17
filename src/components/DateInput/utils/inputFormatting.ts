export const formatInputWithSeparators = (
  value: string,
  format: string,
): { formatted: string; cursorOffset: number } => {
  const separator = format.includes('/')
    ? '/'
    : format.includes('-')
      ? '-'
      : '/';
  const validSeparators = /[\/\-]/;

  let formatted = '';
  let digitIndex = 0;
  let cursorOffset = 0;
  let separatorCount = 0;

  const formatParts = format.split(/[\/\-]/);
  const partLengths = formatParts.map((part) => part.length);

  // Process each character in the input
  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    // If it's a valid separator and we haven't exceeded the number of parts
    if (validSeparators.test(char) && separatorCount < formatParts.length - 1) {
      // Only add separator if we have digits before it and haven't reached max separators
      if (
        formatted.length > 0 &&
        !validSeparators.test(formatted[formatted.length - 1])
      ) {
        formatted += separator;
        separatorCount++;
        cursorOffset = 0;
      }
    }
    // If it's a digit
    else if (/\d/.test(char)) {
      const currentPart = separatorCount;
      if (currentPart < partLengths.length) {
        const partDigits =
          formatted.split(validSeparators)[currentPart]?.length || 0;
        if (partDigits < partLengths[currentPart]) {
          formatted += char;
          digitIndex++;

          // Auto-add separator if part is complete and not last part
          if (
            digitIndex % partLengths[currentPart] === 0 &&
            separatorCount < formatParts.length - 1 &&
            digitIndex < value.replace(/[^\d]/g, '').length
          ) {
            formatted += separator;
            separatorCount++;
            cursorOffset = 1;
          }
        }
      }
    }
  }

  return { formatted, cursorOffset };
};

export const validateDateInput = (
  value: string,
  format: string,
): { isValid: boolean; error?: string } => {
  if (!value.trim()) {
    return { isValid: true };
  }

  const separator = format.includes('/')
    ? '/'
    : format.includes('-')
      ? '-'
      : '/';
  const formatParts = format.split(/[\/\-]/);
  const valueParts = value.split(separator);

  const digitsOnly = value.replace(/[^\d]/g, '');
  const expectedLength = format.replace(/[^\dMDY]/g, '').length;

  if (digitsOnly.length < expectedLength) {
    return { isValid: false, error: `Date must be in ${format} format` };
  }

  if (valueParts.length !== formatParts.length) {
    return { isValid: false, error: `Date must be in ${format} format` };
  }

  let monthIndex = -1;
  let dayIndex = -1;
  let yearIndex = -1;

  formatParts.forEach((part, index) => {
    if (part.includes('M')) monthIndex = index;
    if (part.includes('D')) dayIndex = index;
    if (part.includes('Y')) yearIndex = index;
  });

  const month = monthIndex >= 0 ? parseInt(valueParts[monthIndex], 10) : 0;
  const day = dayIndex >= 0 ? parseInt(valueParts[dayIndex], 10) : 0;
  const year = yearIndex >= 0 ? parseInt(valueParts[yearIndex], 10) : 0;

  if (isNaN(month) || isNaN(day) || isNaN(year)) {
    return { isValid: false, error: 'Invalid date values' };
  }

  if (month < 1 || month > 12) {
    return { isValid: false, error: 'Month must be between 01 and 12' };
  }

  if (day < 1 || day > 31) {
    return { isValid: false, error: 'Day must be between 01 and 31' };
  }

  if (year < 1900 || year > 2100) {
    return { isValid: false, error: 'Year must be between 1900 and 2100' };
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) {
    return { isValid: false, error: `Invalid day for month ${month}` };
  }

  return { isValid: true };
};

export const restrictToDateCharacters = (value: string): string => {
  return value.replace(/[^\d\/\-]/g, '');
};
