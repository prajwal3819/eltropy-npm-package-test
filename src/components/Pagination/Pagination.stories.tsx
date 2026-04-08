import type { Meta, StoryObj } from '@storybook/react';
import type { ReactElement } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { Pagination } from './Pagination';

const PaddedLayoutParameters = {
  layout: 'padded'
} as const;

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    ...PaddedLayoutParameters,
    docs: {
      description: {
        component:
          'Pagination renders accessible page controls with optional items-per-page and go-to input. Desktop shows full controls; Mobile renders a compact control set.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    page: {
      control: { type: 'number', min: 1 },
      description: 'Current page (1-based). Values outside range are clamped.'
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: 'Total number of pages. Values <= 0 are treated as 1.'
    },
    onPageChange: {
      action: 'onPageChange',
      description: 'Fired when user requests a new page (1-based).'
    },
    siblingCount: {
      control: { type: 'number', min: 0 },
      description:
        'Pages shown on each side of the current page before collapsing with ellipsis.'
    },
    boundaryCount: {
      control: { type: 'number', min: 0 },
      description: 'Pages always shown at the start and end of the list.'
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all interactions.'
    },
    showItemsPerPage: {
      control: 'boolean',
      description: 'Show "Items per page" dropdown (desktop only).'
    },
    itemsPerPage: {
      control: { type: 'number', min: 1 },
      description:
        'Current items-per-page value (used when showItemsPerPage is true).'
    },
    itemsPerPageOptions: {
      control: 'object',
      description: 'Options shown in the items-per-page dropdown.'
    },
    onItemsPerPageChange: {
      action: 'onItemsPerPageChange',
      description: 'Fired when an items-per-page option is selected.'
    },
    showGoTo: {
      control: 'boolean',
      description: 'Show "Go to" page input (desktop only).'
    },
    goToPlaceholder: {
      control: 'text',
      description: 'Placeholder text for the "Go to" input.'
    },
    variant: {
      control: 'radio',
      options: ['desktop', 'mobile'],
      description: 'Visual variant: desktop (default) or mobile (compact).'
    },
    itemsPerPageDropdownPosition: {
      control: 'radio',
      options: ['auto', 'top', 'bottom'],
      description:
        'Dropdown placement: auto chooses based on viewport; top/bottom forces placement.'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Pagination>;

/* -------------------------------------------------------------------------------------------------
 * DESKTOP
 * ------------------------------------------------------------------------------------------------- */

export const DesktopDefault: Story = {
  name: 'Desktop / Default',
  args: {
    variant: 'desktop',
    page: 3,
    totalPages: 10
  }
};

export const DesktopDisabled: Story = {
  name: 'Desktop / Disabled',
  args: {
    variant: 'desktop',
    page: 5,
    totalPages: 10,
    disabled: true
  }
};

export const DesktopSinglePage: Story = {
  name: 'Desktop / Single Page',
  args: {
    variant: 'desktop',
    page: 1,
    totalPages: 1
  }
};

export const DesktopSmallPageCount: Story = {
  name: 'Desktop / Small (5 Pages)',
  args: {
    variant: 'desktop',
    page: 3,
    totalPages: 5
  }
};

export const DesktopLargePageCount: Story = {
  name: 'Desktop / Large (100 Pages)',
  args: {
    variant: 'desktop',
    page: 50,
    totalPages: 100
  }
};

export const DesktopVeryLargePageCount: Story = {
  name: 'Desktop / Very Large (10000 Pages)',
  args: {
    variant: 'desktop',
    page: 5000,
    totalPages: 10000
  }
};

/* -------------------------------------------------------------------------------------------------
 * ELLIPSIS BEHAVIOR
 * ------------------------------------------------------------------------------------------------- */

export const DesktopWithLeftEllipsis: Story = {
  name: 'Desktop / Ellipsis (Left)',
  args: {
    variant: 'desktop',
    page: 8,
    totalPages: 10
  }
};

export const DesktopWithRightEllipsis: Story = {
  name: 'Desktop / Ellipsis (Right)',
  args: {
    variant: 'desktop',
    page: 3,
    totalPages: 20
  }
};

export const DesktopWithBothEllipses: Story = {
  name: 'Desktop / Ellipsis (Both)',
  args: {
    variant: 'desktop',
    page: 10,
    totalPages: 20
  }
};

/* -------------------------------------------------------------------------------------------------
 * OPTIONAL FEATURES
 * ------------------------------------------------------------------------------------------------- */

export const DesktopWithItemsPerPage: Story = {
  name: 'Desktop / Items Per Page',
  args: {
    variant: 'desktop',
    page: 1,
    totalPages: 10,
    showItemsPerPage: true,
    itemsPerPage: 10
  }
};

export const DesktopWithItemsPerPageDropdownBottom: Story = {
  name: 'Desktop / Items Per Page (Dropdown Bottom)',
  args: {
    variant: 'desktop',
    page: 1,
    totalPages: 10,
    showItemsPerPage: true,
    itemsPerPage: 10,
    itemsPerPageDropdownPosition: 'bottom'
  }
};

export const DesktopWithItemsPerPageDropdownTop: Story = {
  name: 'Desktop / Items Per Page (Dropdown Top)',
  args: {
    variant: 'desktop',
    page: 1,
    totalPages: 10,
    showItemsPerPage: true,
    itemsPerPage: 10,
    itemsPerPageDropdownPosition: 'top'
  }
};

export const DesktopWithGoTo: Story = {
  name: 'Desktop / Go To',
  args: {
    variant: 'desktop',
    page: 1,
    totalPages: 100,
    showGoTo: true,
    goToPlaceholder: 'e.g. 102'
  },
  parameters: {
    docs: {
      description: {
        story:
          'Type an invalid page number (e.g. 999) and press Enter to see the inline error.'
      }
    }
  }
};

export const DesktopFullFeatured: Story = {
  name: 'Desktop / Full Featured',
  args: {
    variant: 'desktop',
    page: 1,
    totalPages: 10,
    showItemsPerPage: true,
    itemsPerPage: 10,
    showGoTo: true,
    goToPlaceholder: 'e.g. 102'
  }
};

/* -------------------------------------------------------------------------------------------------
 * MOBILE
 * ------------------------------------------------------------------------------------------------- */

export const MobileDefault: Story = {
  name: 'Mobile / Default',
  args: {
    variant: 'mobile',
    page: 1,
    totalPages: 10
  }
};

export const MobileMiddlePage: Story = {
  name: 'Mobile / Middle Page',
  args: {
    variant: 'mobile',
    page: 2,
    totalPages: 1000
  }
};

export const MobileLastPage: Story = {
  name: 'Mobile / Last Page',
  args: {
    variant: 'mobile',
    page: 1000,
    totalPages: 1000
  }
};

export const MobileDisabled: Story = {
  name: 'Mobile / Disabled',
  args: {
    variant: 'mobile',
    page: 5,
    totalPages: 10,
    disabled: true
  }
};

/* -------------------------------------------------------------------------------------------------
 * INTERACTIVE DEMOS
 * ------------------------------------------------------------------------------------------------- */

function InteractiveDesktopTemplate(): ReactElement {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 20;

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  return (
    <Pagination
      variant="desktop"
      page={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
}

export const InteractiveDesktop: Story = {
  name: 'Interactive / Desktop',
  render: () => <InteractiveDesktopTemplate />
};

function InteractiveDesktopCustomConfigTemplate(): ReactElement {
  const [currentPage, setCurrentPage] = useState(50);
  const totalPages = 100;

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  return (
    <Pagination
      variant="desktop"
      page={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      siblingCount={2}
      boundaryCount={2}
    />
  );
}

export const InteractiveDesktopCustomConfig: Story = {
  name: 'Interactive / Desktop (Custom Range)',
  render: () => <InteractiveDesktopCustomConfigTemplate />
};

function InteractiveFullFeaturedTemplate(): ReactElement {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalItems = 1000;
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }, [itemsPerPage]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  }, []);

  return (
    <Pagination
      variant="desktop"
      page={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      showItemsPerPage
      itemsPerPage={itemsPerPage}
      onItemsPerPageChange={handleItemsPerPageChange}
      showGoTo
      goToPlaceholder="e.g. 102"
    />
  );
}

export const InteractiveFullFeatured: Story = {
  name: 'Interactive / Full Featured',
  render: () => <InteractiveFullFeaturedTemplate />
};

function InteractiveMobileTemplate(): ReactElement {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  return (
    <div style={{ width: '320px' }}>
      <Pagination
        variant="mobile"
        page={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export const InteractiveMobile: Story = {
  name: 'Interactive / Mobile',
  render: () => <InteractiveMobileTemplate />
};
