import type { Meta, StoryObj } from '@storybook/react';
import {
  Box,
  VStack,
  HStack,
  Code,
  Heading as ChakraHeading
} from '@chakra-ui/react';
import {
  fonts,
  fontSizes,
  fontWeights,
  lineHeights
} from '../theme/tokens/typography';
import { Text } from '../components/typography/text';

const meta: Meta = {
  title: 'Design System/Typography',
  parameters: {
    layout: 'padded'
  }
};

export default meta;

type Story = StoryObj;

export const FontFamilies: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text variant="heading" size={24} weight="Bold" mb={2}>
          Font Families
        </Text>
        <Text variant="body" size={14} weight="Regular" color="gray.600" mb={6}>
          The typefaces used throughout the design system.
        </Text>
      </Box>

      <VStack align="stretch" gap={4}>
        <Box>
          <HStack justify="space-between" mb={2}>
            <Text variant="body" size={14} weight="Medium">
              Heading Font
            </Text>
            <Code fontSize="sm">{fonts.heading}</Code>
          </HStack>
          <Box fontFamily={fonts.heading} fontSize="24px">
            The quick brown fox jumps over the lazy dog
          </Box>
        </Box>

        <Box>
          <HStack justify="space-between" mb={2}>
            <Text variant="body" size={14} weight="Medium">
              Body Font
            </Text>
            <Code fontSize="sm">{fonts.body}</Code>
          </HStack>
          <Box fontFamily={fonts.body} fontSize="24px">
            The quick brown fox jumps over the lazy dog
          </Box>
        </Box>

        <Box>
          <HStack justify="space-between" mb={2}>
            <Text variant="body" size={14} weight="Medium">
              Monospace Font
            </Text>
            <Code fontSize="sm">{fonts.mono}</Code>
          </HStack>
          <Box fontFamily={fonts.mono} fontSize="24px">
            The quick brown fox jumps over the lazy dog
          </Box>
        </Box>
      </VStack>
    </VStack>
  )
};

export const FontSizes: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text variant="heading" size={24} weight="Bold" mb={2}>
          Font Sizes
        </Text>
        <Text variant="body" size={14} weight="Regular" color="gray.600" mb={6}>
          The type scale used for consistent sizing.
        </Text>
      </Box>

      <VStack align="stretch" gap={3}>
        {Object.entries(fontSizes).map(([key, value]) => (
          <HStack key={key} align="center" gap={4}>
            <Box minW="80px">
              <Code fontSize="sm">{key}</Code>
            </Box>
            <Box minW="60px">
              <Text variant="body" size={12} weight="Regular" color="gray.600">
                {value}
              </Text>
            </Box>
            <Box fontSize={value}>
              The quick brown fox jumps over the lazy dog
            </Box>
          </HStack>
        ))}
      </VStack>
    </VStack>
  )
};

export const FontWeights: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text variant="heading" size={24} weight="Bold" mb={2}>
          Font Weights
        </Text>
        <Text variant="body" size={14} weight="Regular" color="gray.600" mb={6}>
          The font weights available in the design system.
        </Text>
      </Box>

      <VStack align="stretch" gap={4}>
        {Object.entries(fontWeights).map(([key, value]) => (
          <Box key={key}>
            <HStack justify="space-between" mb={2}>
              <Text
                variant="body"
                size={14}
                weight="Medium"
                textTransform="capitalize"
              >
                {key}
              </Text>
              <Code fontSize="sm">{value}</Code>
            </HStack>
            <Box fontWeight={value} fontSize="24px">
              The quick brown fox jumps over the lazy dog
            </Box>
          </Box>
        ))}
      </VStack>
    </VStack>
  )
};

export const LineHeights: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text variant="heading" size={24} weight="Bold" mb={2}>
          Line Heights
        </Text>
        <Text variant="body" size={14} weight="Regular" color="gray.600" mb={6}>
          The line height scale for consistent vertical rhythm.
        </Text>
      </Box>

      <VStack align="stretch" gap={4}>
        {Object.entries(lineHeights).map(([key, value]) => (
          <Box
            key={key}
            borderWidth="1px"
            borderColor="gray.200"
            p={4}
            borderRadius="md"
          >
            <HStack justify="space-between" mb={2}>
              <Code fontSize="sm">{key}</Code>
              <Text variant="body" size={12} weight="Regular" color="gray.600">
                {value}
              </Text>
            </HStack>
            <Box lineHeight={value} fontSize="16px">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </Box>
          </Box>
        ))}
      </VStack>
    </VStack>
  )
};

export const HeadingStyles: Story = {
  render: () => (
    <VStack align="stretch" gap={8} p={6}>
      <Box>
        <Text variant="heading" size={24} weight="Bold" mb={2}>
          Heading Styles
        </Text>
        <Text variant="body" size={14} weight="Regular" color="gray.600" mb={6}>
          Typography styles for headings using ABC Diatype font.
        </Text>
      </Box>

      <VStack align="stretch" gap={6}>
        <Box>
          <ChakraHeading size="md" mb={4}>
            Large Headings
          </ChakraHeading>
          <VStack align="stretch" gap={4}>
            <Box>
              <Code fontSize="sm" mb={2}>
                heading/regular/120
              </Code>
              <Text variant="heading" size={120} weight="Regular">
                Heading 120px Regular
              </Text>
            </Box>
            <Box>
              <Code fontSize="sm" mb={2}>
                heading/bold/96
              </Code>
              <Text variant="heading" size={96} weight="Bold">
                Heading 96px Bold
              </Text>
            </Box>
            <Box>
              <Code fontSize="sm" mb={2}>
                heading/regular/72
              </Code>
              <Text variant="heading" size={72} weight="Regular">
                Heading 72px Regular
              </Text>
            </Box>
          </VStack>
        </Box>

        <Box>
          <ChakraHeading size="md" mb={4}>
            Medium Headings
          </ChakraHeading>
          <VStack align="stretch" gap={4}>
            <Box>
              <Code fontSize="sm" mb={2}>
                heading/bold/48
              </Code>
              <Text variant="heading" size={48} weight="Bold">
                Heading 48px Bold
              </Text>
            </Box>
            <Box>
              <Code fontSize="sm" mb={2}>
                heading/regular/40
              </Code>
              <Text variant="heading" size={40} weight="Regular">
                Heading 40px Regular
              </Text>
            </Box>
            <Box>
              <Code fontSize="sm" mb={2}>
                heading/bold/32
              </Code>
              <Text variant="heading" size={32} weight="Bold">
                Heading 32px Bold
              </Text>
            </Box>
          </VStack>
        </Box>

        <Box>
          <ChakraHeading size="md" mb={4}>
            Small Headings
          </ChakraHeading>
          <VStack align="stretch" gap={4}>
            <Box>
              <Code fontSize="sm" mb={2}>
                heading/regular/24
              </Code>
              <Text variant="heading" size={24} weight="Regular">
                Heading 24px Regular
              </Text>
            </Box>
            <Box>
              <Code fontSize="sm" mb={2}>
                heading/bold/20
              </Code>
              <Text variant="heading" size={20} weight="Bold">
                Heading 20px Bold
              </Text>
            </Box>
            <Box>
              <Code fontSize="sm" mb={2}>
                heading/regular/16
              </Code>
              <Text variant="heading" size={16} weight="Regular">
                Heading 16px Regular
              </Text>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </VStack>
  )
};

export const BodyStyles: Story = {
  render: () => (
    <VStack align="stretch" gap={8} p={6}>
      <Box>
        <Text variant="heading" size={24} weight="Bold" mb={2}>
          Body Styles
        </Text>
        <Text variant="body" size={14} weight="Regular" color="gray.600" mb={6}>
          Typography styles for body text with Regular, Medium, and Bold
          weights.
        </Text>
      </Box>

      <VStack align="stretch" gap={6}>
        <Box>
          <ChakraHeading size="md" mb={4}>
            Body 24px
          </ChakraHeading>
          <VStack align="stretch" gap={3}>
            <Box>
              <Code fontSize="sm" mb={2}>
                body/regular/24
              </Code>
              <Text variant="body" size={24} weight="Regular">
                Body 24px Regular - Lorem ipsum dolor sit amet, consectetur
                adipiscing elit.
              </Text>
            </Box>
            <Box>
              <Code fontSize="sm" mb={2}>
                body/medium/24
              </Code>
              <Text variant="body" size={24} weight="Medium">
                Body 24px Medium - Lorem ipsum dolor sit amet, consectetur
                adipiscing elit.
              </Text>
            </Box>
            <Box>
              <Code fontSize="sm" mb={2}>
                body/bold/24
              </Code>
              <Text variant="body" size={24} weight="Bold">
                Body 24px Bold - Lorem ipsum dolor sit amet, consectetur
                adipiscing elit.
              </Text>
            </Box>
          </VStack>
        </Box>

        <Box>
          <ChakraHeading size="md" mb={4}>
            Body 18px
          </ChakraHeading>
          <VStack align="stretch" gap={3}>
            <Box>
              <Code fontSize="sm" mb={2}>
                body/regular/18
              </Code>
              <Text variant="body" size={18} weight="Regular">
                Body 18px Regular - Lorem ipsum dolor sit amet, consectetur
                adipiscing elit.
              </Text>
            </Box>
            <Box>
              <Code fontSize="sm" mb={2}>
                body/medium/18
              </Code>
              <Text variant="body" size={18} weight="Medium">
                Body 18px Medium - Lorem ipsum dolor sit amet, consectetur
                adipiscing elit.
              </Text>
            </Box>
            <Box>
              <Code fontSize="sm" mb={2}>
                body/bold/18
              </Code>
              <Text variant="body" size={18} weight="Bold">
                Body 18px Bold - Lorem ipsum dolor sit amet, consectetur
                adipiscing elit.
              </Text>
            </Box>
          </VStack>
        </Box>

        <Box>
          <ChakraHeading size="md" mb={4}>
            Body 14px
          </ChakraHeading>
          <VStack align="stretch" gap={3}>
            <Box>
              <Code fontSize="sm" mb={2}>
                body/regular/14
              </Code>
              <Text variant="body" size={14} weight="Regular">
                Body 14px Regular - Lorem ipsum dolor sit amet, consectetur
                adipiscing elit.
              </Text>
            </Box>
            <Box>
              <Code fontSize="sm" mb={2}>
                body/medium/14
              </Code>
              <Text variant="body" size={14} weight="Medium">
                Body 14px Medium - Lorem ipsum dolor sit amet, consectetur
                adipiscing elit.
              </Text>
            </Box>
            <Box>
              <Code fontSize="sm" mb={2}>
                body/bold/14
              </Code>
              <Text variant="body" size={14} weight="Bold">
                Body 14px Bold - Lorem ipsum dolor sit amet, consectetur
                adipiscing elit.
              </Text>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </VStack>
  )
};

export const LabelAndCaptionStyles: Story = {
  render: () => (
    <VStack align="stretch" gap={8} p={6}>
      <Box>
        <Text variant="heading" size={24} weight="Bold" mb={2}>
          Label & Caption Styles
        </Text>
        <Text variant="body" size={14} weight="Regular" color="gray.600" mb={6}>
          Typography styles for labels and captions.
        </Text>
      </Box>

      <VStack align="stretch" gap={6}>
        <Box>
          <ChakraHeading size="md" mb={4}>
            Labels
          </ChakraHeading>
          <VStack align="stretch" gap={3}>
            <Box>
              <Code fontSize="sm" mb={2}>
                label/medium/16
              </Code>
              <Text variant="label" size={16} weight="Medium">
                Label 16px Medium
              </Text>
            </Box>
            <Box>
              <Code fontSize="sm" mb={2}>
                label/regular/14
              </Code>
              <Text variant="label" size={14} weight="Regular">
                Label 14px Regular
              </Text>
            </Box>
          </VStack>
        </Box>

        <Box>
          <ChakraHeading size="md" mb={4}>
            Captions
          </ChakraHeading>
          <VStack align="stretch" gap={3}>
            <Box>
              <Code fontSize="sm" mb={2}>
                caption/regular/12
              </Code>
              <Text variant="caption" size={12} weight="Regular">
                Caption 12px Regular - Small descriptive text
              </Text>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </VStack>
  )
};
