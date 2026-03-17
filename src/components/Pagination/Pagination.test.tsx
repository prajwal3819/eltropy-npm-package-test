import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/test-utils';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('should have a displayName', () => {
    expect(Pagination.displayName).toBe('Pagination');
  });

  describe('rendering', () => {
    it('renders nav element with pagination label', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination page={1} totalPages={10} onPageChange={handlePageChange} />
      );

      const navigationElement = screen.getByRole('navigation', {
        name: 'Pagination'
      });
      expect(navigationElement).toBeInTheDocument();
    });

    it('renders current page with aria-current', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination page={3} totalPages={10} onPageChange={handlePageChange} />
      );

      const currentPageButton = screen.getByRole('button', {
        name: 'Go to page 3'
      });
      expect(currentPageButton).toHaveAttribute('aria-current', 'page');
    });

    it('renders previous and next buttons', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination page={5} totalPages={10} onPageChange={handlePageChange} />
      );

      expect(
        screen.getByRole('button', { name: 'Previous page' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Next page' })
      ).toBeInTheDocument();
    });

    it('renders all page numbers for small page counts', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination page={1} totalPages={5} onPageChange={handlePageChange} />
      );

      for (let pageNumber = 1; pageNumber <= 5; pageNumber++) {
        expect(
          screen.getByRole('button', { name: `Go to page ${pageNumber}` })
        ).toBeInTheDocument();
      }
    });

    it('renders single page when totalPages is 1', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination page={1} totalPages={1} onPageChange={handlePageChange} />
      );

      expect(
        screen.getByRole('button', { name: 'Go to page 1' })
      ).toBeInTheDocument();
    });
  });

  describe('previous button behavior', () => {
    it('disables previous button on first page', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination page={1} totalPages={10} onPageChange={handlePageChange} />
      );

      const previousPageButton = screen.getByRole('button', {
        name: 'Previous page'
      });
      expect(previousPageButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('enables previous button when not on first page', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination page={5} totalPages={10} onPageChange={handlePageChange} />
      );

      const previousPageButton = screen.getByRole('button', {
        name: 'Previous page'
      });
      expect(previousPageButton).toHaveAttribute('aria-disabled', 'false');
    });

    it('calls onPageChange with page-1 when previous is clicked', async () => {
      const userEventDriver = userEvent.setup();
      const handlePageChange = vi.fn();

      render(
        <Pagination page={5} totalPages={10} onPageChange={handlePageChange} />
      );

      const previousPageButton = screen.getByRole('button', {
        name: 'Previous page'
      });
      await userEventDriver.click(previousPageButton);

      expect(handlePageChange).toHaveBeenCalledTimes(1);
      expect(handlePageChange).toHaveBeenCalledWith(4);
    });
  });

  describe('next button behavior', () => {
    it('disables next button on last page', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination page={10} totalPages={10} onPageChange={handlePageChange} />
      );

      const nextPageButton = screen.getByRole('button', { name: 'Next page' });
      expect(nextPageButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('enables next button when not on last page', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination page={5} totalPages={10} onPageChange={handlePageChange} />
      );

      const nextPageButton = screen.getByRole('button', { name: 'Next page' });
      expect(nextPageButton).toHaveAttribute('aria-disabled', 'false');
    });

    it('calls onPageChange with page+1 when next is clicked', async () => {
      const userEventDriver = userEvent.setup();
      const handlePageChange = vi.fn();

      render(
        <Pagination page={5} totalPages={10} onPageChange={handlePageChange} />
      );

      const nextPageButton = screen.getByRole('button', { name: 'Next page' });
      await userEventDriver.click(nextPageButton);

      expect(handlePageChange).toHaveBeenCalledTimes(1);
      expect(handlePageChange).toHaveBeenCalledWith(6);
    });
  });

  describe('page button behavior', () => {
    it('calls onPageChange when a page button is clicked', async () => {
      const userEventDriver = userEvent.setup();
      const handlePageChange = vi.fn();

      render(
        <Pagination page={1} totalPages={10} onPageChange={handlePageChange} />
      );

      const page2Button = screen.getByRole('button', { name: 'Go to page 2' });
      await userEventDriver.click(page2Button);

      expect(handlePageChange).toHaveBeenCalledTimes(1);
      expect(handlePageChange).toHaveBeenCalledWith(2);
    });

    it('does not call onPageChange when current page button is clicked', async () => {
      const userEventDriver = userEvent.setup();
      const handlePageChange = vi.fn();

      render(
        <Pagination page={5} totalPages={10} onPageChange={handlePageChange} />
      );

      const currentPageButton = screen.getByRole('button', {
        name: 'Go to page 5'
      });
      await userEventDriver.click(currentPageButton);

      expect(handlePageChange).not.toHaveBeenCalled();
    });
  });

  describe('ellipsis rendering', () => {
    it('shows ellipsis when totalPages is large and page is near start', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination page={1} totalPages={20} onPageChange={handlePageChange} />
      );

      const ellipsisElement = screen.getByText('..');
      expect(ellipsisElement).toBeInTheDocument();
    });

    it('shows ellipsis when totalPages is large and page is near end', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination page={20} totalPages={20} onPageChange={handlePageChange} />
      );

      const ellipsisElement = screen.getByText('..');
      expect(ellipsisElement).toBeInTheDocument();
    });

    it('shows two ellipses when page is in the middle of large range', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination page={10} totalPages={20} onPageChange={handlePageChange} />
      );

      const ellipsisElements = screen.getAllByText('..');
      expect(ellipsisElements).toHaveLength(2);
    });

    it('shows no ellipsis for small page counts', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination page={3} totalPages={5} onPageChange={handlePageChange} />
      );

      expect(screen.queryByText('..')).not.toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('disables all controls when disabled prop is true', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination
          page={5}
          totalPages={10}
          onPageChange={handlePageChange}
          disabled
        />
      );

      const previousPageButton = screen.getByRole('button', {
        name: 'Previous page'
      });
      const nextPageButton = screen.getByRole('button', { name: 'Next page' });
      const pageButtons = screen.getAllByRole('button', { name: /Go to page/ });

      expect(previousPageButton).toHaveAttribute('aria-disabled', 'true');
      expect(nextPageButton).toHaveAttribute('aria-disabled', 'true');

      pageButtons.forEach((pageButton) => {
        expect(pageButton).toHaveAttribute('aria-disabled', 'true');
      });
    });

    it('sets pointer-events none on disabled buttons', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination
          page={5}
          totalPages={10}
          onPageChange={handlePageChange}
          disabled
        />
      );

      const pageButtons = screen.getAllByRole('button', { name: /Go to page/ });

      pageButtons.forEach((pageButton) => {
        expect(pageButton).toHaveStyle({ pointerEvents: 'none' });
      });
    });
  });

  describe('edge cases', () => {
    it('handles page value less than 1 by clamping', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination page={-5} totalPages={10} onPageChange={handlePageChange} />
      );

      const page1Button = screen.getByRole('button', { name: 'Go to page 1' });
      expect(page1Button).toHaveAttribute('aria-current', 'page');
    });

    it('handles page value greater than totalPages by clamping', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination
          page={100}
          totalPages={10}
          onPageChange={handlePageChange}
        />
      );

      const page10Button = screen.getByRole('button', {
        name: 'Go to page 10'
      });
      expect(page10Button).toHaveAttribute('aria-current', 'page');
    });

    it('handles totalPages of 0 by showing at least page 1', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination page={1} totalPages={0} onPageChange={handlePageChange} />
      );

      const page1Button = screen.getByRole('button', { name: 'Go to page 1' });
      expect(page1Button).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has accessible names for all buttons', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination page={5} totalPages={10} onPageChange={handlePageChange} />
      );

      expect(
        screen.getByRole('button', { name: 'Previous page' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Next page' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Go to page 5' })
      ).toBeInTheDocument();
    });

    it('marks ellipsis as aria-hidden', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination page={10} totalPages={20} onPageChange={handlePageChange} />
      );

      const ellipsisElements = screen.getAllByText('..');
      ellipsisElements.forEach((ellipsisElement) => {
        expect(ellipsisElement).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('items per page', () => {
    it('does not render items per page by default', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination page={1} totalPages={10} onPageChange={handlePageChange} />
      );

      expect(screen.queryByText('Items per page')).not.toBeInTheDocument();
    });

    it('renders items per page when showItemsPerPage is true', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination
          page={1}
          totalPages={5}
          onPageChange={handlePageChange}
          showItemsPerPage
          itemsPerPage={10}
        />
      );

      expect(screen.getByText('Items per page')).toBeInTheDocument();
      const dropdownButton = screen.getByRole('button', {
        name: /Items per page: 10/
      });
      expect(dropdownButton).toBeInTheDocument();
    });

    it('opens dropdown when items per page button is clicked', async () => {
      const userEventDriver = userEvent.setup();
      const handlePageChange = vi.fn();

      render(
        <Pagination
          page={1}
          totalPages={10}
          onPageChange={handlePageChange}
          showItemsPerPage
          itemsPerPage={10}
        />
      );

      const dropdownButton = screen.getByRole('button', {
        name: /Items per page/
      });
      await userEventDriver.click(dropdownButton);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('calls onItemsPerPageChange when option is selected', async () => {
      const userEventDriver = userEvent.setup();
      const handlePageChange = vi.fn();
      const handleItemsPerPageChange = vi.fn();

      render(
        <Pagination
          page={1}
          totalPages={10}
          onPageChange={handlePageChange}
          showItemsPerPage
          itemsPerPage={10}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      );

      const dropdownButton = screen.getByRole('button', {
        name: /Items per page/
      });
      await userEventDriver.click(dropdownButton);

      const option20 = screen.getByRole('option', { name: '20' });
      await userEventDriver.click(option20);

      expect(handleItemsPerPageChange).toHaveBeenCalledTimes(1);
      expect(handleItemsPerPageChange).toHaveBeenCalledWith(20);
    });

    it("opens dropdown with position 'top' when itemsPerPageDropdownPosition is 'top'", async () => {
      const userEventDriver = userEvent.setup();
      const handlePageChange = vi.fn();

      render(
        <Pagination
          page={1}
          totalPages={10}
          onPageChange={handlePageChange}
          showItemsPerPage
          itemsPerPage={10}
          itemsPerPageDropdownPosition="top"
        />
      );

      const dropdownButton = screen.getByRole('button', {
        name: /Items per page/
      });
      await userEventDriver.click(dropdownButton);

      const listboxElement = screen.getByRole('listbox');
      expect(listboxElement).toBeInTheDocument();
    });

    it("opens dropdown with position 'bottom' when itemsPerPageDropdownPosition is 'bottom'", async () => {
      const userEventDriver = userEvent.setup();
      const handlePageChange = vi.fn();

      render(
        <Pagination
          page={1}
          totalPages={10}
          onPageChange={handlePageChange}
          showItemsPerPage
          itemsPerPage={10}
          itemsPerPageDropdownPosition="bottom"
        />
      );

      const dropdownButton = screen.getByRole('button', {
        name: /Items per page/
      });
      await userEventDriver.click(dropdownButton);

      const listboxElement = screen.getByRole('listbox');
      expect(listboxElement).toBeInTheDocument();
    });

    it("opens dropdown with auto positioning when itemsPerPageDropdownPosition is 'auto'", async () => {
      const userEventDriver = userEvent.setup();
      const handlePageChange = vi.fn();

      render(
        <Pagination
          page={1}
          totalPages={10}
          onPageChange={handlePageChange}
          showItemsPerPage
          itemsPerPage={10}
          itemsPerPageDropdownPosition="auto"
        />
      );

      const dropdownButton = screen.getByRole('button', {
        name: /Items per page/
      });
      await userEventDriver.click(dropdownButton);

      const listboxElement = screen.getByRole('listbox');
      expect(listboxElement).toBeInTheDocument();
    });
  });

  describe('go to page', () => {
    it('does not render go to by default', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination page={1} totalPages={10} onPageChange={handlePageChange} />
      );

      expect(screen.queryByText('Go to')).not.toBeInTheDocument();
    });

    it('renders go to input when showGoTo is true', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination
          page={1}
          totalPages={10}
          onPageChange={handlePageChange}
          showGoTo
        />
      );

      expect(screen.getByText('Go to')).toBeInTheDocument();
      expect(
        screen.getByRole('textbox', { name: 'Go to page number' })
      ).toBeInTheDocument();
    });

    it('navigates to page when enter is pressed in go to input', async () => {
      const userEventDriver = userEvent.setup();
      const handlePageChange = vi.fn();

      render(
        <Pagination
          page={1}
          totalPages={100}
          onPageChange={handlePageChange}
          showGoTo
        />
      );

      const goToInput = screen.getByRole('textbox', {
        name: 'Go to page number'
      });
      await userEventDriver.type(goToInput, '50');
      await userEventDriver.keyboard('{Enter}');

      expect(handlePageChange).toHaveBeenCalledTimes(1);
      expect(handlePageChange).toHaveBeenCalledWith(50);
    });

    it('does not navigate for invalid page numbers', async () => {
      const userEventDriver = userEvent.setup();
      const handlePageChange = vi.fn();

      render(
        <Pagination
          page={1}
          totalPages={10}
          onPageChange={handlePageChange}
          showGoTo
        />
      );

      const goToInput = screen.getByRole('textbox', {
        name: 'Go to page number'
      });
      await userEventDriver.type(goToInput, '100');
      await userEventDriver.keyboard('{Enter}');

      expect(handlePageChange).not.toHaveBeenCalled();
    });

    it('only allows numeric input', async () => {
      const userEventDriver = userEvent.setup();
      const handlePageChange = vi.fn();

      render(
        <Pagination
          page={1}
          totalPages={10}
          onPageChange={handlePageChange}
          showGoTo
        />
      );

      const goToInput = screen.getByRole('textbox', {
        name: 'Go to page number'
      });
      await userEventDriver.type(goToInput, 'abc123');

      expect(goToInput).toHaveValue('123');
    });
  });

  describe('large page numbers', () => {
    it('renders large page numbers without overlap', () => {
      const handlePageChange = vi.fn();

      render(
        <Pagination
          page={10000}
          totalPages={10000}
          onPageChange={handlePageChange}
        />
      );

      const page10000Button = screen.getByRole('button', {
        name: 'Go to page 10000'
      });
      expect(page10000Button).toBeInTheDocument();
      expect(page10000Button).toHaveAttribute('aria-current', 'page');
    });
  });
});
