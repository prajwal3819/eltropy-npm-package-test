import { Box, Flex, Text, useSlotRecipe } from '@chakra-ui/react';
import { forwardRef, useState, useRef, useMemo, useEffect } from 'react';
import { textInputRecipe } from '../../../theme/recipes/text-input.recipe';
import { phoneInputDropdownRecipe } from '../../../theme/recipes/phone-input-dropdown.recipe';
import { phoneInputRecipe } from '../../../theme/recipes/phone-input.recipe';
import type { HTMLChakraProps } from '@chakra-ui/react';
import { ErrorCircleIcon } from '../../../assets/icons';
import { countries } from '../../../utils/countries';
import { PhoneInputDropdown } from './components/Dropdown';
import type { CountryOption } from './types';
import './flags.css';

const ChevronDownIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 6l4 4 4-4" />
  </svg>
);

// Format masks using dots '.' to represent digits.
export const phoneMasks: Record<string, string> = {
  // North America
  US: '(...) ...-....', // United States
  CA: '(...) ...-....', // Canada
  MX: '... ... ....', // Mexico

  // Europe
  FR: '.. .. .. .. ..', // France
  ES: '... ... ...', // Spain
  IT: '... .......', // Italy
  DE: '.... ........', // Germany (Variable length, this covers up to 12 digits)
  GB: '.... ......', // United Kingdom
  GR: '..........', // Greece
  AT: '... .......', // Austria
  PT: '... ... ...', // Portugal
  NL: '.. ........', // Netherlands
  CH: '.. ... .. ..', // Switzerland

  // Asia
  CN: '... .... ....', // China
  JP: '...-....-....', // Japan
  KR: '...-....-....', // South Korea
  IN: '..... .....', // India
  TH: '... ... ....', // Thailand
  MY: '... .......', // Malaysia
  SG: '.... ....', // Singapore
  ID: '...-....-.....', // Indonesia (Variable length, covers up to 12 digits)
  VN: '... .... ...', // Vietnam

  // Middle East & Africa
  TR: '(...) ... .. ..', // Turkey
  SA: '.. ... ....', // Saudi Arabia
  AE: '.. ... ....', // United Arab Emirates
  EG: '... .......', // Egypt
  MA: '... ......', // Morocco
  ZA: '.. ... ....', // South Africa

  // South America
  BR: '(..) .....-....', // Brazil
  AR: '.. ....-....', // Argentina

  // Oceania
  AU: '... ... ...', // Australia
  NZ: '... ... ....' // New Zealand
};

const applyPhoneMask = (rawDigits: string, mask?: string) => {
  if (!mask) return rawDigits;
  let result = '';
  let digitIndex = 0;
  for (let i = 0; i < mask.length && digitIndex < rawDigits.length; i++) {
    if (mask[i] === '.') {
      result += rawDigits[digitIndex];
      digitIndex++;
    } else {
      result += mask[i];
    }
  }
  return result;
};

const formattedCountries = countries.map((country) => ({
  label: country.name,
  value: country.code,
  dialCode: country.dial_code,
  code: country.code,
  icon: (
    <Box
      className={`fflag fflag-${country.code} ff-md`}
      width="23px"
      height="20px"
    />
  )
}));

export interface PhoneInputProps extends Omit<
  HTMLChakraProps<'input'>,
  'size'
> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  subtext?: string;
  supportingText?: string;
  error?: string;
  isRequired?: boolean;
  optionalText?: string;
  isInvalid?: boolean;
  onlyCountries?: string[];
  excludeCountries?: string[];
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      size = 'md',
      label,
      subtext,
      supportingText,
      error,
      isRequired,
      optionalText,
      disabled,
      isInvalid,
      onlyCountries,
      excludeCountries,
      onChange,
      onFocus,
      onBlur,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const hasError = !!error || isInvalid;

    // Load Recipes
    const inputRecipe = useSlotRecipe({ recipe: textInputRecipe });
    const inputStyles = inputRecipe({ size, hasRightIcon: false });
    const dropdownStyles = useSlotRecipe({ recipe: phoneInputDropdownRecipe })(
      {}
    );
    const layoutStyles = useSlotRecipe({ recipe: phoneInputRecipe })({
      invalid: hasError
    });

    const availableCountries = useMemo(() => {
      let list = formattedCountries;
      if (onlyCountries && onlyCountries.length > 0) {
        const only = onlyCountries.map((c) => c.toUpperCase());
        list = list.filter((c) => only.includes(c.value.toUpperCase()));
      } else if (excludeCountries && excludeCountries.length > 0) {
        const exclude = excludeCountries.map((c) => c.toUpperCase());
        list = list.filter((c) => !exclude.includes(c.value.toUpperCase()));
      }
      return list;
    }, [onlyCountries, excludeCountries]);

    const [selectedCountry, setSelectedCountry] = useState<CountryOption>(
      availableCountries.find((country) => country.value === 'US') ||
        availableCountries[0]
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [inputValue, setInputValue] = useState('');

    const searchInputRef = useRef<HTMLInputElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      const initialValue = (value as string) || (defaultValue as string) || '';
      if (initialValue) {
        const rawDigits = initialValue.replace(/\D/g, '');
        const mask = phoneMasks[selectedCountry.value.toUpperCase()];
        setInputValue(applyPhoneMask(rawDigits, mask));
      }
    }, [value, defaultValue, selectedCountry.value]);

    const filteredCountries = availableCountries.filter(
      (c) =>
        c.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.dialCode.includes(searchQuery)
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const rawDigits = rawValue.replace(/\D/g, '');
      const mask = phoneMasks[selectedCountry.value.toUpperCase()];
      const maxDigits = mask
        ? mask.split('').filter((c) => c === '.').length
        : 15;

      if (rawDigits.length > maxDigits) return;

      const formattedValue = applyPhoneMask(rawDigits, mask);
      setInputValue(formattedValue);

      if (onChange) {
        const syntheticEvent = {
          ...e,
          target: { ...e.target, value: formattedValue }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    const handleCountrySelect = (countryValue: string) => {
      const country = availableCountries.find((c) => c.value === countryValue);
      if (country) {
        setSelectedCountry(country);
        setIsOpen(false);
        setSearchQuery('');
        const rawDigits = inputValue.replace(/\D/g, '');
        const mask = phoneMasks[country.value.toUpperCase()];
        setInputValue(applyPhoneMask(rawDigits, mask));
      }
    };

    return (
      <Flex css={inputStyles.root} width="280px" ref={triggerRef as any}>
        {(label || subtext) && (
          <Flex direction="column" gap="1">
            {label && (
              <Flex align="center" gap="1">
                <Text css={inputStyles.label}>{label}</Text>
                {isRequired && (
                  <Text fontSize="sm" color="red.200" aria-hidden="true">
                    *
                  </Text>
                )}
                {optionalText && !isRequired && (
                  <Text fontSize="sm" color="gray.400">
                    {optionalText}
                  </Text>
                )}
              </Flex>
            )}
            {subtext && <Text css={inputStyles.subtext}>{subtext}</Text>}
          </Flex>
        )}

        <Flex
          css={layoutStyles.wrapper}
          aria-disabled={disabled}
          data-invalid={hasError ? '' : undefined}
        >
          <Box
            as="button"
            css={layoutStyles.trigger}
            aria-disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
          >
            <Box
              className={`fflag fflag-${selectedCountry.code} ff-md`}
              width="24px"
              height="24px"
              opacity={disabled ? 0.4 : 1}
            />
            <Box css={layoutStyles.triggerIcon}>
              <ChevronDownIcon />
            </Box>
            <Box css={layoutStyles.divider} />
            <Text css={layoutStyles.dialCode}>{selectedCountry.dialCode}</Text>
          </Box>

          <PhoneInputDropdown
            isOpen={isOpen}
            filteredOptions={filteredCountries}
            selectedValue={selectedCountry.value}
            focusedIndex={focusedIndex}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelect={handleCountrySelect}
            onFocusIndex={setFocusedIndex}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setFocusedIndex((prev) =>
                  Math.min(prev + 1, filteredCountries.length - 1)
                );
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setFocusedIndex((prev) => Math.max(prev - 1, 0));
              } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredCountries[focusedIndex])
                  handleCountrySelect(filteredCountries[focusedIndex].value);
              } else if (e.key === 'Escape') {
                setIsOpen(false);
              }
            }}
            onClose={() => setIsOpen(false)}
            searchInputRef={searchInputRef}
            triggerRef={triggerRef}
            styles={dropdownStyles}
          />

          <Box
            as="input"
            ref={ref}
            css={layoutStyles.nativeInput}
            aria-invalid={hasError}
            disabled={disabled}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder="(123) 456 78 90"
            {...(props as any)}
          />
        </Flex>

        {(supportingText || error) && (
          <Flex align="center" gap="1" mt="1">
            {hasError && (
              <Box
                color="red.200"
                display="flex"
                aria-hidden="true"
                width="16px"
                height="16px"
              >
                <ErrorCircleIcon />
              </Box>
            )}
            <Text
              fontSize="13px"
              color={hasError ? 'red.200' : 'gray.600'}
              fontWeight={hasError ? 'medium' : 'normal'}
            >
              {error || supportingText}
            </Text>
          </Flex>
        )}
      </Flex>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';
