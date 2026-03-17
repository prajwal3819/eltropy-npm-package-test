import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent
} from 'react';
import { Box, chakra, useSlotRecipe } from '@chakra-ui/react';
import type { HTMLChakraProps, SystemStyleObject } from '@chakra-ui/react';
import { paginationRecipe } from '../../theme/recipes/pagination.recipe';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ErrorExclamationIcon
} from '../../assets/icons';

export type PaginationVariant = 'desktop' | 'mobile';
export type ItemsPerPageDropdownPosition = 'auto' | 'top' | 'bottom';

export interface PaginationProps extends Omit<
  HTMLChakraProps<'nav'>,
  'onChange' | 'page'
> {
  /** Current page (1-based). Values outside range are clamped safely. */
  page: number;
  /** Total number of pages. Values <= 0 are treated as 1. */
  totalPages: number;
  /** Fired when user requests a new page (1-based). */
  onPageChange: (page: number) => void;

  /** Pages shown on each side of the current page before collapsing with ellipsis. */
  siblingCount?: number;
  /** Pages always shown at the start and end of the list. */
  boundaryCount?: number;

  /** Disable all interactions (prev/next, page buttons, dropdown, go-to input). */
  disabled?: boolean;

  /** Show "Items per page" dropdown (desktop only). */
  showItemsPerPage?: boolean;
  /** Current items-per-page value (used when showItemsPerPage is true). */
  itemsPerPage?: number;
  /** Options shown in the items-per-page dropdown. */
  itemsPerPageOptions?: number[];
  /** Fired when an items-per-page option is selected. */
  onItemsPerPageChange?: (itemsPerPage: number) => void;

  /** Show "Go to" page input (desktop only). */
  showGoTo?: boolean;
  /** Placeholder text for the "Go to" input. */
  goToPlaceholder?: string;

  /** Visual variant: desktop (default) or mobile (compact). */
  variant?: PaginationVariant;

  /**
   * Items-per-page dropdown placement:
   * - auto: decide based on available viewport space
   * - top: always open above the trigger
   * - bottom: always open below the trigger
   */
  itemsPerPageDropdownPosition?: ItemsPerPageDropdownPosition;
}

type PageItem =
  | { type: 'page'; value: number }
  | { type: 'ellipsis'; position: 'start' | 'end' };

type DropdownDirection = 'bottom' | 'top';

const FULL_SIZE_ICON_STYLE = { width: '100%', height: '100%' } as const;
const MOBILE_ICON_STYLE = { width: '24px', height: '24px' } as const;

const GO_TO_INPUT_WRAPPER_CSS: SystemStyleObject = { position: 'relative' };

const GO_TO_ERROR_MESSAGE_CSS: SystemStyleObject = {
  position: 'absolute',
  top: '100%',
  left: 0,
  marginTop: '4px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  whiteSpace: 'nowrap'
};

const GO_TO_ERROR_TEXT_CSS: SystemStyleObject = {
  fontSize: '12px',
  fontWeight: 'regular',
  lineHeight: '16px',
  color: 'red.200'
};

const GO_TO_ERROR_ICON_STYLE = {
  width: '16px',
  height: '16px',
  flexShrink: 0
} as const;

const ITEMS_PER_PAGE_VALUE_TEXT_CSS = {
  flex: 1,
  textAlign: 'left'
} as const;

const ITEMS_PER_PAGE_DROPDOWN_WRAPPER_CSS = {
  position: 'relative'
} as const;

const MOBILE_ROOT_CSS: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px'
};

const MOBILE_PAGE_LIST_CSS: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px'
};

const normalizeNonNegativeInteger = (
  numericValue: number,
  fallbackValue: number
): number => {
  if (!Number.isFinite(numericValue)) return fallbackValue;

  const flooredValue = Math.floor(numericValue);
  if (flooredValue < 0) return fallbackValue;

  return flooredValue;
};

const normalizePositiveInteger = (
  numericValue: number,
  fallbackValue: number
): number => {
  const normalizedNonNegativeInteger = normalizeNonNegativeInteger(
    numericValue,
    fallbackValue
  );

  if (normalizedNonNegativeInteger < 1) return fallbackValue;
  return normalizedNonNegativeInteger;
};

const clampPageWithinRange = (
  pageValue: number,
  totalPagesValue: number
): number => {
  const lowerBoundedValue = Math.max(1, pageValue);
  return Math.min(lowerBoundedValue, totalPagesValue);
};

const generatePageRange = (
  currentPage: number,
  totalPages: number,
  siblingCount: number,
  boundaryCount: number
): PageItem[] => {
  const clampedTotalPages = Math.max(1, totalPages);
  const clampedCurrentPage = clampPageWithinRange(
    currentPage,
    clampedTotalPages
  );

  if (clampedTotalPages <= 1) {
    return [{ type: 'page', value: 1 }];
  }

  const totalPageNumbersToShow = boundaryCount * 2 + siblingCount * 2 + 3;

  if (clampedTotalPages <= totalPageNumbersToShow) {
    return Array.from(
      { length: clampedTotalPages },
      (_unusedValue, pageIndex) => {
        return { type: 'page', value: pageIndex + 1 };
      }
    );
  }

  const leftSiblingPage = Math.max(
    clampedCurrentPage - siblingCount,
    boundaryCount + 1
  );
  const rightSiblingPage = Math.min(
    clampedCurrentPage + siblingCount,
    clampedTotalPages - boundaryCount
  );

  const shouldShowLeftEllipsis = leftSiblingPage > boundaryCount + 2;
  const shouldShowRightEllipsis =
    rightSiblingPage < clampedTotalPages - boundaryCount - 1;

  const pageItems: PageItem[] = [];

  for (
    let boundaryPageNumber = 1;
    boundaryPageNumber <= boundaryCount;
    boundaryPageNumber++
  ) {
    pageItems.push({ type: 'page', value: boundaryPageNumber });
  }

  if (shouldShowLeftEllipsis) {
    pageItems.push({ type: 'ellipsis', position: 'start' });
  } else {
    for (
      let boundaryAdjacentPageNumber = boundaryCount + 1;
      boundaryAdjacentPageNumber < leftSiblingPage;
      boundaryAdjacentPageNumber++
    ) {
      pageItems.push({ type: 'page', value: boundaryAdjacentPageNumber });
    }
  }

  for (
    let siblingPageNumber = leftSiblingPage;
    siblingPageNumber <= rightSiblingPage;
    siblingPageNumber++
  ) {
    pageItems.push({ type: 'page', value: siblingPageNumber });
  }

  if (shouldShowRightEllipsis) {
    pageItems.push({ type: 'ellipsis', position: 'end' });
  } else {
    for (
      let trailingPageNumber = rightSiblingPage + 1;
      trailingPageNumber <= clampedTotalPages - boundaryCount;
      trailingPageNumber++
    ) {
      pageItems.push({ type: 'page', value: trailingPageNumber });
    }
  }

  for (
    let endingBoundaryPageNumber = clampedTotalPages - boundaryCount + 1;
    endingBoundaryPageNumber <= clampedTotalPages;
    endingBoundaryPageNumber++
  ) {
    if (endingBoundaryPageNumber > boundaryCount) {
      pageItems.push({ type: 'page', value: endingBoundaryPageNumber });
    }
  }

  return pageItems;
};

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      page,
      totalPages,
      onPageChange,
      siblingCount = 1,
      boundaryCount = 1,
      disabled = false,
      showItemsPerPage = false,
      itemsPerPage = 10,
      itemsPerPageOptions = [5, 10, 15, 20, 25],
      onItemsPerPageChange,
      showGoTo = false,
      goToPlaceholder = 'e.g. 102',
      variant = 'desktop',
      itemsPerPageDropdownPosition = 'auto',
      ...restProps
    },
    forwardedRef
  ) => {
    const [goToValue, setGoToValue] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [goToError, setGoToError] = useState(false);
    const [dropdownDirection, setDropdownDirection] =
      useState<DropdownDirection>('bottom');

    const dropdownAnchorRef = useRef<HTMLDivElement>(null);
    const dropdownCloseTimeoutRef = useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

    useEffect(() => {
      return () => {
        if (dropdownCloseTimeoutRef.current !== null) {
          clearTimeout(dropdownCloseTimeoutRef.current);
        }
      };
    }, []);

    const slotRecipeFunction = useSlotRecipe({ recipe: paginationRecipe });
    const baseSlotStyles = slotRecipeFunction({});
    const activePageStyles = slotRecipeFunction({ pageState: 'active' });
    const disabledNavStyles = slotRecipeFunction({ navState: 'disabled' });

    const normalizedTotalPages = normalizePositiveInteger(totalPages, 1);
    const normalizedRequestedPage = normalizePositiveInteger(page, 1);
    const normalizedCurrentPage = clampPageWithinRange(
      normalizedRequestedPage,
      normalizedTotalPages
    );

    const normalizedSiblingCount = normalizeNonNegativeInteger(siblingCount, 1);
    const normalizedBoundaryCount = normalizeNonNegativeInteger(
      boundaryCount,
      1
    );

    const pageItems = useMemo(() => {
      return generatePageRange(
        normalizedCurrentPage,
        normalizedTotalPages,
        normalizedSiblingCount,
        normalizedBoundaryCount
      );
    }, [
      normalizedCurrentPage,
      normalizedTotalPages,
      normalizedSiblingCount,
      normalizedBoundaryCount
    ]);

    const isFirstPage = normalizedCurrentPage === 1;
    const isLastPage = normalizedCurrentPage === normalizedTotalPages;
    const isPreviousDisabled = disabled || isFirstPage;
    const isNextDisabled = disabled || isLastPage;

    const previousNavSlotStyles = isPreviousDisabled
      ? disabledNavStyles
      : baseSlotStyles;
    const nextNavSlotStyles = isNextDisabled
      ? disabledNavStyles
      : baseSlotStyles;

    const fullSizeIconStyle = FULL_SIZE_ICON_STYLE;
    const mobileIconStyle = MOBILE_ICON_STYLE;

    const isMobileVariant = variant === 'mobile';
    const shouldRenderItemsPerPage = showItemsPerPage === true;
    const shouldRenderGoTo = showGoTo === true;

    const pageButtonTabIndex = disabled ? -1 : 0;
    const isEllipsisAriaHidden = true;

    const itemsPerPageValueTextCss = ITEMS_PER_PAGE_VALUE_TEXT_CSS;
    const itemsPerPageDropdownWrapperCss = ITEMS_PER_PAGE_DROPDOWN_WRAPPER_CSS;

    const resolveDropdownDirection = (): DropdownDirection => {
      if (itemsPerPageDropdownPosition === 'top') return 'top';
      if (itemsPerPageDropdownPosition === 'bottom') return 'bottom';

      const dropdownAnchorElement = dropdownAnchorRef.current;
      if (!dropdownAnchorElement) return 'bottom';

      if (typeof window === 'undefined') return 'bottom';

      const anchorRect = dropdownAnchorElement.getBoundingClientRect();
      const availableSpaceBelow = window.innerHeight - anchorRect.bottom;
      const availableSpaceAbove = anchorRect.top;

      const shouldOpenUpward =
        availableSpaceBelow < 200 && availableSpaceAbove > availableSpaceBelow;

      return shouldOpenUpward ? 'top' : 'bottom';
    };

    const requestPageChange = (nextPage: number): void => {
      if (disabled) return;
      if (nextPage < 1) return;
      if (nextPage > normalizedTotalPages) return;
      if (nextPage === normalizedCurrentPage) return;

      onPageChange(nextPage);
    };

    const handlePreviousClick = (event: ReactMouseEvent<HTMLElement>): void => {
      event.preventDefault();
      if (isPreviousDisabled) return;

      requestPageChange(normalizedCurrentPage - 1);
    };

    const handleNextClick = (event: ReactMouseEvent<HTMLElement>): void => {
      event.preventDefault();
      if (isNextDisabled) return;

      requestPageChange(normalizedCurrentPage + 1);
    };

    const handlePageButtonClick = (
      event: ReactMouseEvent<HTMLElement>
    ): void => {
      event.preventDefault();
      if (disabled) return;

      const pageValue = event.currentTarget.getAttribute('data-page') ?? '';
      const parsedPageNumber = Number.parseInt(pageValue, 10);
      if (Number.isNaN(parsedPageNumber)) return;

      requestPageChange(parsedPageNumber);
    };

    const handlePageKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
      const pressedKey = event.key;
      const isEnterKey = pressedKey === 'Enter';
      const isSpaceKey =
        pressedKey === ' ' ||
        pressedKey === 'Spacebar' ||
        pressedKey === 'Space';

      if (!isEnterKey && !isSpaceKey) return;

      event.preventDefault();
      if (disabled) return;

      const pageValue = event.currentTarget.getAttribute('data-page') ?? '';
      const parsedPageNumber = Number.parseInt(pageValue, 10);
      if (Number.isNaN(parsedPageNumber)) return;

      requestPageChange(parsedPageNumber);
    };

    const handleGoToChange = (event: ChangeEvent<HTMLInputElement>): void => {
      const nextValue = event.target.value;

      const isEmptyValue = nextValue === '';
      const isDigitsOnlyValue = /^\d+$/.test(nextValue);

      if (!isEmptyValue && !isDigitsOnlyValue) return;

      setGoToValue(nextValue);

      if (goToError) {
        setGoToError(false);
      }
    };

    const handleGoToKeyDown = (
      event: KeyboardEvent<HTMLInputElement>
    ): void => {
      if (event.key !== 'Enter') return;

      event.preventDefault();

      const parsedPageNumber = Number.parseInt(goToValue, 10);

      const isValidPageNumber =
        !Number.isNaN(parsedPageNumber) &&
        parsedPageNumber >= 1 &&
        parsedPageNumber <= normalizedTotalPages;

      if (isValidPageNumber) {
        requestPageChange(parsedPageNumber);
        setGoToValue('');
        setGoToError(false);
        return;
      }

      const shouldShowError = goToValue !== '';
      if (shouldShowError) {
        setGoToError(true);
      }
    };

    const handleItemsPerPageOptionClick = (
      event: ReactMouseEvent<HTMLElement>
    ): void => {
      const optionValueText =
        event.currentTarget.getAttribute('data-items-per-page') ?? '';
      const parsedOptionValue = Number.parseInt(optionValueText, 10);
      if (Number.isNaN(parsedOptionValue)) return;

      setIsDropdownOpen(false);

      if (onItemsPerPageChange) {
        onItemsPerPageChange(parsedOptionValue);
      }
    };

    const handleDropdownToggle = (): void => {
      const nextDirection = resolveDropdownDirection();
      setDropdownDirection(nextDirection);

      setIsDropdownOpen((previousIsDropdownOpen) => {
        return !previousIsDropdownOpen;
      });
    };

    const handleDropdownBlur = useCallback((): void => {
      const closeDelayMilliseconds = 150;

      if (typeof window === 'undefined') {
        setIsDropdownOpen(false);
        return;
      }

      if (dropdownCloseTimeoutRef.current !== null) {
        clearTimeout(dropdownCloseTimeoutRef.current);
      }

      dropdownCloseTimeoutRef.current = setTimeout(() => {
        dropdownCloseTimeoutRef.current = null;
        setIsDropdownOpen(false);
      }, closeDelayMilliseconds);
    }, []);

    const dropdownPlacementCss =
      dropdownDirection === 'top'
        ? { bottom: '100%', marginBottom: '4px' }
        : { top: '100%', marginTop: '4px' };

    const itemsPerPageDropdownListCss: SystemStyleObject = {
      position: 'absolute',
      ...dropdownPlacementCss,
      left: 0,
      right: 0,
      backgroundColor: 'base.white',
      borderRadius: '8px',
      boxShadow: '0px 7px 15px 0px rgba(30, 31, 33, 0.1)',
      padding: '4px',
      zIndex: 10,
      overflow: 'hidden'
    };

    const previousNavigationButtonCss: SystemStyleObject = isPreviousDisabled
      ? {
          ...((baseSlotStyles.navButton as SystemStyleObject) ?? {}),
          cursor: 'not-allowed',
          pointerEvents: 'none'
        }
      : (((baseSlotStyles.navButton as SystemStyleObject) ??
          {}) as SystemStyleObject);

    const nextNavigationButtonCss: SystemStyleObject = isNextDisabled
      ? {
          ...((baseSlotStyles.navButton as SystemStyleObject) ?? {}),
          cursor: 'not-allowed',
          pointerEvents: 'none'
        }
      : (((baseSlotStyles.navButton as SystemStyleObject) ??
          {}) as SystemStyleObject);

    const goToLabelCss: SystemStyleObject = disabled
      ? {
          ...((baseSlotStyles.goToLabel as SystemStyleObject) ?? {}),
          color: 'gray.400'
        }
      : (((baseSlotStyles.goToLabel as SystemStyleObject) ??
          {}) as SystemStyleObject);

    const goToInputWrapperCss = GO_TO_INPUT_WRAPPER_CSS;

    const goToInputCss: SystemStyleObject = {
      ...((baseSlotStyles.goToInput as SystemStyleObject) ?? {}),
      backgroundColor: disabled ? 'gray.200' : 'base.white',
      borderColor: goToError ? 'red.200' : 'gray.200',
      color: disabled ? 'gray.400' : 'navyGray.700',
      opacity: disabled ? 0.9 : 1
    };

    const goToErrorIconStyle = GO_TO_ERROR_ICON_STYLE;
    const goToErrorMessageCss = GO_TO_ERROR_MESSAGE_CSS;
    const goToErrorTextCss = GO_TO_ERROR_TEXT_CSS;

    const pageListItemNodes = pageItems.map((item) => {
      if (item.type === 'ellipsis') {
        return (
          <Box
            key={`ellipsis-${item.position}`}
            css={baseSlotStyles.ellipsis}
            aria-hidden={isEllipsisAriaHidden}
          >
            ..
          </Box>
        );
      }

      const isCurrentPage = item.value === normalizedCurrentPage;
      const pageButtonSlotStyles = isCurrentPage
        ? activePageStyles
        : baseSlotStyles;

      const pageItemCss =
        (pageButtonSlotStyles.pageItem as SystemStyleObject) ?? {};
      const resolvedPageItemCss: SystemStyleObject = disabled
        ? {
            ...pageItemCss,
            cursor: 'not-allowed',
            pointerEvents: 'none'
          }
        : pageItemCss;

      const ariaCurrentValue = isCurrentPage ? 'page' : undefined;

      return (
        <Box
          as="button"
          key={`page-${item.value}`}
          css={resolvedPageItemCss}
          onClick={handlePageButtonClick}
          onKeyDown={handlePageKeyDown}
          data-page={item.value}
          aria-label={`Go to page ${item.value}`}
          aria-current={ariaCurrentValue}
          aria-disabled={disabled}
          tabIndex={pageButtonTabIndex}
        >
          {item.value}
        </Box>
      );
    });

    const itemsPerPageOptionNodes = itemsPerPageOptions.map((optionValue) => {
      const isSelectedOption = optionValue === itemsPerPage;

      const optionCss: SystemStyleObject = {
        display: 'block',
        width: '100%',
        padding: '8px 4px',
        textAlign: 'center',
        fontSize: '14px',
        color: 'navyGray.700',
        fontWeight: 'regular',
        backgroundColor: isSelectedOption ? 'gray.100' : 'transparent',
        borderRadius: isSelectedOption ? '4px' : '0',
        border: 'none',
        cursor: 'pointer',
        _hover: {
          backgroundColor: 'gray.50'
        }
      };

      return (
        <Box
          key={optionValue}
          as="button"
          role="option"
          aria-selected={isSelectedOption}
          css={optionCss}
          onClick={handleItemsPerPageOptionClick}
          data-items-per-page={optionValue}
        >
          {optionValue}
        </Box>
      );
    });

    const itemsPerPageNode = shouldRenderItemsPerPage ? (
      <Box css={baseSlotStyles.itemsPerPageContainer}>
        <Box as="span" css={baseSlotStyles.itemsPerPageLabel}>
          Items per page
        </Box>
        <Box ref={dropdownAnchorRef} css={itemsPerPageDropdownWrapperCss}>
          <Box
            as="button"
            css={baseSlotStyles.itemsPerPageDropdown}
            onClick={handleDropdownToggle}
            onBlur={handleDropdownBlur}
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
            aria-label={`Items per page: ${itemsPerPage}`}
          >
            <Box as="span" css={itemsPerPageValueTextCss}>
              {itemsPerPage}
            </Box>
            <Box css={baseSlotStyles.itemsPerPageDropdownIcon}>
              <ChevronDownIcon style={fullSizeIconStyle} aria-hidden="true" />
            </Box>
          </Box>

          {isDropdownOpen ? (
            <Box css={itemsPerPageDropdownListCss} role="listbox">
              {itemsPerPageOptionNodes}
            </Box>
          ) : null}
        </Box>
      </Box>
    ) : null;

    const goToErrorMessageNode = goToError ? (
      <Box id="go-to-error" css={goToErrorMessageCss} role="alert">
        <Box as="span" css={{ display: 'inline-flex', color: 'navyGray.700' }}>
          <ErrorExclamationIcon style={goToErrorIconStyle} aria-hidden="true" />
        </Box>
        <Box as="span" css={goToErrorTextCss}>
          Wrong input
        </Box>
      </Box>
    ) : null;

    const goToNode = shouldRenderGoTo ? (
      <Box css={baseSlotStyles.goToContainer}>
        <Box as="span" css={goToLabelCss}>
          Go to
        </Box>
        <Box css={goToInputWrapperCss}>
          <chakra.input
            type="text"
            inputMode="numeric"
            placeholder={goToPlaceholder}
            value={goToValue}
            onChange={handleGoToChange}
            onKeyDown={handleGoToKeyDown}
            aria-label="Go to page number"
            aria-invalid={goToError}
            aria-describedby={goToError ? 'go-to-error' : undefined}
            disabled={disabled}
            css={goToInputCss}
          />
          {goToErrorMessageNode}
        </Box>
      </Box>
    ) : null;

    if (isMobileVariant) {
      const mobileRootCss = MOBILE_ROOT_CSS;
      const mobilePageListCss = MOBILE_PAGE_LIST_CSS;

      const mobilePreviousButtonCss: SystemStyleObject = {
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: isPreviousDisabled ? 'not-allowed' : 'pointer',
        pointerEvents: isPreviousDisabled ? 'none' : 'auto',
        color: isPreviousDisabled ? 'gray.300' : 'gray.600'
      };

      const mobileNextButtonCss: SystemStyleObject = {
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: isNextDisabled ? 'not-allowed' : 'pointer',
        pointerEvents: isNextDisabled ? 'none' : 'auto',
        color: isNextDisabled ? 'gray.300' : 'gray.600'
      };

      return (
        <Box
          as="nav"
          ref={forwardedRef}
          css={mobileRootCss}
          aria-label="Pagination"
          {...restProps}
        >
          <Box
            as="button"
            css={mobilePreviousButtonCss}
            onClick={handlePreviousClick}
            aria-label="Previous page"
            aria-disabled={isPreviousDisabled}
          >
            <ChevronLeftIcon style={mobileIconStyle} aria-hidden="true" />
          </Box>

          <Box css={mobilePageListCss} role="list">
            {pageListItemNodes}
          </Box>

          <Box
            as="button"
            css={mobileNextButtonCss}
            onClick={handleNextClick}
            aria-label="Next page"
            aria-disabled={isNextDisabled}
          >
            <ChevronRightIcon style={mobileIconStyle} aria-hidden="true" />
          </Box>
        </Box>
      );
    }

    return (
      <Box
        as="nav"
        ref={forwardedRef}
        css={baseSlotStyles.root}
        aria-label="Pagination"
        {...restProps}
      >
        <Box css={baseSlotStyles.leftSection}>{itemsPerPageNode}</Box>

        <Box css={baseSlotStyles.rightSection}>
          {goToNode}

          <Box css={baseSlotStyles.paginationBase}>
            <Box
              as="button"
              css={previousNavigationButtonCss}
              onClick={handlePreviousClick}
              aria-label="Previous page"
              aria-disabled={isPreviousDisabled}
            >
              <Box css={previousNavSlotStyles.navIcon}>
                <ChevronLeftIcon style={fullSizeIconStyle} aria-hidden="true" />
              </Box>
              <Box css={previousNavSlotStyles.navText}>Previous</Box>
            </Box>

            <Box css={baseSlotStyles.pageList} role="list">
              {pageListItemNodes}
            </Box>

            <Box
              as="button"
              css={nextNavigationButtonCss}
              onClick={handleNextClick}
              aria-label="Next page"
              aria-disabled={isNextDisabled}
            >
              <Box css={nextNavSlotStyles.navText}>Next</Box>
              <Box css={nextNavSlotStyles.navIcon}>
                <ChevronRightIcon
                  style={fullSizeIconStyle}
                  aria-hidden="true"
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
);

Pagination.displayName = 'Pagination';
