import {
  forwardRef,
  useEffect,
  useRef,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref
} from 'react';
import { Box, useSlotRecipe, type HTMLChakraProps } from '@chakra-ui/react';
import type { SystemStyleObject } from '@chakra-ui/react';
import { tableRecipe } from '../../theme/recipes/table.recipe';
import { SortIcon } from '../../assets/icons';

export type TableSortDirection = 'asc' | 'desc' | 'none';

export interface TableColumn<T = Record<string, unknown>> {
  /** Unique column identifier (used for sorting and default cell access). */
  id: string;
  /** Header text label. */
  header: string;

  /** Header visual type: text (default), icon, or checkbox. */
  headerType?: 'text' | 'icon' | 'checkbox';

  /** Fixed width for this column (CSS length). */
  width?: string;
  /** Minimum width for this column (CSS length). */
  minWidth?: string;

  /** Whether this column is sticky (position: sticky). */
  sticky?: boolean;
  /** Sticky left offset when sticky is true (CSS length). */
  stickyLeft?: string;

  /** Whether this column can be sorted. Defaults to true for text columns. */
  sortable?: boolean;

  /** Custom cell renderer. If omitted, falls back to row[column.id]. */
  cell?: (row: T, rowIndex: number) => ReactNode;
}

export interface TableProps<T = Record<string, unknown>> extends Omit<
  HTMLChakraProps<'div'>,
  'children' | 'columns'
> {
  /** Table column definitions. */
  columns: TableColumn<T>[];
  /** Table row data. */
  data: T[];

  /** Currently sorted column id (when sorting is controlled). */
  sortColumnId?: string;
  /** Current sort direction (when sorting is controlled). */
  sortDirection?: TableSortDirection;
  /** Fired when user requests sorting for a column id. */
  onSort?: (columnId: string) => void;

  /** Controlled selected row indexes (0-based). */
  selectedRows?: Set<number>;
  /** Fired when a single row selection changes. */
  onRowSelect?: (rowIndex: number, selected: boolean) => void;
  /** Fired when header select-all changes. */
  onSelectAll?: (selected: boolean) => void;

  /** Optional footer slot rendered below the table (e.g., Pagination). */
  footer?: ReactNode;

  /** Enable horizontal scrolling wrapper. */
  horizontalScroll?: boolean;

  /** Accessible table caption (visually hidden). */
  caption?: string;

  /** Provide a stable row key for React rendering. Defaults to row index. */
  getRowKey?: (row: T, index: number) => string | number;
}

interface InternalCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  ariaLabel: string;
  disabled?: boolean;
  rowIndex?: number;
  onCheckedChange: (checked: boolean, rowIndex: number | undefined) => void;
}

function InternalCheckbox({
  checked,
  indeterminate = false,
  ariaLabel,
  disabled = false,
  rowIndex,
  onCheckedChange
}: InternalCheckboxProps): ReactElement {
  const inputElementRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!inputElementRef.current) return;
    inputElementRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onCheckedChange(event.target.checked, rowIndex);
  };

  return (
    <Box
      as="label"
      css={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        flexShrink: 0,
        accentColor: 'navyGray.700'
      }}
    >
      <input
        ref={inputElementRef}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        aria-label={ariaLabel}
        disabled={disabled}
        style={{
          width: '20px',
          height: '20px',
          margin: 0,
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
      />
    </Box>
  );
}

function TableInner<T extends Record<string, unknown>>(
  {
    columns,
    data,
    sortColumnId,
    sortDirection = 'none',
    onSort,
    selectedRows,
    onRowSelect,
    onSelectAll,
    footer,
    horizontalScroll: _horizontalScroll = false,
    caption,
    getRowKey,
    ...restProps
  }: TableProps<T>,
  ref: Ref<HTMLDivElement>
): ReactElement | null {
  const slotRecipeFunction = useSlotRecipe({ recipe: tableRecipe });
  const slotStyles = slotRecipeFunction({}) as Record<
    string,
    SystemStyleObject
  >;

  const hasCheckboxColumn = columns.some(
    (column) => column.headerType === 'checkbox'
  );

  const hasRows = data.length > 0;

  const selectedRowCount = selectedRows
    ? data.reduce((count, _row, rowIndex) => {
        return count + (selectedRows.has(rowIndex) ? 1 : 0);
      }, 0)
    : 0;

  const canComputeSelectionState = Boolean(selectedRows) && hasRows;
  const allSelected =
    canComputeSelectionState && selectedRowCount === data.length;
  const someSelected =
    canComputeSelectionState &&
    selectedRowCount > 0 &&
    selectedRowCount < data.length;

  const resolveRowKey = (row: T, rowIndex: number): string | number => {
    return getRowKey ? getRowKey(row, rowIndex) : rowIndex;
  };

  const handleSortableHeaderClick = (
    event: ReactMouseEvent<HTMLElement>
  ): void => {
    if (!onSort) return;

    const columnId = event.currentTarget.getAttribute('data-column-id') ?? '';
    if (columnId === '') return;

    onSort(columnId);
  };

  const handleSortableHeaderKeyDown = (
    event: KeyboardEvent<HTMLElement>
  ): void => {
    if (!onSort) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();

    const columnId = event.currentTarget.getAttribute('data-column-id') ?? '';
    if (columnId === '') return;

    onSort(columnId);
  };

  const handleSelectAllCheckedChange = (
    checked: boolean,
    _rowIndex: number | undefined
  ): void => {
    if (!onSelectAll) return;
    onSelectAll(checked);
  };

  const handleRowCheckedChange = (
    checked: boolean,
    rowIndex: number | undefined
  ): void => {
    if (!onRowSelect) return;
    if (rowIndex === undefined) return;

    onRowSelect(rowIndex, checked);
  };

  const captionNode = caption ? (
    <Box
      as="caption"
      css={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0,0,0,0)',
        whiteSpace: 'nowrap',
        border: 0
      }}
    >
      {caption}
    </Box>
  ) : null;

  const headerCells = columns.map((column) => {
    const isCheckboxHeader = column.headerType === 'checkbox';
    const isIconHeader = column.headerType === 'icon';

    const isSortableColumn =
      column.sortable !== false && !isCheckboxHeader && !isIconHeader;

    const isCurrentSortColumn = sortColumnId === column.id;

    const ariaSortValue =
      isSortableColumn && isCurrentSortColumn
        ? sortDirection === 'asc'
          ? 'ascending'
          : sortDirection === 'desc'
            ? 'descending'
            : 'none'
        : undefined;

    const headerCellStickyStyles: SystemStyleObject = column.sticky
      ? {
          position: 'sticky',
          left: column.stickyLeft ?? '0',
          zIndex: 2,
          bg: 'gray.50'
        }
      : {};

    const headerCellWidthStyles: SystemStyleObject = {
      ...(column.width ? { width: column.width } : {}),
      ...(column.minWidth ? { minWidth: column.minWidth } : {})
    };

    const checkboxHeaderOverrides = isCheckboxHeader
      ? {
          width: '57px',
          paddingTop: '8px',
          paddingBottom: '12px'
        }
      : {};

    const iconHeaderOverrides = isIconHeader
      ? {
          paddingTop: '8px',
          paddingBottom: '12px'
        }
      : {};

    const shouldRenderSelectAllCheckbox =
      isCheckboxHeader && hasCheckboxColumn && Boolean(onSelectAll);

    const headerInteractionProps =
      isSortableColumn && onSort
        ? {
            onClick: handleSortableHeaderClick,
            onKeyDown: handleSortableHeaderKeyDown,
            role: 'button' as const,
            tabIndex: 0,
            'aria-label': `Sort by ${column.header}`,
            'data-column-id': column.id
          }
        : {};

    const headerContent = shouldRenderSelectAllCheckbox ? (
      <InternalCheckbox
        checked={allSelected}
        indeterminate={someSelected}
        onCheckedChange={handleSelectAllCheckedChange}
        ariaLabel="Select all rows"
      />
    ) : (
      <Box
        css={{
          ...slotStyles.headerContent,
          ...(isSortableColumn ? { cursor: 'pointer' } : {})
        }}
        {...headerInteractionProps}
      >
        <Box as="span">{column.header}</Box>
        {isSortableColumn ? (
          <Box css={slotStyles.sortIcon}>
            <SortIcon
              style={{
                width: '100%',
                height: '100%',
                opacity:
                  isCurrentSortColumn && sortDirection !== 'none' ? 1 : 0.5
              }}
              aria-hidden="true"
            />
          </Box>
        ) : null}
      </Box>
    );

    return (
      <Box
        as="th"
        key={column.id}
        css={{
          ...slotStyles.th,
          ...headerCellStickyStyles,
          ...headerCellWidthStyles,
          ...checkboxHeaderOverrides,
          ...iconHeaderOverrides
        }}
        aria-sort={ariaSortValue}
      >
        {headerContent}
      </Box>
    );
  });

  const lastRowIndex = data.length - 1;

  const bodyRows = data.map((row, rowIndex) => {
    const rowKey = resolveRowKey(row, rowIndex);
    const isSelected = selectedRows?.has(rowIndex) ?? false;
    const isLastRow = rowIndex === lastRowIndex;

    const cells = columns.map((column) => {
      const isCheckboxCell = column.headerType === 'checkbox';

      const bodyCellStickyStyles: SystemStyleObject = column.sticky
        ? {
            position: 'sticky',
            left: column.stickyLeft ?? '0',
            zIndex: 1,
            bg: isSelected ? 'gray.50' : 'base.white'
          }
        : {};

      const bodyCellWidthStyles: SystemStyleObject = {
        ...(column.width ? { width: column.width } : {}),
        ...(column.minWidth ? { minWidth: column.minWidth } : {})
      };

      const checkboxCellOverrides = isCheckboxCell ? { width: '57px' } : {};

      const lastRowOverrides: SystemStyleObject = isLastRow
        ? { borderBottomWidth: '0' }
        : {};

      const cellContent =
        isCheckboxCell && onRowSelect ? (
          <InternalCheckbox
            checked={isSelected}
            onCheckedChange={handleRowCheckedChange}
            ariaLabel={`Select row ${rowIndex + 1}`}
            rowIndex={rowIndex}
          />
        ) : column.cell ? (
          column.cell(row, rowIndex)
        ) : (
          String(row[column.id] ?? '')
        );

      return (
        <Box
          as="td"
          key={column.id}
          data-sticky={column.sticky || undefined}
          css={{
            ...slotStyles.td,
            ...bodyCellStickyStyles,
            ...bodyCellWidthStyles,
            ...checkboxCellOverrides,
            ...lastRowOverrides
          }}
        >
          {cellContent}
        </Box>
      );
    });

    return (
      <Box
        as="tr"
        key={rowKey}
        css={{
          ...slotStyles.tr,
          _hover: {
            bg: 'gray.50',
            '& td[data-sticky]': { bg: 'gray.50' }
          },
          ...(isSelected ? { bg: 'gray.50' } : {})
        }}
        data-selected={isSelected || undefined}
      >
        {cells}
      </Box>
    );
  });

  const tableNode = (
    <Box as="table" css={slotStyles.table} role="table">
      {captionNode}
      <Box as="thead" css={slotStyles.thead}>
        <Box as="tr" css={slotStyles.tr}>
          {headerCells}
        </Box>
      </Box>
      <Box as="tbody" css={slotStyles.tbody}>
        {bodyRows}
      </Box>
    </Box>
  );

  const tableWrapper = <Box css={slotStyles.scrollContainer}>{tableNode}</Box>;

  const footerNode = footer ? (
    <Box css={slotStyles.paginationContainer}>{footer}</Box>
  ) : null;

  return (
    <Box ref={ref} css={slotStyles.root} {...restProps}>
      {tableWrapper}
      {footerNode}
    </Box>
  );
}

export const Table = forwardRef(TableInner) as (<
  T extends Record<string, unknown>
>(
  props: TableProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement | null) & { displayName?: string };

Table.displayName = 'Table';
