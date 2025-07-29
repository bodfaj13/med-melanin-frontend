import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  CardHeader,
  Button,
  Avatar,
  Divider,
  useToast,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import DashboardLayout from '@/layouts/dashboard-layout';
import { useUpdateSurgeryDate, useUpdateProfile, useChangePassword } from '@/api/auth/use-auth';
import { updateUser, logout } from '@/store/auth-slice';
import { CalendarIcon, EditIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router';
import {
  calculateRecoveryProgress,
  getRecoveryPhase,
  getRecoveryPhaseColor,
} from '@/utils/recovery-calculator';
import { useGetUserProgress, useGetBrochureContent } from '@/api/brochures/use-brochures';
import { useGetUserSymptomEntries } from '@/api/symptoms/use-symptoms';
import * as XLSX from 'xlsx';
import { ChangePasswordModal } from '../../../components/profile/change-password-modal';
import { UpdateSurgeryDateModal } from '../../../components/profile/update-surgery-date-modal';
import { EditProfileModal } from '../../../components/profile/edit-profile-modal';
import type { SymptomEntry } from '@/api/symptoms/types';
import type { BrochureSection, ContentBlock } from '@/api/brochures/types';

interface UserProgressItem {
  sectionId: string;
  itemId: string;
  completed: boolean;
  notes?: string;
  contentBlockId?: string;
}

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  const { sections: brochureData } = useSelector((state: RootState) => state.brochure);
  const { entries: symptomData } = useSelector((state: RootState) => state.symptom);
  const updateSurgeryDateMutation = useUpdateSurgeryDate();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  // Fetch API data for export
  const { data: userProgress } = useGetUserProgress();
  const { data: symptomEntries } = useGetUserSymptomEntries();
  const { data: brochureContent } = useGetBrochureContent();

  // Use API data if available, otherwise fallback to Redux state
  const finalSymptomData: SymptomEntry[] =
    (symptomEntries?.data as SymptomEntry[]) || symptomData || [];

  // Use actual user data or fallback to mock data
  const userData = user || {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    surgeryDate: '2024-01-15',
    recoveryDay: 12,
  };

  // Modal states
  const [isEditing, setIsEditing] = useState(false);
  const [isSurgeryDateModalOpen, setIsSurgeryDateModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Export data state
  const [isExporting, setIsExporting] = useState(false);

  const handleSurgeryDateSubmit = async (data: { surgeryDate: string }) => {
    try {
      await updateSurgeryDateMutation.mutateAsync(data.surgeryDate);

      // Update local state
      dispatch(updateUser({ ...userData, surgeryDate: data.surgeryDate }));

      toast({
        title: 'Surgery date updated',
        description: 'Your surgery date has been updated successfully.',
        status: 'success',
        duration: 3000,
      });

      setIsSurgeryDateModalOpen(false);
    } catch (error: unknown) {
      let errorMessage = 'Please try again later.';
      if (typeof error === 'object' && error && 'response' in error) {
        errorMessage =
          (error as { response?: { data?: { errors?: { message?: string }[] } } }).response?.data
            ?.errors?.[0]?.message || errorMessage;
      } else if (typeof error === 'object' && error && 'message' in error) {
        errorMessage = (error as { message?: string }).message || errorMessage;
      }
      toast({
        title: 'Failed to update surgery date',
        description: errorMessage,
        status: 'error',
        duration: 4000,
      });
    }
  };

  const handleProfileUpdate = async (data: { firstName: string; lastName: string }) => {
    try {
      const response: { data?: { user?: typeof user } } = await updateProfileMutation.mutateAsync({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
      });
      if (response.data?.user) {
        dispatch(updateUser(response.data.user));
      }
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully.',
        status: 'success',
        duration: 3000,
      });
      setIsEditing(false);
    } catch (error: unknown) {
      let errorMessage = 'Please try again later.';
      if (typeof error === 'object' && error && 'response' in error) {
        errorMessage =
          (error as { response?: { data?: { errors?: { message?: string }[] } } }).response?.data
            ?.errors?.[0]?.message || errorMessage;
      } else if (typeof error === 'object' && error && 'message' in error) {
        errorMessage = (error as { message?: string }).message || errorMessage;
      }
      toast({
        title: 'Failed to update profile',
        description: errorMessage,
        status: 'error',
        duration: 4000,
      });
    }
  };

  const handlePasswordChange = async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast({
        title: 'Password updated',
        description: 'Your password has been changed successfully.',
        status: 'success',
        duration: 3000,
      });
      setIsPasswordModalOpen(false);
    } catch (error: unknown) {
      let errorMessage = 'Please try again later.';
      if (typeof error === 'object' && error && 'response' in error) {
        errorMessage =
          (error as { response?: { data?: { errors?: { message?: string }[] } } }).response?.data
            ?.errors?.[0]?.message || errorMessage;
      } else if (typeof error === 'object' && error && 'message' in error) {
        errorMessage = (error as { message?: string }).message || errorMessage;
      }
      toast({
        title: 'Failed to update password',
        description: errorMessage,
        status: 'error',
        duration: 4000,
      });
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);

    try {
      const finalUserProgress: UserProgressItem[] = userProgress?.data || [];
      const finalSymptomData: SymptomEntry[] =
        (symptomEntries?.data as SymptomEntry[]) || symptomData || [];
      // Create workbook
      const workbook: XLSX.WorkBook = XLSX.utils.book_new();

      // Sheet 1: User Profile
      const userProfileData = [
        ['User Profile Information'],
        ['Name', `${userData.firstName} ${userData.lastName}`],
        ['Email', userData.email],
        [
          'Surgery Date',
          userData.surgeryDate ? new Date(userData.surgeryDate).toLocaleDateString() : 'Not set',
        ],
        ['Recovery Days', recoveryDays],
        ['Recovery Phase', getRecoveryPhase(recoveryDays)],
        ['Overall Progress', `${calculateEnhancedRecoveryProgress()}%`],
        [''],
        ['Export Date', new Date().toLocaleDateString()],
      ];

      const userProfileSheet = XLSX.utils.aoa_to_sheet(userProfileData);
      XLSX.utils.book_append_sheet(workbook, userProfileSheet, 'User Profile');

      // Sheet 2: Brochure Progress with API data
      if (brochureData && brochureData.length > 0) {
        const brochureProgressData = [
          ['Brochure Progress'],
          ['Section', 'Item', 'Completed', 'Notes'],
        ];
        (brochureData as BrochureSection[]).forEach(section => {
          section.content.forEach(contentBlock => {
            contentBlock.items.forEach(item => {
              // Find matching progress from API data
              const progressItem = finalUserProgress.find(
                (progress: UserProgressItem) =>
                  progress.sectionId === section.id &&
                  progress.contentBlockId === contentBlock.id &&
                  progress.itemId === item.id
              );

              brochureProgressData.push([
                section.title,
                item.text,
                progressItem?.completed ? 'Yes' : 'No',
                progressItem?.notes ? String(progressItem.notes) : '',
              ]);
            });
          });
        });

        const brochureSheet = XLSX.utils.aoa_to_sheet(brochureProgressData);
        XLSX.utils.book_append_sheet(workbook, brochureSheet, 'Brochure Progress');
      }

      // Sheet 3: Symptom Entries with API data
      if (finalSymptomData && finalSymptomData.length > 0) {
        const symptomDataArray = [
          ['Symptom Entries'],
          ['Date', 'Pain Level', 'Location', 'Description', 'Medications'],
        ];
        finalSymptomData.forEach(entry => {
          symptomDataArray.push([
            entry.date,
            String(entry.painLevel),
            entry.location,
            entry.description,
            entry.medications,
          ]);
        });
        const symptomSheet = XLSX.utils.aoa_to_sheet(symptomDataArray);
        XLSX.utils.book_append_sheet(workbook, symptomSheet, 'Symptom Entries');
      }

      // Sheet 4: Recovery Metrics
      const enhancedProgress = calculateEnhancedRecoveryProgress();
      const { completed, total } = getCompletedTasks();
      const taskCompletionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      console.log('Profile Export - Task Completion Debug:', {
        completed,
        total,
        taskCompletionPercentage: String(taskCompletionPercentage),
        userProgressDataLength: String(userProgress?.data?.length),
        brochureDataLength: String(brochureData?.length),
        brochureContentLength: String(brochureContent?.data?.length),
      });

      const metricsData = [
        ['Recovery Metrics'],
        ['Metric', 'Value'],
        ['Overall Progress', `${enhancedProgress}%`],
        ['Days Since Surgery', String(recoveryDays)],
        ['Brochure Progress', `${getBrochureProgress()}%`],
        [
          'Pain Level Trend',
          finalSymptomData.length > 0
            ? String(
                finalSymptomData.reduce((sum, entry) => sum + entry.painLevel, 0) /
                  finalSymptomData.length
              )
            : '0',
        ],
        ['Task Completion', String(completed)],
        ['Task Completion Percentage', String(taskCompletionPercentage)],
      ];

      const metricsSheet = XLSX.utils.aoa_to_sheet(metricsData);
      XLSX.utils.book_append_sheet(workbook, metricsSheet, 'Recovery Metrics');

      // Generate and download Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const dataBlob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `recovery-data-${userData.firstName}-${userData.lastName}-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Data exported successfully',
        description: 'Your recovery data has been downloaded as an Excel file.',
        status: 'success',
        duration: 3000,
      });
    } catch (error: unknown) {
      toast({
        title: 'Export failed',
        description:
          (error as { message?: string }).message ||
          'Failed to export your data. Please try again.',
        status: 'error',
        duration: 4000,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast({
      title: 'Logged out successfully',
      description: 'You have been logged out of your account.',
      status: 'success',
      duration: 2000,
    });
    navigate('/');
  };

  // Calculate recovery progress using the same method as dashboard
  const baseRecoveryProgress = calculateRecoveryProgress(
    userData.surgeryDate || '2024-01-15',
    brochureContent?.data || brochureData,
    finalSymptomData
  );

  // Create enhanced recovery progress with real API data (same as dashboard)
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
      if (
        userProgress?.data &&
        Array.isArray(userProgress.data) &&
        (brochureContent?.data || brochureData)
      ) {
        const completedItems = userProgress.data.filter(
          (item: UserProgressItem) => item.completed
        ).length;
        let totalItems = 0;
        (brochureContent?.data || brochureData).forEach((section: BrochureSection) => {
          section.content.forEach((contentBlock: ContentBlock) => {
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

  const recoveryDays: number = enhancedRecoveryProgress.factors.daysSinceSurgery;
  const recoveryPhase = getRecoveryPhase(recoveryDays);
  const recoveryPhaseColor = getRecoveryPhaseColor(recoveryPhase);

  const getBrochureProgress = () => {
    // Use API data if available, otherwise fallback to Redux state
    const brochureSections: BrochureSection[] = brochureContent?.data || brochureData;

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

  // Calculate enhanced recovery progress like in dashboard
  const calculateEnhancedRecoveryProgress = () => {
    const today = new Date();
    const surgery = new Date(userData.surgeryDate || '2024-01-15');
    const daysSinceSurgery = Math.floor(
      (today.getTime() - surgery.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Use real progress data for brochure progress
    let brochureProgress = 0;
    const brochureSections: BrochureSection[] = brochureContent?.data || brochureData;
    if (userProgress?.data && Array.isArray(userProgress.data) && brochureSections) {
      const completedItems = userProgress.data.filter(
        (item: UserProgressItem) => item.completed
      ).length;
      let totalItems = 0;
      brochureSections.forEach(section => {
        section.content.forEach(contentBlock => {
          contentBlock.items.forEach(() => {
            totalItems++;
          });
        });
      });
      brochureProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
    } else {
      brochureProgress = getBrochureProgress();
    }

    // Recalculate overall progress with real data (same as dashboard)
    const maxRecoveryDays = 42; // 6 weeks
    const timeBasedProgress = Math.min(100, (daysSinceSurgery / maxRecoveryDays) * 100);
    const engagementProgress = (brochureProgress + brochureProgress + 80) / 3; // Use brochure progress for both
    const healthProgress = Math.max(
      0,
      100 -
        (finalSymptomData.length > 0
          ? finalSymptomData.reduce((sum, entry) => sum + entry.painLevel, 0) /
            finalSymptomData.length
          : 0) *
          0.5
    );

    return Math.round(
      timeBasedProgress * 0.4 + // 40% time-based
        engagementProgress * 0.4 + // 40% engagement
        healthProgress * 0.2 // 20% health
    );
  };

  // Get completed tasks calculation (same as dashboard)
  const getCompletedTasks = () => {
    // Use fetched brochure content if available, otherwise fallback to Redux state
    const brochureSections: BrochureSection[] = brochureContent?.data || brochureData;

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
      console.log('Profile Export - API Progress Data:', {
        totalProgressItems: userProgress.data.length,
        completedItems: completed,
        totalBrochureItems: total,
        userProgressData: userProgress.data,
      });
    } else {
      // Fallback to local brochure data for completed items
      brochureSections.forEach(section => {
        section.content.forEach(contentBlock => {
          contentBlock.items.forEach(item => {
            if (item.completed) completed++;
          });
        });
      });
      console.log('Profile Export - Redux Fallback Data:', {
        completed,
        total,
      });
    }

    return { completed, total };
  };

  return (
    <DashboardLayout>
      <Container maxW='container.xl' py={8}>
        <VStack spacing={8} align='stretch'>
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <HStack spacing={4}>
                <Avatar
                  size='xl'
                  name={`${userData.firstName} ${userData.lastName}`}
                  bg='blue.500'
                />
                <VStack align='flex-start' spacing={2}>
                  <Heading size='lg'>
                    {userData.firstName} {userData.lastName}
                  </Heading>
                  <Text color='gray.600'>{userData.email}</Text>
                  <Badge
                    colorScheme={recoveryPhaseColor}
                    variant='subtle'
                    borderRadius='full'
                    px={3}
                    py={1}
                  >
                    {recoveryPhase}
                  </Badge>
                </VStack>
                <Button
                  leftIcon={<EditIcon />}
                  variant='outline'
                  size='sm'
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              </HStack>
            </CardHeader>
          </Card>

          {/* Recovery Information */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Card>
              <CardHeader>
                <Heading size='md'>Recovery Progress</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align='stretch'>
                  <Stat>
                    <StatLabel>Days Since Surgery</StatLabel>
                    <StatNumber>{recoveryDays}</StatNumber>
                    <StatHelpText>Day {recoveryDays} of your recovery journey</StatHelpText>
                  </Stat>

                  <Box>
                    <Text fontSize='sm' fontWeight='medium' mb={2}>
                      Recovery Phase
                    </Text>
                    <Badge
                      colorScheme={recoveryPhaseColor}
                      fontSize='md'
                      p={2}
                      borderRadius='full'
                      px={3}
                      py={1}
                    >
                      {recoveryPhase}
                    </Badge>
                  </Box>
                </VStack>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Heading size='md'>Surgery Information</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align='stretch'>
                  <Box>
                    <Text fontSize='sm' fontWeight='medium' mb={2}>
                      Surgery Date
                    </Text>
                    <Text fontSize='lg' fontWeight='semibold'>
                      {userData.surgeryDate
                        ? new Date(userData.surgeryDate).toLocaleDateString()
                        : 'Not set'}
                    </Text>
                  </Box>

                  <Button
                    leftIcon={<CalendarIcon />}
                    variant='outline'
                    onClick={() => setIsSurgeryDateModalOpen(true)}
                    isLoading={updateSurgeryDateMutation.isPending}
                  >
                    Update Surgery Date
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Data & Privacy */}
          <Card>
            <CardHeader>
              <Heading size='md'>Data & Privacy</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align='stretch'>
                <Alert status='info'>
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Data Privacy</AlertTitle>
                    <AlertDescription>
                      Your health data is encrypted and stored securely. We never share your
                      personal information with third parties.
                    </AlertDescription>
                  </Box>
                </Alert>

                <HStack justify='space-between' p={4} bg='gray.50' borderRadius='md'>
                  <VStack align='flex-start' spacing={1}>
                    <Text fontWeight='medium'>Export My Data</Text>
                    <Text fontSize='sm' color='gray.600'>
                      Download all your recovery data
                    </Text>
                  </VStack>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={handleExportData}
                    isLoading={isExporting}
                    loadingText='Exporting...'
                  >
                    Export
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <Heading size='md'>Account Settings</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align='stretch'>
                <HStack justify='space-between' p={4} bg='gray.50' borderRadius='md'>
                  <VStack align='flex-start' spacing={1}>
                    <Text fontWeight='medium'>Password</Text>
                    <Text fontSize='sm' color='gray.600'>
                      Last changed 30 days ago
                    </Text>
                  </VStack>
                  <Button size='sm' variant='outline' onClick={() => setIsPasswordModalOpen(true)}>
                    Change
                  </Button>
                </HStack>

                <Divider />

                <Button colorScheme='red' variant='outline' onClick={handleLogout}>
                  Logout
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </VStack>

        {/* Modal Components */}
        <EditProfileModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSubmit={handleProfileUpdate}
          isLoading={updateProfileMutation.isPending}
          defaultValues={{
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
          }}
        />

        <UpdateSurgeryDateModal
          isOpen={isSurgeryDateModalOpen}
          onClose={() => setIsSurgeryDateModalOpen(false)}
          onSubmit={handleSurgeryDateSubmit}
          isLoading={updateSurgeryDateMutation.isPending}
        />

        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onSubmit={handlePasswordChange}
          isLoading={changePasswordMutation.isPending}
        />
      </Container>
    </DashboardLayout>
  );
};

export default Profile;
