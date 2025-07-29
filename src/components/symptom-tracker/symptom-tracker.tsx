import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Textarea,
  Badge,
  SimpleGrid,
  useToast,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { addSymptomEntry } from '@/store/symptom-slice';
import type { SymptomEntry } from '@/store/symptom-slice';
import { useCreateSymptomEntry, useGetUserSymptomEntries } from '@/api/symptoms/use-symptoms';

const SymptomTracker = () => {
  const dispatch = useDispatch();
  const { entries } = useSelector((state: RootState) => state.symptom);

  // API hooks
  const createSymptomMutation = useCreateSymptomEntry();
  const { data: apiEntries, isLoading: entriesLoading } = useGetUserSymptomEntries();

  // Use API data if available, otherwise fallback to Redux state
  const symptomEntries = apiEntries?.data || entries;

  const [currentPainLevel, setCurrentPainLevel] = useState(0);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [medications, setMedications] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSubmit = async () => {
    if (currentPainLevel === 0) {
      toast({
        title: 'Pain Level Required',
        description: 'Please select a pain level to track your symptoms',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    try {
      // Create entry data for API
      const entryData = {
        date: new Date().toLocaleDateString(),
        painLevel: currentPainLevel,
        location,
        description,
        medications,
      };

      // Call API to create entry
      const result = await createSymptomMutation.mutateAsync(entryData);

      if (result.success) {
        // Also update local state for immediate UI feedback
        const newEntry: SymptomEntry = {
          id: Date.now().toString(),
          ...entryData,
          timestamp: new Date().toISOString(),
        };
        dispatch(addSymptomEntry(newEntry));

        // Reset form
        setCurrentPainLevel(0);
        setLocation('');
        setDescription('');
        setMedications('');

        onClose();

        toast({
          title: 'Symptom Logged',
          description: 'Your pain level has been recorded successfully',
          status: 'success',
          duration: 2000,
        });
      } else {
        toast({
          title: 'Failed to Save',
          description: result.message || 'Failed to save symptom entry',
          status: 'error',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error creating symptom entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to save symptom entry. Please try again.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const getPainLevelText = (level: number) => {
    if (level === 0) return 'No Pain';
    if (level <= 2) return 'Mild Pain';
    if (level <= 4) return 'Moderate Pain';
    if (level <= 6) return 'Moderate-Severe Pain';
    if (level <= 8) return 'Severe Pain';
    return 'Very Severe Pain';
  };

  const getPainLevelColor = (level: number) => {
    if (level === 0) return 'gray';
    if (level <= 2) return 'green';
    if (level <= 4) return 'yellow';
    if (level <= 6) return 'orange';
    if (level <= 8) return 'red';
    return 'red';
  };

  const getAveragePainLevel = () => {
    if (symptomEntries.length === 0) return 0;
    const total = symptomEntries.reduce((sum, entry) => sum + entry.painLevel, 0);
    return Math.round(total / symptomEntries.length);
  };

  const getRecentSymptoms = () => {
    return symptomEntries.slice(0, 5); // Last 5 entries
  };

  const getPainTrend = () => {
    if (symptomEntries.length < 2) return 0;
    const recentEntries = symptomEntries.slice(0, 3);
    const olderEntries = symptomEntries.slice(-3);

    const recentAvg =
      recentEntries.reduce((sum, entry) => sum + entry.painLevel, 0) / recentEntries.length;
    const olderAvg =
      olderEntries.reduce((sum, entry) => sum + entry.painLevel, 0) / olderEntries.length;

    return olderAvg - recentAvg; // Positive = improving
  };

  // Helper function to get today's date in consistent format
  const getTodayDate = () => {
    return new Date().toLocaleDateString();
  };

  // Helper function to count today's entries
  const getTodayEntriesCount = () => {
    const todayDate = getTodayDate();
    const todayEntries = symptomEntries.filter(s => s.date === todayDate);

    return todayEntries.length;
  };

  return (
    <Box>
      {/* Header */}
      <Card mb={6}>
        <CardBody>
          <VStack spacing={4} align='stretch'>
            <HStack justify='space-between'>
              <Heading size='lg' color='purple.600'>
                Pain & Symptom Tracker
              </Heading>
              <Badge colorScheme='purple' fontSize='md' px={3} py={1}>
                {entriesLoading ? 'Loading...' : `${symptomEntries.length} entries`}
              </Badge>
            </HStack>

            <Text fontSize='sm' color='gray.600'>
              Track your pain levels, symptoms, and medication usage to help your healthcare team
              monitor your recovery.
            </Text>
          </VStack>
        </CardBody>
      </Card>

      {/* Quick Stats */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
        <Card>
          <CardBody>
            <VStack spacing={2}>
              <Text fontSize='sm' color='gray.500'>
                Average Pain Level
              </Text>
              <Text
                fontSize='2xl'
                fontWeight='bold'
                color={`${getPainLevelColor(getAveragePainLevel())}.500`}
              >
                {getAveragePainLevel()}/10
              </Text>
              <Text fontSize='sm' color='gray.600'>
                {getPainLevelText(getAveragePainLevel())}
              </Text>
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <VStack spacing={2}>
              <Text fontSize='sm' color='gray.500'>
                Today's Entries
              </Text>
              <Text fontSize='2xl' fontWeight='bold' color='blue.500'>
                {entriesLoading ? '...' : getTodayEntriesCount()}
              </Text>
              <Text fontSize='sm' color='gray.600'>
                symptom logs
              </Text>
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <VStack spacing={2}>
              <Text fontSize='sm' color='gray.500'>
                Pain Trend
              </Text>
              <Text
                fontSize='2xl'
                fontWeight='bold'
                color={getPainTrend() > 0 ? 'green.500' : 'red.500'}
              >
                {getPainTrend() > 0 ? '↓' : getPainTrend() < 0 ? '↑' : '→'}
              </Text>
              <Text fontSize='sm' color='gray.600'>
                {getPainTrend() > 0 ? 'Improving' : getPainTrend() < 0 ? 'Worsening' : 'Stable'}
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Add New Entry */}
      <Card mb={6}>
        <CardBody>
          <VStack spacing={4} align='stretch'>
            <HStack justify='space-between'>
              <Heading size='md'>Log New Symptom</Heading>
              <Button colorScheme='purple' onClick={onOpen} leftIcon={<Text>➕</Text>}>
                Add Entry
              </Button>
            </HStack>

            <Text fontSize='sm' color='gray.600'>
              Click the button above to log your current pain level, symptoms, and any medications
              taken.
            </Text>
          </VStack>
        </CardBody>
      </Card>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <Heading size='md'>Recent Entries</Heading>
        </CardHeader>
        <CardBody>
          {getRecentSymptoms().length === 0 ? (
            <Text color='gray.500' textAlign='center' py={8}>
              No symptoms logged yet. Start tracking your recovery progress!
            </Text>
          ) : (
            <VStack spacing={3} align='stretch'>
              {getRecentSymptoms().map(symptom => (
                <Card key={symptom.id} variant='outline' size='sm'>
                  <CardBody p={4}>
                    <HStack justify='space-between' mb={2}>
                      <HStack spacing={3}>
                        <Badge colorScheme={getPainLevelColor(symptom.painLevel)}>
                          {symptom.painLevel}/10
                        </Badge>
                        <Text fontSize='sm' color='gray.500'>
                          {symptom.date}
                        </Text>
                      </HStack>
                      <Text fontSize='sm' fontWeight='semibold' color='gray.700'>
                        {getPainLevelText(symptom.painLevel)}
                      </Text>
                    </HStack>

                    {symptom.location && (
                      <Text fontSize='sm' color='gray.600' mb={1}>
                        <strong>Location:</strong> {symptom.location}
                      </Text>
                    )}

                    {symptom.description && (
                      <Text fontSize='sm' color='gray.600' mb={1}>
                        <strong>Description:</strong> {symptom.description}
                      </Text>
                    )}

                    {symptom.medications && (
                      <Text fontSize='sm' color='gray.600'>
                        <strong>Medications:</strong> {symptom.medications}
                      </Text>
                    )}
                  </CardBody>
                </Card>
              ))}
            </VStack>
          )}
        </CardBody>
      </Card>

      {/* Add Entry Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size='lg'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Log New Symptom Entry</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6} align='stretch'>
              {/* Pain Level Slider */}
              <Box>
                <Text fontSize='md' fontWeight='semibold' mb={4}>
                  Pain Level (0-10)
                </Text>
                <Slider
                  value={currentPainLevel}
                  onChange={setCurrentPainLevel}
                  min={0}
                  max={10}
                  step={1}
                  colorScheme={getPainLevelColor(currentPainLevel)}
                >
                  <SliderMark value={0} mt='2' fontSize='sm'>
                    0
                  </SliderMark>
                  <SliderMark value={5} mt='2' fontSize='sm'>
                    5
                  </SliderMark>
                  <SliderMark value={10} mt='2' fontSize='sm'>
                    10
                  </SliderMark>
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
                <Text fontSize='sm' color='gray.600' mt={2}>
                  {getPainLevelText(currentPainLevel)}
                </Text>
              </Box>

              {/* Location */}
              <Box>
                <Text fontSize='md' fontWeight='semibold' mb={2}>
                  Location of Pain/Symptom
                </Text>
                <Textarea
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder='e.g., Lower abdomen, incision site, etc.'
                  size='sm'
                  rows={2}
                />
              </Box>

              {/* Description */}
              <Box>
                <Text fontSize='md' fontWeight='semibold' mb={2}>
                  Description
                </Text>
                <Textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder='Describe your symptoms, pain type, duration, etc.'
                  size='sm'
                  rows={3}
                />
              </Box>

              {/* Medications */}
              <Box>
                <Text fontSize='md' fontWeight='semibold' mb={2}>
                  Medications Taken
                </Text>
                <Textarea
                  value={medications}
                  onChange={e => setMedications(e.target.value)}
                  placeholder='List any medications taken and dosages'
                  size='sm'
                  rows={2}
                />
              </Box>

              {/* Warning for High Pain */}
              {currentPainLevel >= 7 && (
                <Alert status='warning' borderRadius='md'>
                  <AlertIcon />
                  <Text fontSize='sm'>
                    You've indicated severe pain. Consider contacting your healthcare provider if
                    this persists.
                  </Text>
                </Alert>
              )}

              {/* Submit Button */}
              <Button colorScheme='purple' onClick={handleSubmit} size='lg'>
                Log Symptom Entry
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SymptomTracker;
