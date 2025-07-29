import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Progress,
  HStack,
  Button,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
  List,
  ListItem,
  Spinner,
  Skeleton,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import type { RootState } from '@/store';
import DashboardLayout from '@/layouts/dashboard-layout';
import BrochureSections from '@/components/brochure/brochure-sections';
import SymptomTracker from '@/components/symptom-tracker/symptom-tracker';
import WelcomeModal from '@/components/auth/welcome-modal';
import { useUpdateSurgeryDate } from '@/api/auth/use-auth';
import { useGetUserProgress, useGetBrochureContent } from '@/api/brochures/use-brochures';
import { useGetUserSymptomEntries } from '@/api/symptoms/use-symptoms';
import {
  calculateRecoveryProgress,
  getRecoveryPhase,
  getRecoveryPhaseColor,
} from '@/utils/recovery-calculator';
import { updateUser } from '@/store/auth-slice';
import { useDispatch } from 'react-redux';
import type { User } from '@/api/auth/types';
import type { BrochureSection } from '@/api/brochures/types';
import type { SymptomEntry } from '@/api/symptoms/types';

// Types for API responses
interface UserProgressItem {
  sectionId: string;
  itemId: string;
  completed: boolean;
  notes?: string;
}

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isOpen: isBrochureOpen,
    onOpen: onBrochureOpen,
    onClose: onBrochureClose,
  } = useDisclosure();
  const { isOpen: isSymptomOpen, onOpen: onSymptomOpen, onClose: onSymptomClose } = useDisclosure();
  const {
    isOpen: isWelcomeModalOpen,
    onOpen: onWelcomeModalOpen,
    onClose: onWelcomeModalClose,
  } = useDisclosure();

  // Active section index for brochure modal
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  // Section mapping for URL parameters
  const sectionMapping = useMemo(
    () => ({
      'activity-restrictions': 0,
      'pain-management': 1,
      'warning-signs': 2,
      'follow-up-schedule': 3,
      'healing-timeline': 4,
      'incision-care': 5,
      'diet-medications': 6,
      'aftercare-guide': 0, // Default to first section
    }),
    []
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const updateSurgeryDateMutation = useUpdateSurgeryDate();
  const dispatch = useDispatch();

  // Fetch user progress and brochure content when dashboard loads
  const {
    data: userProgress,
    isLoading: progressLoading,
    error: progressError,
  } = useGetUserProgress();

  const { data: brochureContent, isLoading: brochureLoading } = useGetBrochureContent();

  // Fetch symptom entries
  const { data: symptomEntries, isLoading: symptomLoading } = useGetUserSymptomEntries();

  const [, setActiveTabIndex] = useState(0);
  const toast = useToast();
  const { sections: brochureData } = useSelector((state: RootState) => state.brochure);
  const { entries: symptomData } = useSelector((state: RootState) => state.symptom);

  // Use API data if available, otherwise fallback to Redux state
  const finalSymptomData = (symptomEntries?.data as SymptomEntry[]) || symptomData || [];

  // Use actual user data or fallback to mock data
  const userData = user || {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    surgeryDate: '2024-01-15',
    recoveryDay: 12,
  };

  // Check if this is a new user (first time visiting dashboard)
  const [isNewUser] = useState(() => {
    const hasVisited = localStorage.getItem('dashboard-visited');
    if (!hasVisited) {
      localStorage.setItem('dashboard-visited', 'true');
      return true;
    }
    return false;
  });

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Calculate smart recovery progress using fetched data
  const brochureSections = brochureContent?.data || brochureData;

  // Create enhanced recovery progress with real API data
  const baseRecoveryProgress = calculateRecoveryProgress(
    userData.surgeryDate || '2024-01-15', // Fallback to default date if undefined
    brochureSections,
    finalSymptomData
  );

  // Override brochure progress with real API data if available
  const enhancedRecoveryProgress = {
    ...baseRecoveryProgress,
    overallProgress: (() => {
      const today = new Date();
      const surgery = new Date(userData.surgeryDate || '2024-01-15');
      const daysSinceSurgery = Math.floor(
        (today.getTime() - surgery.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Use real progress data for brochure progress
      let brochureProgress = 0;
      if (userProgress?.data && Array.isArray(userProgress.data) && brochureSections) {
        const completedItems = userProgress.data.filter(
          (item: UserProgressItem) => item.completed
        ).length;
        let totalItems = 0;
        brochureSections.forEach((section: BrochureSection) => {
          section.content.forEach(contentBlock => {
            contentBlock.items.forEach(() => {
              totalItems++;
            });
          });
        });
        brochureProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
      } else {
        brochureProgress = baseRecoveryProgress.factors.brochureProgress;
      }

      // Recalculate overall progress with real data
      const maxRecoveryDays = 42; // 6 weeks
      const timeBasedProgress = Math.min(100, (daysSinceSurgery / maxRecoveryDays) * 100);
      const engagementProgress = (brochureProgress + brochureProgress + 80) / 3; // Use brochure progress for both
      const healthProgress = Math.max(0, 100 - baseRecoveryProgress.factors.painLevelTrend * 0.5);

      return Math.round(
        timeBasedProgress * 0.4 + // 40% time-based
          engagementProgress * 0.4 + // 40% engagement
          healthProgress * 0.2 // 20% health
      );
    })(),
  };
  const recoveryPhase = getRecoveryPhase(enhancedRecoveryProgress.factors.daysSinceSurgery);
  const recoveryPhaseColor = getRecoveryPhaseColor(recoveryPhase);
  const daysSinceSurgery = enhancedRecoveryProgress.factors.daysSinceSurgery;

  const getBrochureProgress = () => {
    // Use fetched brochure content if available, otherwise fallback to Redux state
    const brochureSections = brochureContent?.data || brochureData;

    if (!brochureSections || !brochureSections.length) return 0;

    let totalItems = 0;
    let completedItems = 0;

    // Calculate total items from brochure data
    brochureSections.forEach(section => {
      section.content.forEach(contentBlock => {
        contentBlock.items.forEach(() => {
          totalItems++;
        });
      });
    });

    // Use API data for completed items if available
    if (userProgress?.data && Array.isArray(userProgress.data)) {
      completedItems = userProgress.data.filter((item: UserProgressItem) => item.completed).length;
    } else {
      // Fallback to local brochure data for completed items
      brochureSections.forEach(section => {
        section.content.forEach(contentBlock => {
          contentBlock.items.forEach(item => {
            if (item.completed) completedItems++;
          });
        });
      });
    }

    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  const getCompletedTasks = () => {
    // Use fetched brochure content if available, otherwise fallback to Redux state
    const brochureSections = brochureContent?.data || brochureData;

    if (!brochureSections || !brochureSections.length) return { completed: 0, total: 0 };

    let total = 0;
    let completed = 0;

    // Calculate total items from brochure data
    brochureSections.forEach(section => {
      section.content.forEach(contentBlock => {
        contentBlock.items.forEach(() => {
          total++;
        });
      });
    });

    // Use API data for completed items if available
    if (userProgress?.data && Array.isArray(userProgress.data)) {
      completed = userProgress.data.filter((item: UserProgressItem) => item.completed).length;
    } else {
      // Fallback to local brochure data for completed items
      brochureSections.forEach(section => {
        section.content.forEach(contentBlock => {
          contentBlock.items.forEach(item => {
            if (item.completed) completed++;
          });
        });
      });
    }

    return { completed, total };
  };

  const { completed, total } = getCompletedTasks();

  // Helper function to get today's date in consistent format
  const getTodayDate = () => {
    return new Date().toLocaleDateString();
  };

  // Helper function to count today's entries
  const getTodayEntriesCount = () => {
    const todayDate = getTodayDate();
    const todayEntries = finalSymptomData.filter((s: SymptomEntry) => s.date === todayDate);

    // Debug log to help identify issues
    console.log('Dashboard Debug:', {
      todayDate,
      totalEntries: finalSymptomData.length,
      todayEntriesCount: todayEntries.length,
      allDates: finalSymptomData.map((s: SymptomEntry) => s.date),
    });

    return todayEntries.length;
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'brochure':
        setActiveTabIndex(0);
        onBrochureOpen();
        break;
      case 'symptoms':
        setActiveTabIndex(1);
        onSymptomOpen();
        break;
      default:
        setActiveTabIndex(0);
        onBrochureOpen();
    }
  };

  const handleSurgeryDateSubmit = async (surgeryDate: string) => {
    try {
      const response = await updateSurgeryDateMutation.mutateAsync(surgeryDate);

      dispatch(updateUser(response.data?.user as User));

      toast({
        title: 'Surgery date updated!',
        description: 'Your recovery progress will now be calculated based on your surgery date.',
        status: 'success',
        duration: 4000,
      });

      onWelcomeModalClose();

      // Refresh the page to update the recovery calculations
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Please try again later.';
      toast({
        title: 'Failed to update surgery date',
        description: errorMessage,
        status: 'error',
        duration: 4000,
      });
    }
  };

  // Handle URL parameters for aftercare guide modal
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const currentView = searchParams.get('current-view');

    console.log('URL parameter check:', { currentView, location: location.search });

    if (currentView && sectionMapping[currentView as keyof typeof sectionMapping] !== undefined) {
      const sectionIndex = sectionMapping[currentView as keyof typeof sectionMapping];
      console.log('Opening modal with section:', { currentView, sectionIndex });
      setActiveSectionIndex(sectionIndex);
      onBrochureOpen();

      // Clean up URL parameter after opening modal
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.delete('current-view');
      const newSearch = newSearchParams.toString();
      const newPath = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;
      navigate(newPath, { replace: true });
    }
  }, [location.search, location.pathname, navigate, onBrochureOpen, sectionMapping]);

  // Handle progress loading errors
  useEffect(() => {
    if (progressError) {
      console.error('Failed to load user progress:', progressError);
      toast({
        title: 'Progress Load Failed',
        description: 'Failed to load your progress. Some features may not work correctly.',
        status: 'warning',
        duration: 4000,
      });
    }
  }, [progressError, toast]);

  // Show welcome toast and modal for new users or users without surgery date
  useEffect(() => {
    const shouldShowModal = isNewUser || !userData.surgeryDate;

    if (shouldShowModal) {
      // Show welcome modal after a short delay
      setTimeout(
        () => {
          onWelcomeModalOpen();
        },
        isNewUser ? 2000 : 500
      );
    }
  }, [isNewUser, userData.firstName, userData.surgeryDate, onWelcomeModalOpen, toast]);

  return (
    <DashboardLayout>
      <Container maxW='container.xl' py={8}>
        {/* Refined Loading States */}
        {(progressLoading || brochureLoading || symptomLoading) && (
          <VStack spacing={3} mb={6}>
            {progressLoading && (
              <Card bg='blue.50' border='1px solid' borderColor='blue.200'>
                <CardBody p={3}>
                  <HStack spacing={3}>
                    <Spinner size='sm' color='blue.500' />
                    <Text fontSize='sm' color='blue.700' fontWeight='medium'>
                      Loading your progress data...
                    </Text>
                  </HStack>
                </CardBody>
              </Card>
            )}

            {brochureLoading && (
              <Card bg='green.50' border='1px solid' borderColor='green.200'>
                <CardBody p={3}>
                  <HStack spacing={3}>
                    <Spinner size='sm' color='green.500' />
                    <Text fontSize='sm' color='green.700' fontWeight='medium'>
                      Loading brochure content...
                    </Text>
                  </HStack>
                </CardBody>
              </Card>
            )}

            {symptomLoading && (
              <Card bg='purple.50' border='1px solid' borderColor='purple.200'>
                <CardBody p={3}>
                  <HStack spacing={3}>
                    <Spinner size='sm' color='purple.500' />
                    <Text fontSize='sm' color='purple.700' fontWeight='medium'>
                      Loading symptom data...
                    </Text>
                  </HStack>
                </CardBody>
              </Card>
            )}
          </VStack>
        )}

        <VStack spacing={8} align='stretch'>
          {/* Welcome Section */}
          <Card bg='white' shadow='sm' border='1px solid' borderColor='gray.100'>
            <CardBody p={6}>
              <VStack spacing={4} align='stretch'>
                <HStack justify='space-between' align='flex-start'>
                  <VStack align='flex-start' spacing={2}>
                    <Text fontSize='sm' color='gray.500' fontWeight='medium'>
                      {getWelcomeMessage()}
                    </Text>
                    <Heading size='lg' color='gray.800' fontWeight='bold'>
                      {isNewUser
                        ? `Welcome, ${userData.firstName}!`
                        : `Welcome back, ${userData.firstName}!`}
                    </Heading>
                    <Text fontSize='md' color='gray.600'>
                      {isNewUser
                        ? 'Your personalized recovery journey starts here'
                        : `Day ${daysSinceSurgery} of your recovery journey`}
                    </Text>
                    {isNewUser && (
                      <Text fontSize='sm' color='blue.600' fontWeight='medium'>
                        🎉 Your account has been created successfully!
                      </Text>
                    )}
                  </VStack>

                  <VStack align='flex-end' spacing={2}>
                    <Badge
                      colorScheme={recoveryPhaseColor}
                      variant='subtle'
                      px={3}
                      py={1}
                      borderRadius='full'
                      fontSize='sm'
                      fontWeight='semibold'
                    >
                      {isNewUser ? 'NEW USER' : recoveryPhase.toUpperCase()}
                    </Badge>
                    <Text fontSize='sm' color='gray.500'>
                      {isNewUser
                        ? 'Getting Started'
                        : `Phase ${Math.min(6, Math.floor(daysSinceSurgery / 7))} of 6`}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Welcome Modal */}
          <WelcomeModal
            isOpen={isWelcomeModalOpen}
            onClose={onWelcomeModalClose}
            onSubmit={handleSurgeryDateSubmit}
            isLoading={updateSurgeryDateMutation.isPending}
            userName={userData.firstName}
          />

          {/* Smart Recovery Progress */}
          <Card>
            <CardHeader>
              <HStack justify='space-between'>
                <Heading size='md'>Recovery Progress</Heading>
                {progressLoading || brochureLoading ? (
                  <Skeleton height='20px' width='80px' />
                ) : (
                  <Badge colorScheme='blue' fontSize='md' borderRadius='full' px={3} py={1}>
                    {enhancedRecoveryProgress.overallProgress}% Complete
                  </Badge>
                )}
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={6} align='stretch'>
                {/* Overall Progress */}
                <Box>
                  <HStack justify='space-between' mb={2}>
                    <Text fontWeight='semibold'>Overall Recovery</Text>
                    <Text fontSize='sm' color='gray.500'>
                      Smart calculation based on multiple factors
                    </Text>
                  </HStack>
                  {progressLoading || brochureLoading || symptomLoading ? (
                    <Skeleton height='24px' width='100%' borderRadius='full' />
                  ) : (
                    <Progress
                      value={enhancedRecoveryProgress.overallProgress}
                      colorScheme='blue'
                      size='lg'
                      borderRadius='full'
                    />
                  )}
                </Box>

                {/* Recommendations */}
                {progressLoading || brochureLoading || symptomLoading ? (
                  <Box>
                    <Skeleton height='16px' width='120px' mb={2} />
                    <VStack spacing={2} align='stretch'>
                      <Skeleton height='14px' width='90%' />
                      <Skeleton height='14px' width='85%' />
                      <Skeleton height='14px' width='70%' />
                    </VStack>
                  </Box>
                ) : (
                  enhancedRecoveryProgress.recommendations.length > 0 && (
                    <Box>
                      <Text fontSize='sm' fontWeight='semibold' mb={2} color='blue.600'>
                        Recommendations:
                      </Text>
                      <List spacing={1}>
                        {enhancedRecoveryProgress.recommendations.map(
                          (rec: string, index: number) => (
                            <ListItem key={index} fontSize='sm' color='gray.600'>
                              • {rec}
                            </ListItem>
                          )
                        )}
                      </List>
                    </Box>
                  )
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Quick Stats */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Aftercare Guide Progress</StatLabel>
                  {progressLoading || brochureLoading || symptomLoading ? (
                    <>
                      <Skeleton height='24px' width='60px' mb={2} />
                      <Skeleton height='8px' width='100%' />
                    </>
                  ) : (
                    <>
                      <StatNumber>{getBrochureProgress()}%</StatNumber>
                      <StatHelpText>
                        <Progress
                          value={getBrochureProgress()}
                          colorScheme='green'
                          size='sm'
                          mt={2}
                        />
                      </StatHelpText>
                    </>
                  )}
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Completed Tasks</StatLabel>
                  {progressLoading || brochureLoading || symptomLoading ? (
                    <>
                      <Skeleton height='8px' width='80px' mb={2} />
                      <Skeleton height='16px' width='120px' />
                    </>
                  ) : (
                    <>
                      <StatNumber>
                        {completed}/{total}
                      </StatNumber>
                      <StatHelpText>
                        {total > 0 ? Math.round((completed / total) * 100) : 0}% of tasks completed
                      </StatHelpText>
                    </>
                  )}
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Symptom Entries</StatLabel>
                  {symptomLoading ? (
                    <Skeleton height='24px' width='60px' mb={2} />
                  ) : (
                    <StatNumber>{finalSymptomData.length}</StatNumber>
                  )}
                  <StatHelpText>
                    {symptomLoading ? (
                      <Skeleton height='16px' width='80px' />
                    ) : (
                      <>{getTodayEntriesCount()} today</>
                    )}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <Heading size='md'>Quick Actions</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={4}>
                <Button
                  variant='outline'
                  colorScheme='blue'
                  size='lg'
                  h='100px'
                  flexDirection='column'
                  onClick={() => handleQuickAction('brochure')}
                >
                  <Text fontSize='lg' fontWeight='bold' mb={2}>
                    Aftercare Guide
                  </Text>
                  <Text fontSize='sm' color='gray.600'>
                    View your personalized recovery guide
                  </Text>
                </Button>

                <Button
                  variant='outline'
                  colorScheme='purple'
                  size='lg'
                  h='100px'
                  flexDirection='column'
                  onClick={() => handleQuickAction('symptoms')}
                >
                  <Text fontSize='lg' fontWeight='bold' mb={2}>
                    Pain & Symptom Tracker
                  </Text>
                  <Text fontSize='sm' color='gray.600'>
                    Log your daily pain and symptoms
                  </Text>
                </Button>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Today's Recovery Tasks */}
          <Card>
            <CardHeader>
              <Heading size='md' color='gray.800'>
                Today's Recovery Focus
              </Heading>
              <Text fontSize='sm' color='gray.600'>
                Key areas to focus on based on your recovery stage
              </Text>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align='stretch'>
                {/* Dynamic tasks based on recovery stage */}
                {daysSinceSurgery <= 7 && (
                  <>
                    <HStack
                      justify='space-between'
                      p={3}
                      bg={getBrochureProgress() > 20 ? 'green.50' : 'gray.50'}
                      borderRadius='md'
                      border='1px solid'
                      borderColor={getBrochureProgress() > 20 ? 'green.200' : 'gray.200'}
                    >
                      <Text fontSize='sm' fontWeight='medium'>
                        Review Activity Restrictions
                      </Text>
                      <Badge
                        colorScheme={getBrochureProgress() > 20 ? 'green' : 'yellow'}
                        variant='subtle'
                        fontSize='xs'
                      >
                        {getBrochureProgress() > 20 ? 'REVIEWED' : 'PENDING'}
                      </Badge>
                    </HStack>

                    <HStack
                      justify='space-between'
                      p={3}
                      bg={symptomData.length > 0 ? 'green.50' : 'gray.50'}
                      borderRadius='md'
                      border='1px solid'
                      borderColor={symptomData.length > 0 ? 'green.200' : 'gray.200'}
                    >
                      <Text fontSize='sm' fontWeight='medium'>
                        Log Pain & Symptoms
                      </Text>
                      <Badge
                        colorScheme={symptomData.length > 0 ? 'green' : 'yellow'}
                        variant='subtle'
                        fontSize='xs'
                      >
                        {symptomData.length > 0 ? 'TRACKING' : 'PENDING'}
                      </Badge>
                    </HStack>

                    <HStack
                      justify='space-between'
                      p={3}
                      bg={getBrochureProgress() > 40 ? 'green.50' : 'gray.50'}
                      borderRadius='md'
                      border='1px solid'
                      borderColor={getBrochureProgress() > 40 ? 'green.200' : 'gray.200'}
                    >
                      <Text fontSize='sm' fontWeight='medium'>
                        Review Pain Management
                      </Text>
                      <Badge
                        colorScheme={getBrochureProgress() > 40 ? 'green' : 'yellow'}
                        variant='subtle'
                        fontSize='xs'
                      >
                        {getBrochureProgress() > 40 ? 'REVIEWED' : 'PENDING'}
                      </Badge>
                    </HStack>
                  </>
                )}

                {daysSinceSurgery > 7 && daysSinceSurgery <= 21 && (
                  <>
                    <HStack
                      justify='space-between'
                      p={3}
                      bg={getBrochureProgress() > 60 ? 'green.50' : 'gray.50'}
                      borderRadius='md'
                      border='1px solid'
                      borderColor={getBrochureProgress() > 60 ? 'green.200' : 'gray.200'}
                    >
                      <Text fontSize='sm' fontWeight='medium'>
                        Review Follow-up Schedule
                      </Text>
                      <Badge
                        colorScheme={getBrochureProgress() > 60 ? 'green' : 'yellow'}
                        variant='subtle'
                        fontSize='xs'
                      >
                        {getBrochureProgress() > 60 ? 'REVIEWED' : 'PENDING'}
                      </Badge>
                    </HStack>

                    <HStack
                      justify='space-between'
                      p={3}
                      bg={getBrochureProgress() > 80 ? 'green.50' : 'gray.50'}
                      borderRadius='md'
                      border='1px solid'
                      borderColor={getBrochureProgress() > 80 ? 'green.200' : 'gray.200'}
                    >
                      <Text fontSize='sm' fontWeight='medium'>
                        Review Healing Timeline
                      </Text>
                      <Badge
                        colorScheme={getBrochureProgress() > 80 ? 'green' : 'yellow'}
                        variant='subtle'
                        fontSize='xs'
                      >
                        {getBrochureProgress() > 80 ? 'REVIEWED' : 'PENDING'}
                      </Badge>
                    </HStack>
                  </>
                )}

                {daysSinceSurgery > 21 && (
                  <>
                    <HStack
                      justify='space-between'
                      p={3}
                      bg={getBrochureProgress() > 90 ? 'green.50' : 'gray.50'}
                      borderRadius='md'
                      border='1px solid'
                      borderColor={getBrochureProgress() > 90 ? 'green.200' : 'gray.200'}
                    >
                      <Text fontSize='sm' fontWeight='medium'>
                        Complete All Guide Sections
                      </Text>
                      <Badge
                        colorScheme={getBrochureProgress() > 90 ? 'green' : 'yellow'}
                        variant='subtle'
                        fontSize='xs'
                      >
                        {getBrochureProgress() > 90 ? 'COMPLETED' : 'IN PROGRESS'}
                      </Badge>
                    </HStack>
                  </>
                )}

                {/* Always show warning signs review */}
                <HStack
                  justify='space-between'
                  p={3}
                  bg={getBrochureProgress() > 30 ? 'green.50' : 'red.50'}
                  borderRadius='md'
                  border='1px solid'
                  borderColor={getBrochureProgress() > 30 ? 'green.200' : 'red.200'}
                >
                  <Text fontSize='sm' fontWeight='medium'>
                    Review Warning Signs
                  </Text>
                  <Badge
                    colorScheme={getBrochureProgress() > 30 ? 'green' : 'red'}
                    variant='subtle'
                    fontSize='xs'
                  >
                    {getBrochureProgress() > 30 ? 'REVIEWED' : 'CRITICAL'}
                  </Badge>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Interactive Aftercare Guide */}
          <Card>
            <CardHeader>
              <Flex justify='space-between' align='center'>
                <Heading size='md'>Interactive Aftercare Guide</Heading>
                <Badge colorScheme='green'>Active</Badge>
              </Flex>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align='stretch'>
                <Text color='gray.600'>
                  Your personalized interactive brochure with checkboxes, symptom tracking, and the
                  ability to take notes on your recovery journey.
                </Text>
                <HStack spacing={4}>
                  <Button colorScheme='blue' onClick={onBrochureOpen} leftIcon={<Text>📋</Text>}>
                    View Full Guide
                  </Button>
                  <Text fontSize='sm' color='gray.500'>
                    {getBrochureProgress()}% complete • {completed}/{total} tasks done
                  </Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>

      {/* Interactive Brochure Modal */}
      <Modal isOpen={isBrochureOpen} onClose={onBrochureClose} size='6xl' scrollBehavior='inside'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack justify='space-between'>
              <Text>Interactive Aftercare Guide</Text>
              <Badge colorScheme='blue'>{getBrochureProgress()}% Complete</Badge>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <BrochureSections initialTabIndex={activeSectionIndex} />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Symptom Tracker Modal */}
      <Modal isOpen={isSymptomOpen} onClose={onSymptomClose} size='6xl' scrollBehavior='inside'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack justify='space-between'>
              <Text>Pain & Symptom Tracker</Text>
              <Badge colorScheme='purple'>Active</Badge>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <SymptomTracker />
          </ModalBody>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
