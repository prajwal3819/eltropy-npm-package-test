import type { Decorator, Meta, StoryObj } from '@storybook/react';
import type { ReactElement } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { Table } from './Table';
import type { TableColumn, TableSortDirection } from './Table';
import { Pagination } from '../Pagination/Pagination';
import {
  ChatIcon,
  CloseIcon,
  EditIcon,
  KebabVerticalIcon,
  UserIcon
} from '../../assets/icons';

const PaddedLayoutParameters = {
  layout: 'padded'
} as const;

function createFrameDecorator(maxWidth: string): Decorator {
  const decorator: Decorator = (StoryComponent) => {
    return (
      <div style={{ maxWidth, margin: '0 auto' }}>
        <StoryComponent />
      </div>
    );
  };

  return decorator;
}

const FigmaFrameDecorator = createFrameDecorator('1320px');
const NarrowFrameDecorator = createFrameDecorator('900px');

interface SampleRow extends Record<string, unknown> {
  id: number;
  websiteTitle: string;
  autoSync1: boolean;
  autoSync2: string;
  autoSync3: string;
  status: string;
  emailId: string;
}

const SampleRows: SampleRow[] = Array.from(
  { length: 12 },
  (_unusedValue, rowIndex) => ({
    id: rowIndex + 1,
    websiteTitle:
      '5 Stand-Out Ways to Use a Home Equity Equity Line of Credit...',
    autoSync1: rowIndex % 2 === 1,
    autoSync2: 'On',
    autoSync3: 'On',
    status: 'Tag',
    emailId: 'admin@eltropy.com'
  })
);

const FirstPageRows = SampleRows.slice(0, 8);

function ToggleCell({ value }: { value: boolean }): ReactElement {
  return (
    <Box css={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Box
        css={{
          width: '36px',
          height: '20px',
          borderRadius: '10px',
          backgroundColor: value ? 'successGreen.200' : 'gray.200',
          position: 'relative',
          cursor: 'pointer',
          flexShrink: 0
        }}
      >
        <Box
          css={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: 'base.white',
            position: 'absolute',
            top: '2px',
            left: value ? '18px' : '2px',
            transition: 'left 0.15s ease-in-out'
          }}
        />
      </Box>
      <Box
        as="span"
        css={{ fontSize: '14px', color: 'navyGray.700', lineHeight: '20px' }}
      >
        {value ? 'On' : 'On'}
      </Box>
    </Box>
  );
}

function CheckboxTextCell({ label }: { label: string }): ReactElement {
  return (
    <Box
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        accentColor: 'navyGray.700'
      }}
    >
      <input
        type="checkbox"
        style={{
          width: '20px',
          height: '20px',
          flexShrink: 0
        }}
        aria-label={`Select ${label}`}
      />
      <Box
        as="span"
        css={{ fontSize: '14px', color: 'navyGray.700', lineHeight: '20px' }}
      >
        {label}
      </Box>
    </Box>
  );
}

function ButtonCell({ label }: { label: string }): ReactElement {
  return (
    <Box
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'navyGray.700'
      }}
    >
      <Box
        css={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '24px',
          overflow: 'hidden',
          borderRadius: '8px',
          borderWidth: '0.8px',
          borderStyle: 'solid',
          borderColor: 'gray.200',
          backgroundColor: 'gray.50'
        }}
      >
        <Box
          css={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '4px 8px',
            gap: '4px'
          }}
        >
          <Box
            css={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 4px',
              gap: '4px'
            }}
          >
            <UserIcon
              style={{
                width: '24px',
                height: '24px',
                flexShrink: 0
              }}
            />
            <Box
              as="span"
              css={{
                fontSize: '12px',
                fontWeight: 500,
                lineHeight: 'normal',
                whiteSpace: 'nowrap'
              }}
            >
              {label}
            </Box>
          </Box>
        </Box>
      </Box>
      <KebabVerticalIcon
        style={{
          width: '24px',
          height: '24px',
          flexShrink: 0
        }}
      />
    </Box>
  );
}

function TagCell({ label }: { label: string }): ReactElement {
  return (
    <Box
      as="span"
      css={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        height: '24px',
        padding: '4px 8px',
        borderRadius: '100px',
        backgroundColor: 'blue.50',
        color: 'blue.400'
      }}
    >
      <UserIcon
        style={{
          width: '24px',
          height: '24px',
          flexShrink: 0
        }}
      />
      <Box
        as="span"
        css={{
          fontSize: '12px',
          fontWeight: 400,
          lineHeight: '18px',
          whiteSpace: 'nowrap',
          textAlign: 'center'
        }}
      >
        {label}
      </Box>
      <CloseIcon
        style={{
          width: '24px',
          height: '24px',
          cursor: 'pointer',
          flexShrink: 0
        }}
      />
    </Box>
  );
}

function ActionsCell(): ReactElement {
  const actionButtonStyles = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    width: '24px',
    height: '24px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    borderRadius: '100px',
    flexShrink: 0
  } as const;

  return (
    <Box
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'navyGray.700'
      }}
    >
      <Box as="button" aria-label="More actions" css={actionButtonStyles}>
        <KebabVerticalIcon style={{ width: '24px', height: '24px' }} />
      </Box>
      <Box as="button" aria-label="Edit" css={actionButtonStyles}>
        <EditIcon style={{ width: '24px', height: '24px' }} />
      </Box>
      <Box as="button" aria-label="Chat" css={actionButtonStyles}>
        <ChatIcon style={{ width: '24px', height: '24px' }} />
      </Box>
    </Box>
  );
}

const TableColumns: TableColumn<SampleRow>[] = [
  {
    id: 'checkbox',
    header: '',
    headerType: 'checkbox',
    width: '57px'
  },
  {
    id: 'websiteTitle',
    header: 'Website Title',
    sortable: true,
    width: '431px',
    cell: (row) => (
      <span
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          display: 'block',
          maxWidth: '407px'
        }}
      >
        {row.websiteTitle}
      </span>
    )
  },
  {
    id: 'autoSync1',
    header: 'Auto Sync',
    sortable: true,
    width: '122px',
    cell: (row) => <ToggleCell value={row.autoSync1} />
  },
  {
    id: 'autoSync2',
    header: 'Auto Sync',
    sortable: true,
    width: '146px',
    cell: (row) => <CheckboxTextCell label={row.autoSync2} />
  },
  {
    id: 'autoSync3',
    header: 'Auto Sync',
    sortable: true,
    width: '146px',
    cell: (row) => <ButtonCell label={row.autoSync3} />
  },
  {
    id: 'status',
    header: 'Status',
    sortable: true,
    width: '101px',
    cell: (row) => <TagCell label={row.status} />
  },
  {
    id: 'emailId',
    header: 'Email Id',
    sortable: true,
    width: '187px'
  },
  {
    id: 'actions',
    header: 'Actions',
    headerType: 'icon',
    sortable: true,
    width: '130px',
    cell: () => <ActionsCell />
  }
];

const FixedColumns: TableColumn<SampleRow>[] = [
  {
    id: 'websiteTitle',
    header: 'Website Title',
    sortable: true,
    minWidth: '280px',
    sticky: true,
    stickyLeft: '0',
    cell: (row) => (
      <span
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          display: 'block',
          maxWidth: '280px'
        }}
      >
        {row.websiteTitle}
      </span>
    )
  },
  ...TableColumns.slice(2)
];

const meta: Meta<typeof Table<SampleRow>> = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    ...PaddedLayoutParameters,
    docs: {
      description: {
        component:
          'Table renders a semantic HTML table with optional sorting, row selection, horizontal scrolling, fixed columns, and an optional footer slot (e.g. Pagination).'
      }
    }
  },
  tags: ['autodocs'],
  decorators: [FigmaFrameDecorator],
  argTypes: {
    columns: {
      control: 'object',
      description: 'Table column definitions.'
    },
    data: {
      control: 'object',
      description: 'Table row data.'
    },
    sortColumnId: {
      control: 'text',
      description: 'Currently sorted column id (when sorting is controlled).'
    },
    sortDirection: {
      control: 'radio',
      options: ['asc', 'desc', 'none'],
      description: 'Current sort direction (when sorting is controlled).'
    },
    onSort: {
      action: 'onSort',
      description: 'Fired when user requests sorting for a column id.'
    },
    selectedRows: {
      control: 'object',
      description: 'Controlled selected row indexes (0-based).'
    },
    onRowSelect: {
      action: 'onRowSelect',
      description: 'Fired when a single row selection changes.'
    },
    onSelectAll: {
      action: 'onSelectAll',
      description: 'Fired when header select-all changes.'
    },
    footer: {
      control: 'object',
      description: 'Optional footer slot rendered below the table.'
    },
    horizontalScroll: {
      control: 'boolean',
      description: 'Enable horizontal scrolling wrapper.'
    },
    caption: {
      control: 'text',
      description: 'Accessible table caption (visually hidden).'
    },
    getRowKey: {
      control: false,
      description:
        'Provide a stable row key for React rendering. Defaults to row index.'
    }
  }
};

export default meta;

type Story = StoryObj<typeof Table<SampleRow>>;

/* -------------------------------------------------------------------------------------------------
 * DEFAULT
 * ------------------------------------------------------------------------------------------------- */

export const Default: Story = {
  name: 'Default / Base',
  args: {
    columns: TableColumns,
    data: SampleRows,
    caption: 'Website management table'
  }
};

/* -------------------------------------------------------------------------------------------------
 * LAYOUT
 * ------------------------------------------------------------------------------------------------- */

export const Empty: Story = {
  name: 'Layout / Empty',
  args: {
    columns: TableColumns,
    data: [],
    caption: 'Empty table'
  }
};

export const HorizontalScroll: Story = {
  name: 'Layout / Horizontal Scroll',
  args: {
    columns: TableColumns,
    data: FirstPageRows,
    horizontalScroll: true,
    caption: 'Horizontally scrollable table'
  },
  decorators: [NarrowFrameDecorator]
};

export const FixedColumnsStory: Story = {
  name: 'Layout / Fixed Columns',
  args: {
    columns: FixedColumns,
    data: FirstPageRows,
    horizontalScroll: true,
    caption: 'Table with fixed first columns'
  },
  decorators: [NarrowFrameDecorator]
};

/* -------------------------------------------------------------------------------------------------
 * CONTROLLED FEATURES
 * ------------------------------------------------------------------------------------------------- */

export const ControlledSorting: Story = {
  name: 'Controlled / Sorting',
  args: {
    columns: TableColumns,
    data: SampleRows,
    sortColumnId: 'websiteTitle',
    sortDirection: 'asc',
    caption: 'Controlled sorting table'
  }
};

export const ControlledSelection: Story = {
  name: 'Controlled / Row Selection',
  args: {
    columns: TableColumns,
    data: SampleRows,
    selectedRows: new Set([0, 2, 4]),
    caption: 'Controlled selection table'
  }
};

/* -------------------------------------------------------------------------------------------------
 * INTERACTIVE DEMOS
 * ------------------------------------------------------------------------------------------------- */

function InteractiveSortingTemplate(): ReactElement {
  const [sortColumnId, setSortColumnId] = useState<string | undefined>(
    undefined
  );
  const [sortDirection, setSortDirection] =
    useState<TableSortDirection>('none');

  const handleSort = useCallback(
    (columnId: string) => {
      if (sortColumnId === columnId) {
        setSortDirection((previousSortDirection) => {
          return previousSortDirection === 'none'
            ? 'asc'
            : previousSortDirection === 'asc'
              ? 'desc'
              : 'none';
        });
        return;
      }

      setSortColumnId(columnId);
      setSortDirection('asc');
    },
    [sortColumnId]
  );

  return (
    <Table<SampleRow>
      columns={TableColumns}
      data={SampleRows}
      sortColumnId={sortColumnId}
      sortDirection={sortDirection}
      onSort={handleSort}
      caption="Interactive sorting table"
    />
  );
}

export const InteractiveSorting: Story = {
  name: 'Interactive / Sorting',
  render: () => <InteractiveSortingTemplate />
};

function InteractiveSelectionTemplate(): ReactElement {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const handleRowSelect = useCallback((rowIndex: number, selected: boolean) => {
    setSelectedRows((previousSelectedRows) => {
      const nextSelectedRows = new Set(previousSelectedRows);

      if (selected) {
        nextSelectedRows.add(rowIndex);
      } else {
        nextSelectedRows.delete(rowIndex);
      }

      return nextSelectedRows;
    });
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected) {
      setSelectedRows(new Set(SampleRows.map((_row, rowIndex) => rowIndex)));
      return;
    }

    setSelectedRows(new Set());
  }, []);

  return (
    <Table<SampleRow>
      columns={TableColumns}
      data={SampleRows}
      selectedRows={selectedRows}
      onRowSelect={handleRowSelect}
      onSelectAll={handleSelectAll}
      caption="Interactive selectable table"
    />
  );
}

export const InteractiveRowSelection: Story = {
  name: 'Interactive / Row Selection',
  render: () => <InteractiveSelectionTemplate />
};

function InteractivePaginationTemplate(): ReactElement {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalItems = 1000;
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }, [itemsPerPage]);

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const handleItemsPerPageChange = useCallback((nextItemsPerPage: number) => {
    setItemsPerPage(nextItemsPerPage);
    setPage(1);
  }, []);

  return (
    <Table<SampleRow>
      columns={TableColumns}
      data={FirstPageRows}
      caption="Paginated table"
      footer={
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          showItemsPerPage
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          showGoTo
          goToPlaceholder="e.g. 102"
          itemsPerPageDropdownPosition="top"
        />
      }
    />
  );
}

export const InteractivePagination: Story = {
  name: 'Interactive / Pagination',
  render: () => <InteractivePaginationTemplate />
};

function InteractiveFullFeaturedTemplate(): ReactElement {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [sortColumnId, setSortColumnId] = useState<string | undefined>(
    undefined
  );
  const [sortDirection, setSortDirection] =
    useState<TableSortDirection>('none');

  const totalItems = 1000;
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }, [itemsPerPage]);

  const handleSort = useCallback(
    (columnId: string) => {
      if (sortColumnId === columnId) {
        setSortDirection((previousSortDirection) => {
          return previousSortDirection === 'none'
            ? 'asc'
            : previousSortDirection === 'asc'
              ? 'desc'
              : 'none';
        });
        return;
      }

      setSortColumnId(columnId);
      setSortDirection('asc');
    },
    [sortColumnId]
  );

  const handleRowSelect = useCallback((rowIndex: number, selected: boolean) => {
    setSelectedRows((previousSelectedRows) => {
      const nextSelectedRows = new Set(previousSelectedRows);

      if (selected) {
        nextSelectedRows.add(rowIndex);
      } else {
        nextSelectedRows.delete(rowIndex);
      }

      return nextSelectedRows;
    });
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected) {
      setSelectedRows(new Set(FirstPageRows.map((_row, rowIndex) => rowIndex)));
      return;
    }

    setSelectedRows(new Set());
  }, []);

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const handleItemsPerPageChange = useCallback((nextItemsPerPage: number) => {
    setItemsPerPage(nextItemsPerPage);
    setPage(1);
  }, []);

  return (
    <Table<SampleRow>
      columns={TableColumns}
      data={FirstPageRows}
      sortColumnId={sortColumnId}
      sortDirection={sortDirection}
      onSort={handleSort}
      selectedRows={selectedRows}
      onRowSelect={handleRowSelect}
      onSelectAll={handleSelectAll}
      caption="Full featured table"
      footer={
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          showItemsPerPage
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          showGoTo
          goToPlaceholder="e.g. 102"
          itemsPerPageDropdownPosition="top"
        />
      }
    />
  );
}

export const InteractiveFullFeatured: Story = {
  name: 'Interactive / Full Featured',
  render: () => <InteractiveFullFeaturedTemplate />
};
