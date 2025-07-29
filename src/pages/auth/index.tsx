import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Card,
  CardBody,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import SignIn from './signin';
import SignUp from './signup';

const Auth = () => {
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, gray.900, blue.900)'
  );

  return (
    <Box minH='100vh' bgGradient={bgGradient} py={10}>
      <Container maxW='lg'>
        <VStack spacing={8}>
          {/* Header */}
          <VStack spacing={4} textAlign='center'>
            <Badge colorScheme='blue' fontSize='md' px={4} py={2} borderRadius='full'>
              University of Michigan Health System
            </Badge>
            <Heading
              size='xl'
              bgGradient='linear(to-r, blue.600, purple.600)'
              bgClip='text'
              fontWeight='bold'
            >
              Welcome Back
            </Heading>
            <Text fontSize='lg' color='gray.600' maxW='md'>
              Sign in to access your personalized aftercare dashboard and track your recovery
              journey
            </Text>
          </VStack>

          {/* Auth Card */}
          <Card
            w='full'
            shadow='xl'
            borderRadius='xl'
            _hover={{ transform: 'translateY(-2px)', shadow: '2xl' }}
            transition='all 0.3s'
          >
            <CardBody p={8}>
              <Tabs isFitted variant='enclosed' colorScheme='blue'>
                <TabList mb={6} borderRadius='lg'>
                  <Tab
                    _selected={{
                      bg: 'blue.500',
                      color: 'white',
                      borderColor: 'blue.500',
                    }}
                    borderRadius='lg'
                    fontWeight='semibold'
                  >
                    Sign In
                  </Tab>
                  <Tab
                    _selected={{
                      bg: 'blue.500',
                      color: 'white',
                      borderColor: 'blue.500',
                    }}
                    borderRadius='lg'
                    fontWeight='semibold'
                  >
                    Sign Up
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel px={0}>
                    <SignIn />
                  </TabPanel>
                  <TabPanel px={0}>
                    <SignUp />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>

          {/* Footer */}
          <VStack spacing={4} textAlign='center'>
            <Text fontSize='sm' color='gray.500'>
              Secure access to your medical information
            </Text>
            <Text fontSize='xs' color='gray.400'>
              Protected by HIPAA-compliant security measures
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Auth;
