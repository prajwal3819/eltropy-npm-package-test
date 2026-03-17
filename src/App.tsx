import { Box, Heading, Text } from '@chakra-ui/react';

function App() {
  return (
    <Box p={8} maxW="1200px" mx="auto">
      <Heading as="h1" size="2xl" mb={2} color="text.heading">
        Radiant V2 Design System
      </Heading>
      <Text fontSize="lg" color="text.subtext" mb={8}>
        A modern React component library built with Chakra UI v3
      </Text>
    </Box>
  );
}

export default App;
