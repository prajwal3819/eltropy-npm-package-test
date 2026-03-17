import { forwardRef, useEffect, useState, useCallback } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Button } from '../Button';
import { Portal } from '@chakra-ui/react';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  title?: string;
  children: React.ReactNode;
  showHandle?: boolean;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  cancelLabel?: string;
  confirmLabel?: string;
  minHeight?: string;
  maxHeight?: string;
  height?: string;
}

export const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(
  (
    {
      isOpen,
      onClose,
      onCancel,
      onConfirm,
      title,
      children,
      showHandle = true,
      showCancelButton = true,
      showConfirmButton = true,
      cancelLabel = 'Cancel',
      confirmLabel = 'Done',
      minHeight = '300px',
      maxHeight = '90vh',
      height = 'auto',
    },
    ref,
  ) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
      if (isOpen) {
        setIsAnimating(true);
        document.body.style.overflow = 'hidden';
      } else {
        const timer = setTimeout(() => setIsAnimating(false), 300);
        document.body.style.overflow = '';
        return () => clearTimeout(timer);
      }
    }, [isOpen]);

    const handleBackdropClick = useCallback(() => {
      onClose();
    }, [onClose]);

    const handleCancelClick = useCallback(() => {
      onCancel?.();
      onClose();
    }, [onCancel, onClose]);

    const handleConfirmClick = useCallback(() => {
      onConfirm?.();
      onClose();
    }, [onConfirm, onClose]);

    if (!isOpen && !isAnimating) return null;

    return (
      <Portal>
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex="1400"
          onClick={handleBackdropClick}
        >
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="rgba(17, 48, 79, 0.36)"
            opacity={isOpen ? 1 : 0}
            transition="opacity 0.3s ease-in-out"
          />

          <Flex
            ref={ref}
            position="absolute"
            bottom="0"
            left="50%"
            transform={
              isOpen
                ? 'translateX(-50%) translateY(0)'
                : 'translateX(-50%) translateY(100%)'
            }
            transition="transform 0.3s ease-in-out"
            bg="white"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
            boxShadow="0px 7px 15px 0px rgba(30, 31, 33, 0.1)"
            width="100%"
            maxWidth="600px"
            minHeight={minHeight}
            maxHeight={maxHeight}
            height={height}
            flexDirection="column"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'bottom-sheet-title' : undefined}
          >
            {showHandle && (
              <Flex
                position="absolute"
                top="8px"
                left="50%"
                transform="translateX(-50%)"
                width="40px"
                height="4px"
                bg="gray.200"
                borderRadius="4px"
                cursor="grab"
              />
            )}

            <Flex
              flexDirection="column"
              gap="20px"
              padding="20px"
              flex="1"
              overflowY="auto"
            >
              {title && (
                <Flex
                  borderBottom="1px solid"
                  borderColor="gray.200"
                  paddingBottom="16px"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Text
                    id="bottom-sheet-title"
                    fontSize="18px"
                    fontWeight="medium"
                    color="navyGray.700"
                  >
                    {title}
                  </Text>
                </Flex>
              )}

              <Box flex="1">{children}</Box>

              {(showCancelButton || showConfirmButton) && (
                <Flex gap="12px" alignItems="center" justifyContent="center">
                  {showCancelButton && (
                    <Button
                      flex="1"
                      variant="outlinedFilled"
                      size="md"
                      onClick={handleCancelClick}
                    >
                      {cancelLabel}
                    </Button>
                  )}
                  {showConfirmButton && (
                    <Button
                      flex={showCancelButton ? '1' : 'auto'}
                      variant="primary"
                      size="md"
                      onClick={handleConfirmClick}
                    >
                      {confirmLabel}
                    </Button>
                  )}
                </Flex>
              )}
            </Flex>
          </Flex>
        </Box>
      </Portal>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';
