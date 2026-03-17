import { describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/test-utils';
import { Table } from './Table';
import type { TableColumn } from './Table';

interface TestRow extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
  status: string;
}

const rows: TestRow[] = [
  { id: 1, name: 'Alice', email: 'alice@test.com', status: 'Active' },
  { id: 2, name: 'Bob', email: 'bob@test.com', status: 'Inactive' },
  { id: 3, name: 'Charlie', email: 'charlie@test.com', status: 'Active' }
];

const columns: TableColumn<TestRow>[] = [
  { id: 'name', header: 'Name', sortable: true },
  { id: 'email', header: 'Email', sortable: true },
  { id: 'status', header: 'Status', sortable: false }
];

const columnsWithCheckbox: TableColumn<TestRow>[] = [
  { id: 'checkbox', header: '', headerType: 'checkbox', width: '57px' },
  ...columns
];

const renderCustomNameCell = (row: TestRow) => {
  return <strong data-testid="custom-cell">{row.name}</strong>;
};

describe('Table', () => {
  it('should have a displayName', () => {
    expect(Table.displayName).toBe('Table');
  });

  describe('rendering', () => {
    it('renders a table element', () => {
      render(
        <Table<TestRow> columns={columns} data={rows} caption="Test table" />
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('renders column headers', () => {
      render(<Table<TestRow> columns={columns} data={rows} />);

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('renders row data', () => {
      render(<Table<TestRow> columns={columns} data={rows} />);

      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('bob@test.com')).toBeInTheDocument();
      expect(screen.getAllByText('Active').length).toBeGreaterThanOrEqual(1);
    });

    it('renders correct number of rows', () => {
      render(<Table<TestRow> columns={columns} data={rows} />);

      const tableElement = screen.getByRole('table');
      const rowElements = within(tableElement).getAllByRole('row');

      expect(rowElements).toHaveLength(4);
    });

    it('renders visually hidden caption for accessibility', () => {
      render(
        <Table<TestRow>
          columns={columns}
          data={rows}
          caption="User management table"
        />
      );

      expect(screen.getByText('User management table')).toBeInTheDocument();
    });

    it('renders empty table with no data rows', () => {
      render(<Table<TestRow> columns={columns} data={[]} />);

      const tableElement = screen.getByRole('table');
      const rowElements = within(tableElement).getAllByRole('row');

      expect(rowElements).toHaveLength(1);
    });

    it('renders custom cell content via cell renderer', () => {
      const customColumns: TableColumn<TestRow>[] = [
        {
          id: 'name',
          header: 'Name',
          cell: renderCustomNameCell
        }
      ];

      render(<Table<TestRow> columns={customColumns} data={rows} />);

      const customCellElements = screen.getAllByTestId('custom-cell');
      expect(customCellElements).toHaveLength(3);
      expect(customCellElements[0]).toHaveTextContent('Alice');
    });
  });

  describe('sorting', () => {
    it('calls onSort when a sortable column header is clicked', async () => {
      const userEventDriver = userEvent.setup();
      const onSort = vi.fn();

      render(<Table<TestRow> columns={columns} data={rows} onSort={onSort} />);

      const sortButton = screen.getByRole('button', { name: 'Sort by Name' });
      await userEventDriver.click(sortButton);

      expect(onSort).toHaveBeenCalledTimes(1);
      expect(onSort).toHaveBeenCalledWith('name');
    });

    it('supports keyboard activation of sort (Enter)', async () => {
      const userEventDriver = userEvent.setup();
      const onSort = vi.fn();

      render(<Table<TestRow> columns={columns} data={rows} onSort={onSort} />);

      const sortButton = screen.getByRole('button', { name: 'Sort by Name' });
      sortButton.focus();
      await userEventDriver.keyboard('{Enter}');

      expect(onSort).toHaveBeenCalledTimes(1);
      expect(onSort).toHaveBeenCalledWith('name');
    });

    it('does not render sort button for non-sortable columns', () => {
      render(<Table<TestRow> columns={columns} data={rows} onSort={vi.fn()} />);

      expect(
        screen.queryByRole('button', { name: 'Sort by Status' })
      ).not.toBeInTheDocument();
    });

    it('sets aria-sort on the currently sorted column', () => {
      render(
        <Table<TestRow>
          columns={columns}
          data={rows}
          sortColumnId="name"
          sortDirection="asc"
        />
      );

      const tableElement = screen.getByRole('table');
      const headerRow = within(tableElement).getAllByRole('row')[0];
      const headerCells = within(headerRow).getAllByRole('columnheader');

      expect(headerCells[0]).toHaveAttribute('aria-sort', 'ascending');
    });

    it('sets aria-sort descending on the currently sorted column', () => {
      render(
        <Table<TestRow>
          columns={columns}
          data={rows}
          sortColumnId="name"
          sortDirection="desc"
        />
      );

      const tableElement = screen.getByRole('table');
      const headerRow = within(tableElement).getAllByRole('row')[0];
      const headerCells = within(headerRow).getAllByRole('columnheader');

      expect(headerCells[0]).toHaveAttribute('aria-sort', 'descending');
    });

    it('does not call onSort when no onSort handler is provided', () => {
      render(
        <Table<TestRow>
          columns={columns}
          data={rows}
          sortColumnId="name"
          sortDirection="asc"
        />
      );

      expect(
        screen.queryByRole('button', { name: 'Sort by Name' })
      ).not.toBeInTheDocument();
    });
  });

  describe('row selection', () => {
    it('renders select all checkbox in header', () => {
      render(
        <Table<TestRow>
          columns={columnsWithCheckbox}
          data={rows}
          selectedRows={new Set()}
          onRowSelect={vi.fn()}
          onSelectAll={vi.fn()}
        />
      );

      expect(
        screen.getByRole('checkbox', { name: 'Select all rows' })
      ).toBeInTheDocument();
    });

    it('renders row checkboxes', () => {
      render(
        <Table<TestRow>
          columns={columnsWithCheckbox}
          data={rows}
          selectedRows={new Set()}
          onRowSelect={vi.fn()}
          onSelectAll={vi.fn()}
        />
      );

      expect(
        screen.getByRole('checkbox', { name: 'Select row 1' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('checkbox', { name: 'Select row 2' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('checkbox', { name: 'Select row 3' })
      ).toBeInTheDocument();
    });

    it('calls onRowSelect when a row checkbox is toggled', async () => {
      const userEventDriver = userEvent.setup();
      const onRowSelect = vi.fn();

      render(
        <Table<TestRow>
          columns={columnsWithCheckbox}
          data={rows}
          selectedRows={new Set()}
          onRowSelect={onRowSelect}
          onSelectAll={vi.fn()}
        />
      );

      const rowCheckbox = screen.getByRole('checkbox', {
        name: 'Select row 1'
      });
      await userEventDriver.click(rowCheckbox);

      expect(onRowSelect).toHaveBeenCalledTimes(1);
      expect(onRowSelect).toHaveBeenCalledWith(0, true);
    });

    it('calls onSelectAll when header checkbox is toggled', async () => {
      const userEventDriver = userEvent.setup();
      const onSelectAll = vi.fn();

      render(
        <Table<TestRow>
          columns={columnsWithCheckbox}
          data={rows}
          selectedRows={new Set()}
          onRowSelect={vi.fn()}
          onSelectAll={onSelectAll}
        />
      );

      const selectAllCheckbox = screen.getByRole('checkbox', {
        name: 'Select all rows'
      });
      await userEventDriver.click(selectAllCheckbox);

      expect(onSelectAll).toHaveBeenCalledTimes(1);
      expect(onSelectAll).toHaveBeenCalledWith(true);
    });

    it('reflects selected rows via checked checkboxes', () => {
      render(
        <Table<TestRow>
          columns={columnsWithCheckbox}
          data={rows}
          selectedRows={new Set([0, 2])}
          onRowSelect={vi.fn()}
          onSelectAll={vi.fn()}
        />
      );

      const row1Checkbox = screen.getByRole('checkbox', {
        name: 'Select row 1'
      }) as HTMLInputElement;
      const row2Checkbox = screen.getByRole('checkbox', {
        name: 'Select row 2'
      }) as HTMLInputElement;
      const row3Checkbox = screen.getByRole('checkbox', {
        name: 'Select row 3'
      }) as HTMLInputElement;

      expect(row1Checkbox.checked).toBe(true);
      expect(row2Checkbox.checked).toBe(false);
      expect(row3Checkbox.checked).toBe(true);
    });

    it('shows select all as checked when all rows are selected', () => {
      render(
        <Table<TestRow>
          columns={columnsWithCheckbox}
          data={rows}
          selectedRows={new Set([0, 1, 2])}
          onRowSelect={vi.fn()}
          onSelectAll={vi.fn()}
        />
      );

      const selectAllCheckbox = screen.getByRole('checkbox', {
        name: 'Select all rows'
      }) as HTMLInputElement;
      expect(selectAllCheckbox.checked).toBe(true);
    });
  });

  describe('footer', () => {
    it('renders footer content when provided', () => {
      render(
        <Table<TestRow>
          columns={columns}
          data={rows}
          footer={<div data-testid="table-footer">Pagination here</div>}
        />
      );

      expect(screen.getByTestId('table-footer')).toBeInTheDocument();
    });

    it('does not render footer container when footer is not provided', () => {
      render(<Table<TestRow> columns={columns} data={rows} />);

      const tableElement = screen.getByRole('table');
      expect(tableElement.nextElementSibling).toBeNull();
      expect(screen.queryByText('Pagination here')).not.toBeInTheDocument();
    });
  });

  describe('horizontal scroll', () => {
    it('renders table when horizontalScroll is true', () => {
      render(<Table<TestRow> columns={columns} data={rows} horizontalScroll />);

      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('custom row key', () => {
    it('uses getRowKey for row identity', () => {
      render(
        <Table<TestRow>
          columns={columns}
          data={rows}
          getRowKey={(row) => row.id}
        />
      );

      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
  });
});
