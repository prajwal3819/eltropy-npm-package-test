import { Flex, Box, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '../../../../assets/icons';
import ChevronDownIcon from '../../../../assets/icons/chevron-down';

interface CalendarHeaderProps {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onMonthClick?: () => void;
  onYearClick?: () => void;
  showNavigation?: boolean;
  isMobile?: boolean;
  months: string[];
  showMonthDropdown?: boolean;
  showYearDropdown?: boolean;
}

export const CalendarHeader = ({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  onMonthClick,
  onYearClick,
  showNavigation = true,
  isMobile,
  months,
  showMonthDropdown = false,
  showYearDropdown = true,
}: CalendarHeaderProps) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      pb="16px"
      borderBottom={isMobile ? '1px solid #D9D9DE' : ''}
    >
      <Box as="span" srOnly aria-live="polite" aria-atomic="true">
        {months[month]} {year}
      </Box>
      <Flex alignItems="center" gap="8px">
        <Flex
          alignItems="center"
          gap="4px"
          cursor={showMonthDropdown && onMonthClick ? 'pointer' : 'default'}
          _hover={
            showMonthDropdown && onMonthClick ? { color: 'navyGray.500' } : {}
          }
          onClick={showMonthDropdown ? onMonthClick : undefined}
        >
          <Text
            fontSize={isMobile ? '18px' : '14px'}
            fontWeight="500"
            color="navyGray.700"
          >
            {months[month]}
          </Text>
          {showMonthDropdown && (
            <Box
              as={ChevronDownIcon}
              width="16px"
              height="16px"
              color="navyGray.700"
            />
          )}
        </Flex>
        <Flex
          alignItems="center"
          gap="4px"
          cursor={showYearDropdown && onYearClick ? 'pointer' : 'default'}
          _hover={
            showYearDropdown && onYearClick ? { color: 'navyGray.500' } : {}
          }
          onClick={showYearDropdown ? onYearClick : undefined}
        >
          <Text
            fontSize={isMobile ? '18px' : '14px'}
            fontWeight="500"
            color="navyGray.700"
          >
            {year}
          </Text>
          {showYearDropdown && (
            <Box
              as={ChevronDownIcon}
              width="16px"
              height="16px"
              color="navyGray.700"
            />
          )}
        </Flex>
      </Flex>

      {showNavigation && (
        <Flex alignItems="center" gap="8px">
          <Box
            as="button"
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="24px"
            height="24px"
            bg="transparent"
            border="none"
            cursor="pointer"
            color="navyGray.700"
            padding="0"
            _hover={{ color: 'navyGray.500' }}
            onClick={onPrevMonth}
            aria-label="Previous month"
          >
            <ChevronLeftIcon width="20px" height="20px" />
          </Box>
          <Box
            as="button"
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="24px"
            height="24px"
            bg="transparent"
            border="none"
            cursor="pointer"
            color="navyGray.700"
            padding="0"
            _hover={{ color: 'navyGray.500' }}
            onClick={onNextMonth}
            aria-label="Next month"
          >
            <ChevronRightIcon width="20px" height="20px" />
          </Box>
        </Flex>
      )}
    </Flex>
  );
};
