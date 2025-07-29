import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Text,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useToast,
  Box,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (surgeryDate: string) => void;
  isLoading?: boolean;
  userName: string;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  userName,
}) => {
  const [surgeryDate, setSurgeryDate] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();

  const handleSubmit = () => {
    if (!surgeryDate) {
      setError('Please select your surgery date');
      return;
    }

    const selectedDate = new Date(surgeryDate);
    const today = new Date();

    // Check if date is in the future
    if (selectedDate > today) {
      setError('Surgery date cannot be in the future');
      return;
    }

    // Check if date is more than 2 years ago (probably a mistake)
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    if (selectedDate < twoYearsAgo) {
      setError('Please check your surgery date. It seems to be more than 2 years ago.');
      return;
    }

    setError('');
    onSubmit(surgeryDate);
  };

  const handleSkip = () => {
    toast({
      title: 'Surgery date skipped',
      description: 'You can update your surgery date later in your profile settings.',
      status: 'info',
      duration: 3000,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent maxW='500px' mx={4}>
        <ModalHeader textAlign='center' pb={2}>
          <VStack spacing={3}>
            <Box
              w='60px'
              h='60px'
              borderRadius='full'
              bg='blue.500'
              display='flex'
              alignItems='center'
              justifyContent='center'
            >
              <Icon as={CalendarIcon} w='30px' h='30px' color='white' />
            </Box>
            <Text fontSize='xl' fontWeight='bold' color='gray.800'>
              Welcome, {userName}! 🎉
            </Text>
          </VStack>
        </ModalHeader>

        <ModalBody pb={6}>
          <VStack spacing={6} align='stretch'>
            <Text textAlign='center' color='gray.600' fontSize='md'>
              To provide you with the most personalized recovery experience, please tell us when
              your surgery took place.
            </Text>

            <FormControl isInvalid={!!error}>
              <FormLabel fontWeight='semibold' color='gray.700'>
                Surgery Date
              </FormLabel>
              <Input
                type='date'
                value={surgeryDate}
                onChange={e => setSurgeryDate(e.target.value)}
                size='lg'
                borderRadius='lg'
                _focus={{
                  borderColor: 'blue.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
                }}
              />
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>

            <Box bg='blue.50' p={4} borderRadius='lg' border='1px' borderColor='blue.200'>
              <Text fontSize='sm' color='blue.700'>
                <strong>Why we ask for this:</strong> Your surgery date helps us calculate your
                recovery progress and provide personalized recommendations for your healing journey.
              </Text>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3} w='full'>
            <Button variant='ghost' onClick={handleSkip} flex={1} size='lg'>
              Skip for now
            </Button>
            <Button
              colorScheme='blue'
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText='Saving...'
              flex={2}
              size='lg'
            >
              Save Surgery Date
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WelcomeModal;
