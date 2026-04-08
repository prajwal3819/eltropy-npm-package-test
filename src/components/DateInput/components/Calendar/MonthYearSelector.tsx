import { Grid, Flex } from '@chakra-ui/react';

interface MonthSelectorProps {
  currentMonth: number;
  onMonthSelect: (month: number) => void;
  monthsShort: string[];
}

export const MonthSelector = ({
  currentMonth,
  onMonthSelect,
  monthsShort,
}: MonthSelectorProps) => {
  const handleKeyDown = (e: React.KeyboardEvent, month: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onMonthSelect(month);
    }
  };
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap="16px" py="8px">
      {monthsShort.map((month, index) => (
        <Flex
          as="button"
          key={month}
          alignItems="center"
          justifyContent="center"
          height="48px"
          fontSize="14px"
          fontWeight={index === currentMonth ? 'medium' : 'regular'}
          color="navyGray.700"
          textAlign="center"
          borderRadius="4px"
          cursor="pointer"
          transition="all 0.2s"
          bg={index === currentMonth ? 'green.50' : 'transparent'}
          borderWidth={index === currentMonth ? '1px' : '0'}
          borderStyle="solid"
          borderColor={index === currentMonth ? 'green.200' : 'transparent'}
          _hover={{ bg: index === currentMonth ? 'green.50' : 'gray.50' }}
          onClick={() => onMonthSelect(index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          role="button"
          tabIndex={0}
          aria-label={`Select ${month}`}
          aria-pressed={index === currentMonth}
        >
          {month}
        </Flex>
      ))}
    </Grid>
  );
};

interface YearSelectorProps {
  currentYear: number;
  yearRangeStart: number;
  onYearSelect: (year: number) => void;
}

export const YearSelector = ({
  currentYear,
  yearRangeStart,
  onYearSelect,
}: YearSelectorProps) => {
  const years = Array.from({ length: 12 }, (_, i) => yearRangeStart + i);

  const handleKeyDown = (e: React.KeyboardEvent, year: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onYearSelect(year);
    }
  };

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap="16px" py="8px">
      {years.map((year) => (
        <Flex
          as="button"
          key={year}
          alignItems="center"
          justifyContent="center"
          height="48px"
          fontSize="14px"
          fontWeight={year === currentYear ? 'medium' : 'regular'}
          color="navyGray.700"
          textAlign="center"
          borderRadius="4px"
          cursor="pointer"
          transition="all 0.2s"
          bg={year === currentYear ? 'green.50' : 'transparent'}
          borderWidth={year === currentYear ? '1px' : '0'}
          borderStyle="solid"
          borderColor={year === currentYear ? 'green.200' : 'transparent'}
          _hover={{ bg: year === currentYear ? 'green.50' : 'gray.50' }}
          onClick={() => onYearSelect(year)}
          onKeyDown={(e) => handleKeyDown(e, year)}
          role="button"
          tabIndex={0}
          aria-label={`Select year ${year}`}
          aria-pressed={year === currentYear}
        >
          {year}
        </Flex>
      ))}
    </Grid>
  );
};
