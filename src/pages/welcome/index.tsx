import React from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router';

const Welcome = () => {
  const navigate = useNavigate();
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, gray.900, blue.900)'
  );

  const features = [
    {
      title: 'Track Recovery Progress',
      description:
        'Monitor your healing journey with detailed progress tracking and milestone celebrations.',
      icon: '📊',
      color: 'blue',
    },
    {
      title: 'Interactive Aftercare Guide',
      description:
        'Access your personalized brochure with checkboxes, notes, and symptom tracking.',
      icon: '📋',
      color: 'green',
    },
    {
      title: 'Pain Management',
      description: 'Log symptoms, track medication, and monitor warning signs in real-time.',
      icon: '💊',
      color: 'purple',
    },
    {
      title: '24/7 Support',
      description: 'Get instant access to recovery guidelines and emergency contact information.',
      icon: '🆘',
      color: 'red',
    },
  ];

  return (
    <Box minH='100vh' bgGradient={bgGradient}>
      {/* Hero Section */}
      <Container maxW='container.xl' py={20}>
        <VStack spacing={12} textAlign='center'>
          {/* Main Heading */}
          <VStack spacing={6}>
            <Badge colorScheme='blue' fontSize='md' px={4} py={2} borderRadius='full'>
              University of Michigan Health System
            </Badge>
            <Heading
              size='2xl'
              bgGradient='linear(to-r, blue.600, purple.600)'
              bgClip='text'
              fontWeight='bold'
            >
              Myomectomy Aftercare
            </Heading>
            <Text fontSize='xl' color='gray.600' maxW='3xl' lineHeight='tall'>
              Your personalized recovery companion. Track your progress, manage symptoms, and stay
              on top of your healing journey with our interactive aftercare guide.
            </Text>
          </VStack>

          {/* CTA Buttons */}
          <VStack spacing={6}>
            <HStack spacing={4}>
              <Button
                colorScheme='blue'
                size='lg'
                onClick={() => navigate('/auth')}
                px={8}
                py={6}
                fontSize='lg'
                fontWeight='semibold'
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition='all 0.2s'
              >
                Get Started
              </Button>
            </HStack>
            <Text fontSize='sm' color='gray.500'>
              Sign in or create an account to access your personalized dashboard
            </Text>
          </VStack>
        </VStack>
      </Container>

      {/* Features Section */}
      <Box bg='white' py={20}>
        <Container maxW='container.xl'>
          <VStack spacing={16}>
            <VStack spacing={4} textAlign='center'>
              <Heading size='lg' color='gray.800'>
                Everything You Need for Recovery
              </Heading>
              <Text fontSize='lg' color='gray.600' maxW='2xl'>
                Our comprehensive aftercare platform provides all the tools and resources you need
                for a successful recovery journey.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w='full'>
              {features.map((feature, index) => (
                <Card
                  key={index}
                  variant='outline'
                  _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
                  transition='all 0.3s'
                  cursor='pointer'
                >
                  <CardBody p={8}>
                    <VStack spacing={4} align='start'>
                      <Box fontSize='3xl' mb={2} filter='drop-shadow(0 2px 4px rgba(0,0,0,0.1))'>
                        {feature.icon}
                      </Box>
                      <Heading size='md' color='gray.800'>
                        {feature.title}
                      </Heading>
                      <Text color='gray.600' lineHeight='tall'>
                        {feature.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box bg='gray.50' py={16}>
        <Container maxW='container.xl'>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} textAlign='center'>
            <VStack spacing={2}>
              <Heading size='2xl' color='blue.600'>
                100%
              </Heading>
              <Text fontSize='lg' color='gray.600'>
                Patient Satisfaction
              </Text>
            </VStack>
            <VStack spacing={2}>
              <Heading size='2xl' color='green.600'>
                24/7
              </Heading>
              <Text fontSize='lg' color='gray.600'>
                Access to Care
              </Text>
            </VStack>
            <VStack spacing={2}>
              <Heading size='2xl' color='purple.600'>
                95%
              </Heading>
              <Text fontSize='lg' color='gray.600'>
                Recovery Success Rate
              </Text>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Footer CTA */}
      <Box bg='blue.600' py={16}>
        <Container maxW='container.xl'>
          <VStack spacing={6} textAlign='center'>
            <Heading size='lg' color='white'>
              Ready to Start Your Recovery Journey?
            </Heading>
            <Text fontSize='lg' color='blue.100' maxW='2xl'>
              Join thousands of patients who have successfully navigated their recovery with our
              comprehensive aftercare platform.
            </Text>
            <Button
              colorScheme='white'
              color='blue.600'
              size='lg'
              onClick={() => navigate('/auth')}
              px={8}
              py={6}
              fontSize='lg'
              fontWeight='semibold'
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
              transition='all 0.2s'
            >
              Get Started Today
            </Button>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Welcome;
