import { createContext, forwardRef, useContext } from 'react';
import { Box, Tabs as ChakraTabs, useSlotRecipe } from '@chakra-ui/react';
import type { SystemStyleObject } from '@chakra-ui/react';
import { tabsRecipe } from '../../theme/recipes/tabs.recipe';

// Create a context to share styles
const StylesContext = createContext<Record<string, SystemStyleObject> | null>(
  null
);

const useStyles = () => {
  const styles = useContext(StylesContext);
  if (!styles) {
    throw new Error('useStyles must be used within a StylesProvider');
  }
  return styles;
};

const StylesProvider = StylesContext.Provider;

export interface TabsProps extends ChakraTabs.RootProps {
  /**
   * The variant of the tabs.
   * @default 'line'
   */
  variant?: 'line' | 'enclosed';
  /**
   * The size of the tabs.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
}

const BaseTabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ variant = 'line', size = 'md', children, ...rest }, ref) => {
    const recipe = useSlotRecipe({ recipe: tabsRecipe });
    const styles = recipe({ variant, size });

    return (
      <ChakraTabs.Root ref={ref} variant={variant} size={size} {...rest}>
        <StylesProvider value={styles}>{children}</StylesProvider>
      </ChakraTabs.Root>
    );
  }
);

const TabList = forwardRef<HTMLDivElement, ChakraTabs.ListProps>(
  ({ children, ...rest }, ref) => {
    const styles = useStyles();
    return (
      <ChakraTabs.List ref={ref} css={styles.tablist} {...rest}>
        {children}
      </ChakraTabs.List>
    );
  }
);

export interface TabTriggerProps extends ChakraTabs.TriggerProps {
  /** Optional badge/count to display next to the tab text */
  badge?: React.ReactNode;
}

const Tab = forwardRef<HTMLButtonElement, TabTriggerProps>(
  ({ children, badge, ...rest }, ref) => {
    const styles = useStyles();
    return (
      <ChakraTabs.Trigger ref={ref} css={styles.tab} {...rest}>
        {children}
        {badge !== undefined && (
          <Box as="span" className="tab-badge" css={styles.badge}>
            {badge}
          </Box>
        )}
      </ChakraTabs.Trigger>
    );
  }
);

const TabPanels = forwardRef<HTMLDivElement, ChakraTabs.ContentGroupProps>(
  (props, ref) => {
    return <ChakraTabs.ContentGroup ref={ref} {...props} />;
  }
);

const TabPanel = forwardRef<HTMLDivElement, ChakraTabs.ContentProps>(
  (props, ref) => {
    return <ChakraTabs.Content ref={ref} {...props} />;
  }
);

const TabIndicator = forwardRef<HTMLDivElement, ChakraTabs.IndicatorProps>(
  (props, ref) => {
    const styles = useStyles();
    return <ChakraTabs.Indicator ref={ref} css={styles.indicator} {...props} />;
  }
);

export const Tabs = BaseTabs as typeof BaseTabs & {
  List: typeof TabList;
  Trigger: typeof Tab;
  ContentGroup: typeof TabPanels;
  Content: typeof TabPanel;
  Indicator: typeof TabIndicator;
};

Tabs.List = TabList;
Tabs.Trigger = Tab;
Tabs.ContentGroup = TabPanels;
Tabs.Content = TabPanel;
Tabs.Indicator = TabIndicator;

Tabs.displayName = 'Tabs';
TabList.displayName = 'Tabs.List';
Tab.displayName = 'Tabs.Trigger';
TabPanels.displayName = 'Tabs.ContentGroup';
TabPanel.displayName = 'Tabs.Content';
TabIndicator.displayName = 'Tabs.Indicator';
