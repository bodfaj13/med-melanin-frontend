import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Avatar,
  Button,
  Text,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useToast,
  Flex,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import type { RootState } from '@/store';
import { useSelector } from 'react-redux';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useSelector((state: RootState) => state.auth);

  // Mock user data - in real app this would come from auth context or API
  // Use actual user data or fallback to mock data
  const userData = user || {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    surgeryDate: '2024-01-15',
    recoveryDay: 12,
  };

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    toast({
      title: 'Logged out successfully',
      status: 'success',
      duration: 2000,
    });
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const SidebarContent = () => (
    <VStack spacing={6} align='stretch' h='full'>
      {/* User Profile Section */}
      <Box p={4} borderBottom='1px' borderColor='gray.200'>
        <VStack spacing={3}>
          <Avatar size='lg' name={`${userData.firstName} ${userData.lastName}`} bg='blue.500' />
          <Box textAlign='center'>
            <Text fontWeight='bold' fontSize='lg'>
              {userData.firstName} {userData.lastName}
            </Text>
            <Text fontSize='sm' color='gray.500'>
              {userData.email}
            </Text>
          </Box>
        </VStack>
      </Box>

      {/* Navigation Menu */}
      <VStack spacing={2} align='stretch' flex={1}>
        <Button
          variant='ghost'
          justifyContent='flex-start'
          size='lg'
          colorScheme='blue'
          bg='blue.50'
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </Button>
        <Button
          variant='ghost'
          justifyContent='flex-start'
          size='lg'
          onClick={() => navigate('/dashboard?current-view=activity-restrictions')}
        >
          Activity Restrictions
        </Button>
        <Button
          variant='ghost'
          justifyContent='flex-start'
          size='lg'
          onClick={() => navigate('/dashboard?current-view=pain-management')}
        >
          Pain Management
        </Button>
        <Button
          variant='ghost'
          justifyContent='flex-start'
          size='lg'
          onClick={() => navigate('/dashboard?current-view=warning-signs')}
        >
          Warning Signs
        </Button>
        <Button
          variant='ghost'
          justifyContent='flex-start'
          size='lg'
          onClick={() => navigate('/dashboard?current-view=follow-up-schedule')}
        >
          Follow-up Schedule
        </Button>
        <Button
          variant='ghost'
          justifyContent='flex-start'
          size='lg'
          onClick={() => navigate('/dashboard?current-view=healing-timeline')}
        >
          Healing Timeline
        </Button>
        <Button
          variant='ghost'
          justifyContent='flex-start'
          size='lg'
          onClick={() => navigate('/dashboard?current-view=incision-care')}
        >
          Incision Care
        </Button>
        <Button
          variant='ghost'
          justifyContent='flex-start'
          size='lg'
          onClick={() => navigate('/dashboard?current-view=diet-medications')}
        >
          Diet & Medications
        </Button>
      </VStack>

      {/* Bottom Actions */}
      <VStack spacing={2} align='stretch'>
        <Divider />
        <Button variant='ghost' justifyContent='flex-start' size='lg' onClick={handleProfileClick}>
          Profile
        </Button>
        <Button
          variant='ghost'
          justifyContent='flex-start'
          size='lg'
          colorScheme='red'
          onClick={handleLogout}
        >
          Logout
        </Button>
      </VStack>
    </VStack>
  );

  return (
    <Box h='100vh' bg='gray.50'>
      {/* Mobile Header */}
      <Flex
        display={{ base: 'flex', lg: 'none' }}
        bg='white'
        p={4}
        borderBottom='1px'
        borderColor='gray.200'
        justify='space-between'
        align='center'
      >
        <HStack spacing={3}>
          <IconButton
            aria-label='Open menu'
            icon={<Text fontSize='lg'>☰</Text>}
            variant='ghost'
            onClick={onOpen}
          />
          <Avatar size='sm' name={`${userData.firstName} ${userData.lastName}`} bg='blue.500' />
          <Box>
            <Text fontWeight='bold'>{userData.firstName}</Text>
            <Text fontSize='xs' color='gray.500'>
              Dashboard
            </Text>
          </Box>
        </HStack>
        <Menu>
          <MenuButton as={IconButton} icon={<Text>⚙️</Text>} variant='ghost' size='sm' />
          <MenuList>
            <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
            <MenuDivider />
            <MenuItem onClick={handleLogout} color='red.500'>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <Box display='flex' h={{ base: 'calc(100vh - 60px)', lg: '100vh' }}>
        {/* Desktop Sidebar */}
        <Box
          display={{ base: 'none', lg: 'block' }}
          w='280px'
          bg='white'
          borderRight='1px'
          borderColor='gray.200'
          h='full'
        >
          <SidebarContent />
        </Box>

        {/* Mobile Drawer */}
        <Drawer isOpen={isOpen} placement='left' onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody p={0}>
              <SidebarContent />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Main Content */}
        <Box flex={1} overflow='auto'>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
