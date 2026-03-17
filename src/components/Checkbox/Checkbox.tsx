import { forwardRef } from 'react';
import { Checkbox as ChakraCheckbox, useSlotRecipe } from '@chakra-ui/react';
import { checkboxRecipe } from '../../theme/recipes/checkbox.recipe';

export interface CheckboxProps extends Omit<ChakraCheckbox.RootProps, 'size'> {
  /**
   * Size variant
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
}

export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(
  ({ size = 'md', children, ...rest }, ref) => {
    const recipe = useSlotRecipe({ recipe: checkboxRecipe });
    const styles = recipe({ size });

    return (
      <ChakraCheckbox.Root ref={ref} css={styles.root} {...rest}>
        <ChakraCheckbox.HiddenInput />
        <ChakraCheckbox.Control css={styles.control}>
          <ChakraCheckbox.Indicator css={styles.indicator} />
        </ChakraCheckbox.Control>
        {children != null && (
          <ChakraCheckbox.Label css={styles.label}>
            {children}
          </ChakraCheckbox.Label>
        )}
      </ChakraCheckbox.Root>
    );
  },
);

Checkbox.displayName = 'Checkbox';
