import type { Meta, StoryObj } from '@storybook/react';
import {
  Box,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Code,
} from '@chakra-ui/react';
import { spacing, sizes, radii } from '../theme/tokens/spacing';

const meta: Meta = {
  title: 'Design System/Spacing',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj;

export const SpacingScale: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Heading size="lg" mb={2}>
          Spacing Scale
        </Heading>
        <Text color="gray.600" mb={6}>
          The spacing scale used for margins, padding, and gaps.
        </Text>
      </Box>

      <VStack align="stretch" gap={4}>
        {Object.entries(spacing).map(([key, value]) => (
          <HStack key={key} align="center" gap={4}>
            <Box minW="60px">
              <Code fontSize="sm">{key}</Code>
            </Box>
            <Box minW="80px">
              <Text fontSize="sm" color="gray.600">
                {value}
              </Text>
            </Box>
            <Box bg="blue.200" h="40px" w={value} borderRadius="sm" />
          </HStack>
        ))}
      </VStack>
    </VStack>
  ),
};

export const ContainerSizes: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Heading size="lg" mb={2}>
          Container Sizes
        </Heading>
        <Text color="gray.600" mb={6}>
          Maximum widths for container components at different breakpoints.
        </Text>
      </Box>

      <VStack align="stretch" gap={4}>
        {Object.entries(sizes.container).map(([key, value]) => (
          <Box key={key}>
            <HStack justify="space-between" mb={2}>
              <Code fontSize="sm">{key}</Code>
              <Text fontSize="sm" color="gray.600">
                {value}
              </Text>
            </HStack>
            <Box
              bg="violet.200"
              h="60px"
              maxW={value}
              borderRadius="md"
              borderWidth="2px"
              borderColor="violet.400"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontWeight="medium" color="violet.900">
                Container {key.toUpperCase()}
              </Text>
            </Box>
          </Box>
        ))}
      </VStack>
    </VStack>
  ),
};

export const BorderRadii: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Heading size="lg" mb={2}>
          Border Radius
        </Heading>
        <Text color="gray.600" mb={6}>
          The border radius scale for rounded corners.
        </Text>
      </Box>

      <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
        {Object.entries(radii).map(([key, value]) => (
          <VStack key={key} align="stretch" gap={2}>
            <Box
              bg="gray.100"
              h="120px"
              borderRadius={value}
              borderWidth="2px"
              borderColor="gray.300"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <VStack gap={1}>
                <Code fontSize="sm">{key}</Code>
                <Text fontSize="xs" color="gray.600">
                  {value}
                </Text>
              </VStack>
            </Box>
          </VStack>
        ))}
      </Grid>
    </VStack>
  ),
};

export const SpacingExamples: Story = {
  render: () => (
    <VStack align="stretch" gap={8} p={6}>
      <Box>
        <Heading size="lg" mb={2}>
          Spacing Examples
        </Heading>
        <Text color="gray.600" mb={6}>
          Common spacing patterns using the spacing scale.
        </Text>
      </Box>

      <VStack align="stretch" gap={6}>
        <Box>
          <Heading size="sm" mb={4}>
            Padding Examples
          </Heading>
          <VStack align="stretch" gap={4}>
            {[2, 4, 6, 8].map((size) => (
              <Box key={size}>
                <Code fontSize="sm" mb={2}>
                  p={size}
                </Code>
                <Box
                  bg="blue.50"
                  borderWidth="2px"
                  borderColor="blue.200"
                  borderRadius="md"
                  p={spacing[size as keyof typeof spacing]}
                >
                  <Box bg="blue.200" p={2} borderRadius="sm">
                    <Text fontSize="sm">Content with padding {size}</Text>
                  </Box>
                </Box>
              </Box>
            ))}
          </VStack>
        </Box>

        <Box>
          <Heading size="sm" mb={4}>
            Gap Examples
          </Heading>
          <VStack align="stretch" gap={4}>
            {[2, 4, 6, 8].map((size) => (
              <Box key={size}>
                <Code fontSize="sm" mb={2}>
                  gap={size}
                </Code>
                <HStack gap={spacing[size as keyof typeof spacing]}>
                  <Box bg="green.200" p={4} borderRadius="md" flex="1">
                    <Text fontSize="sm">Item 1</Text>
                  </Box>
                  <Box bg="green.200" p={4} borderRadius="md" flex="1">
                    <Text fontSize="sm">Item 2</Text>
                  </Box>
                  <Box bg="green.200" p={4} borderRadius="md" flex="1">
                    <Text fontSize="sm">Item 3</Text>
                  </Box>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>
    </VStack>
  ),
};
