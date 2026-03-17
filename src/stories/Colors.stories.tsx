import type { Meta, StoryObj } from '@storybook/react';
import { Box, Grid, Heading, Text, VStack, HStack } from '@chakra-ui/react';
import { colors } from '../theme/tokens/colors';

const meta: Meta = {
  title: 'Design System/Colors',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj;

const ColorSwatch = ({ name, value }: { name: string; value: string }) => (
  <VStack align="stretch" gap={2}>
    <Box
      bg={value}
      h="80px"
      borderRadius="md"
      borderWidth="1px"
      borderColor="gray.200"
    />
    <VStack align="start" gap={0}>
      <Text fontSize="sm" fontWeight="medium">
        {name}
      </Text>
      <Text fontSize="xs" color="gray.600">
        {value}
      </Text>
    </VStack>
  </VStack>
);

const ColorPalette = ({
  title,
  colorObj,
}: {
  title: string;
  colorObj: Record<string, string>;
}) => (
  <VStack align="stretch" gap={4} mb={8}>
    <Heading size="md">{title}</Heading>
    <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={4}>
      {Object.entries(colorObj).map(([key, value]) => (
        <ColorSwatch key={key} name={key} value={value} />
      ))}
    </Grid>
  </VStack>
);

export const AllColors: Story = {
  render: () => (
    <VStack align="stretch" gap={8} p={6}>
      <Box>
        <Heading size="lg" mb={2}>
          Color Palette
        </Heading>
        <Text color="gray.600" mb={6}>
          The complete color system used throughout the design system.
        </Text>
      </Box>

      <ColorPalette title="Base Colors" colorObj={colors.base} />
      <ColorPalette title="Green" colorObj={colors.green} />
      <ColorPalette title="Blue" colorObj={colors.blue} />
      <ColorPalette title="Gray" colorObj={colors.gray} />
      <ColorPalette title="Navy Gray" colorObj={colors.navyGray} />
      <ColorPalette title="Violet" colorObj={colors.violet} />
      <ColorPalette title="Yellow" colorObj={colors.yellow} />
      <ColorPalette title="Success Green" colorObj={colors.successGreen} />
      <ColorPalette title="Red" colorObj={colors.red} />
      <ColorPalette title="Orange" colorObj={colors.orange} />
    </VStack>
  ),
};

export const SemanticColors: Story = {
  render: () => (
    <VStack align="stretch" gap={8} p={6}>
      <Box>
        <Heading size="lg" mb={2}>
          Semantic Colors
        </Heading>
        <Text color="gray.600" mb={6}>
          Purpose-driven colors for consistent UI patterns.
        </Text>
      </Box>

      <VStack align="stretch" gap={6}>
        <Box>
          <Heading size="sm" mb={4}>
            Brand
          </Heading>
          <HStack gap={4}>
            <ColorSwatch name="Primary" value={colors.green[200]} />
            <ColorSwatch name="Secondary" value={colors.blue[200]} />
          </HStack>
        </Box>

        <Box>
          <Heading size="sm" mb={4}>
            Status Colors
          </Heading>
          <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={4}>
            <ColorSwatch name="Success" value={colors.successGreen[200]} />
            <ColorSwatch name="Error" value={colors.red[200]} />
            <ColorSwatch name="Warning" value={colors.yellow[200]} />
            <ColorSwatch name="Info" value={colors.blue[200]} />
          </Grid>
        </Box>
      </VStack>
    </VStack>
  ),
};
