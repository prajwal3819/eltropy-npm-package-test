import {
  Tooltip as ChakraTooltip,
  Portal,
  useSlotRecipe
} from '@chakra-ui/react';
import * as React from 'react';

type Placement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end'
  | 'right-start'
  | 'right-end';

export interface TooltipProps extends ChakraTooltip.RootProps {
  showArrow?: boolean;
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  content: React.ReactNode;
  children: React.ReactElement;
  contentProps?: ChakraTooltip.ContentProps;
  disabled?: boolean;
  placement?: Placement;
}

export const Tooltip = React.forwardRef<HTMLElement, TooltipProps>(
  function Tooltip(props, ref) {
    const {
      showArrow = true,
      children,
      disabled,
      portalled = true,
      portalRef,
      content,
      contentProps,
      placement,
      ...rest
    } = props;

    const recipe = useSlotRecipe({ key: 'tooltip' });

    const styles = recipe({});

    if (disabled || !content) {
      return React.cloneElement(children, {
        ref
      } as React.RefAttributes<HTMLElement>);
    }

    return (
      <ChakraTooltip.Root
        {...rest}
        positioning={{ placement: placement || 'top' }}
      >
        <ChakraTooltip.Trigger
          asChild
          ref={ref as React.Ref<HTMLButtonElement>}
          css={styles.trigger}
        >
          {children}
        </ChakraTooltip.Trigger>

        <Portal disabled={!portalled} container={portalRef}>
          <ChakraTooltip.Positioner css={styles.positioner}>
            <ChakraTooltip.Content css={styles.content} {...contentProps}>
              {showArrow && (
                <ChakraTooltip.Arrow css={styles.arrow}>
                  <ChakraTooltip.ArrowTip css={styles.arrowTip} />
                </ChakraTooltip.Arrow>
              )}
              {content}
            </ChakraTooltip.Content>
          </ChakraTooltip.Positioner>
        </Portal>
      </ChakraTooltip.Root>
    );
  }
);

Tooltip.displayName = 'Tooltip';