import React from 'react';
import { Box, VStack, Heading, Text, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { useBrochure } from '@/hooks/useBrochure';

const TestBrochureAPI: React.FC = () => {
  const { sections, loading, error } = useBrochure();

  return (
    <Box p={6}>
      <VStack spacing={6} align='stretch'>
        <Heading size='lg'>Brochure API Test</Heading>

        {loading && (
          <Box textAlign='center' py={10}>
            <Spinner size='xl' color='blue.500' />
            <Text mt={4}>Loading brochure content...</Text>
          </Box>
        )}

        {error && (
          <Alert status='error'>
            <AlertIcon />
            <Text>Error: {error}</Text>
          </Alert>
        )}

        {!loading && !error && sections.length > 0 && (
          <Box>
            <Text fontSize='lg' fontWeight='bold' mb={4}>
              Successfully loaded {sections.length} sections:
            </Text>
            <VStack spacing={2} align='stretch'>
              {sections.map(section => (
                <Box
                  key={section.id}
                  p={3}
                  border='1px solid'
                  borderColor='gray.200'
                  borderRadius='md'
                >
                  <Text fontWeight='bold'>{section.title}</Text>
                  <Text fontSize='sm' color='gray.600'>
                    {section.content.length} content blocks
                  </Text>
                </Box>
              ))}
            </VStack>
          </Box>
        )}

        {!loading && !error && sections.length === 0 && (
          <Box textAlign='center' py={10}>
            <Text>No brochure content loaded</Text>
            <Text fontSize='sm' color='gray.600' mt={2}>
              Click the button below to fetch content
            </Text>
          </Box>
        )}

        <Box textAlign='center'>
          <Text fontSize='sm' color='gray.600'>
            API Endpoint: GET /api/v1/brochures/myomectomy
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default TestBrochureAPI;
