import type { Meta, StoryObj } from '@storybook/react';
import { Box, Grid, Text, VStack } from '@chakra-ui/react';
import * as Icons from '../assets/icons/index';

const meta = {
  title: 'Assets/Icons',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {
  render: () => {
    const iconEntries = Object.entries(Icons);

    return (
      <Box p={6}>
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          Icon Library ({iconEntries.length} icons)
        </Text>
        <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={6}>
          {iconEntries.map(([name, IconComponent]) => (
            <VStack
              key={name}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              borderColor="gray.200"
              _hover={{
                borderColor: 'blue.500',
                bg: 'gray.50',
                transform: 'translateY(-2px)',
                shadow: 'md',
              }}
              transition="all 0.2s"
              align="center"
              gap={3}
            >
              <Box fontSize="32px" color="gray.700">
                <IconComponent />
              </Box>
              <Text fontSize="sm" textAlign="center" wordBreak="break-word">
                {name}
              </Text>
            </VStack>
          ))}
        </Grid>
      </Box>
    );
  },
};

export const IconSizes: Story = {
  render: () => {
    const [firstIconName, FirstIcon] = Object.entries(Icons)[0];
    const sizes = ['12px', '16px', '24px', '32px', '48px', '64px'];

    return (
      <Box p={6}>
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          Icon Sizes (using {firstIconName})
        </Text>
        <Grid templateColumns="repeat(auto-fill, minmax(120px, 1fr))" gap={6}>
          {sizes.map((size) => (
            <VStack
              key={size}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              borderColor="gray.200"
              align="center"
              gap={3}
            >
              <Box fontSize={size} color="gray.700">
                <FirstIcon />
              </Box>
              <Text fontSize="sm">{size}</Text>
            </VStack>
          ))}
        </Grid>
      </Box>
    );
  },
};

export const IconColors: Story = {
  render: () => {
    const [firstIconName, FirstIcon] = Object.entries(Icons)[0];
    const colors = [
      { name: 'Gray', value: 'gray.700' },
      { name: 'Blue', value: 'blue.500' },
      { name: 'Green', value: 'green.500' },
      { name: 'Red', value: 'red.500' },
      { name: 'Purple', value: 'purple.500' },
      { name: 'Orange', value: 'orange.500' },
    ];

    return (
      <Box p={6}>
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          Icon Colors (using {firstIconName})
        </Text>
        <Grid templateColumns="repeat(auto-fill, minmax(120px, 1fr))" gap={6}>
          {colors.map(({ name, value }) => (
            <VStack
              key={name}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              borderColor="gray.200"
              align="center"
              gap={3}
            >
              <Box fontSize="32px" color={value}>
                <FirstIcon />
              </Box>
              <Text fontSize="sm">{name}</Text>
            </VStack>
          ))}
        </Grid>
      </Box>
    );
  },
};
