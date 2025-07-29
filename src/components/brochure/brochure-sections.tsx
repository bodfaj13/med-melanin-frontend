import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Textarea,
  IconButton,
  useToast,
  Alert,
  AlertIcon,
  Flex,
  useColorModeValue,
  List,
  ListItem,
  Button,
  Collapse,
  Icon,
  Spinner,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useBrochure } from '@/hooks/useBrochure';
import { useUpdateProgress } from '@/api/brochures/use-brochures';
import { toggleItemCompleted, updateItemNotes } from '@/store/brochure-slice';
import { Edit3, X } from 'lucide-react';

interface BrochureSectionsProps {
  initialTabIndex?: number;
}

const BrochureSections: React.FC<BrochureSectionsProps> = ({ initialTabIndex = 0 }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { sections, loading, error } = useBrochure();
  const [activeTab, setActiveTab] = useState(initialTabIndex);
  const [editingNotes, setEditingNotes] = useState<{ [key: string]: boolean }>({});
  const updateProgressMutation = useUpdateProgress();

  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Show loading state
  if (loading) {
    return (
      <Box textAlign='center' py={10}>
        <Spinner size='xl' color='blue.500' />
        <Text mt={4}>Loading your personalized aftercare guide...</Text>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box textAlign='center' py={10}>
        <Alert status='error'>
          <AlertIcon />
          <Text>Error loading brochure content: {error}</Text>
        </Alert>
      </Box>
    );
  }

  // Show empty state
  if (!sections || sections.length === 0) {
    return (
      <Box textAlign='center' py={10}>
        <Text>No brochure content available</Text>
      </Box>
    );
  }

  const currentSection = sections[activeTab];

  // Safety check for currentSection
  if (!currentSection) {
    return (
      <Box textAlign='center' py={10}>
        <Text>Section not found</Text>
      </Box>
    );
  }

  const handleItemToggle = async (sectionId: string, contentBlockId: string, itemId: string) => {
    console.log('Checkbox clicked:', { sectionId, contentBlockId, itemId });

    // Update local state immediately for UI responsiveness
    dispatch(toggleItemCompleted({ sectionId, contentBlockId, itemId }));

    // Find the current item to get its new state
    const section = sections.find(s => s.id === sectionId);
    const contentBlock = section?.content.find(c => c.id === contentBlockId);
    const item = contentBlock?.items.find(i => i.id === itemId);

    if (item) {
      try {
        // Send update to backend
        await updateProgressMutation.mutateAsync({
          sectionId,
          itemId,
          completed: !item.completed, // Toggle the state
          notes: item.notes,
        });

        toast({
          title: 'Progress Saved',
          description: 'Your progress has been saved to the server',
          status: 'success',
          duration: 2000,
        });
      } catch (error) {
        console.error('API call failed:', error);
        // Revert local state if API call fails
        dispatch(toggleItemCompleted({ sectionId, contentBlockId, itemId }));
        toast({
          title: 'Save Failed',
          description: 'Failed to save progress. Please try again.',
          status: 'error',
          duration: 3000,
        });
      }
    } else {
      console.error('Item not found for:', { sectionId, contentBlockId, itemId });
    }
  };

  const handleItemNotesUpdate = (
    sectionId: string,
    contentBlockId: string,
    itemId: string,
    notes: string
  ) => {
    // Only update local state, don't call API yet
    dispatch(updateItemNotes({ sectionId, contentBlockId, itemId, notes }));
  };

  const handleSaveItemNotes = async (sectionId: string, contentBlockId: string, itemId: string) => {
    try {
      // Find the item to get its current state
      const section = sections.find(s => s.id === sectionId);
      const contentBlock = section?.content.find(c => c.id === contentBlockId);
      const item = contentBlock?.items.find(i => i.id === itemId);

      if (item) {
        // Send update to backend
        await updateProgressMutation.mutateAsync({
          sectionId,
          itemId,
          completed: item.completed,
          notes: item.notes,
        });

        toast({
          title: 'Notes Saved',
          description: 'Your notes have been saved to the server',
          status: 'success',
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Notes API call failed:', error);
      toast({
        title: 'Save Failed',
        description: 'Failed to save notes. Please try again.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box>
      {/* Custom Tab Navigation */}
      <Flex
        mb={6}
        gap={2}
        flexWrap='wrap'
        borderBottom='2px solid'
        borderColor={borderColor}
        pb={2}
      >
        {sections.map((section, index) => (
          <Button
            key={section.id}
            variant={activeTab === index ? 'solid' : 'ghost'}
            colorScheme={section.color}
            size='sm'
            onClick={() => setActiveTab(index)}
            borderRadius='full'
            px={4}
            py={2}
            fontWeight='medium'
            transition='all 0.2s'
            _hover={{
              transform: 'translateY(-1px)',
              boxShadow: 'md',
            }}
            leftIcon={<Text fontSize='lg'>{section.icon}</Text>}
          >
            {section.title}
          </Button>
        ))}
      </Flex>

      {/* Section Content */}
      <Box>
        <VStack spacing={6} align='stretch'>
          {/* Section Header */}
          <Box textAlign='center' mb={6}>
            <Heading size='lg' color={`${currentSection.color}.500`} mb={2}>
              {currentSection.icon} {currentSection.title}
            </Heading>
            <Text color='gray.600' fontSize='lg'>
              Important guidelines for your recovery
            </Text>
          </Box>

          {/* Section Content */}
          <VStack spacing={6} align='stretch'>
            {currentSection.content.map((contentBlock, index) => (
              <Card key={index} variant='outline' borderColor={`${currentSection.color}.200`}>
                <CardHeader
                  bg={`${currentSection.color}.50`}
                  borderBottom='1px solid'
                  borderColor={`${currentSection.color}.200`}
                >
                  <Heading size='md' color={`${currentSection.color}.700`}>
                    {contentBlock.title}
                  </Heading>
                </CardHeader>
                <CardBody>
                  <List spacing={3}>
                    {contentBlock.items.map((item, itemIndex) => {
                      const itemKey = `${currentSection.id}-${contentBlock.id}-${item.id}`;
                      const isEditing = editingNotes[itemKey];

                      return (
                        <ListItem key={itemIndex} display='flex' alignItems='flex-start'>
                          <Checkbox
                            colorScheme={currentSection.color}
                            size='lg'
                            mr={3}
                            mt={1}
                            isChecked={item.completed}
                            onChange={() =>
                              handleItemToggle(currentSection.id, contentBlock.id, item.id)
                            }
                          />
                          <Box flex='1'>
                            <HStack justify='space-between' align='flex-start'>
                              <Text
                                fontSize='md'
                                lineHeight='tall'
                                textDecoration={item.completed ? 'line-through' : 'none'}
                                color={item.completed ? 'gray.500' : 'gray.700'}
                                flex='1'
                              >
                                {item.text}
                              </Text>
                              <IconButton
                                aria-label='Add note'
                                icon={<Icon as={Edit3} />}
                                size='sm'
                                variant='ghost'
                                colorScheme={currentSection.color}
                                onClick={() =>
                                  setEditingNotes(prev => ({ ...prev, [itemKey]: !isEditing }))
                                }
                                _hover={{ bg: `${currentSection.color}.100` }}
                              />
                            </HStack>

                            {/* Note Display */}
                            {item.notes && !isEditing && (
                              <Box mt={2} p={2} bg={`${currentSection.color}.50`} borderRadius='md'>
                                <Text
                                  fontSize='sm'
                                  color={`${currentSection.color}.700`}
                                  fontStyle='italic'
                                >
                                  💬 {item.notes}
                                </Text>
                              </Box>
                            )}

                            {/* Note Editor */}
                            <Collapse in={isEditing} animateOpacity>
                              <Box
                                mt={3}
                                p={3}
                                bg='gray.50'
                                borderRadius='md'
                                border='1px solid'
                                borderColor='gray.200'
                              >
                                <HStack justify='space-between' mb={2}>
                                  <Text fontSize='sm' fontWeight='medium' color='gray.700'>
                                    Add a note:
                                  </Text>
                                  <IconButton
                                    aria-label='Close note editor'
                                    icon={<Icon as={X} />}
                                    size='xs'
                                    variant='ghost'
                                    onClick={() =>
                                      setEditingNotes(prev => ({ ...prev, [itemKey]: false }))
                                    }
                                  />
                                </HStack>
                                <Textarea
                                  placeholder='Add your personal note about this item...'
                                  value={item.notes || ''}
                                  onChange={e =>
                                    handleItemNotesUpdate(
                                      currentSection.id,
                                      contentBlock.id,
                                      item.id,
                                      e.target.value
                                    )
                                  }
                                  size='sm'
                                  rows={2}
                                  resize='vertical'
                                  mb={2}
                                />
                                <HStack justify='flex-end'>
                                  <Button
                                    size='sm'
                                    colorScheme={currentSection.color}
                                    onClick={() => {
                                      handleSaveItemNotes(
                                        currentSection.id,
                                        contentBlock.id,
                                        item.id
                                      );
                                      setEditingNotes(prev => ({ ...prev, [itemKey]: false }));
                                    }}
                                  >
                                    Save Note
                                  </Button>
                                </HStack>
                              </Box>
                            </Collapse>
                          </Box>
                        </ListItem>
                      );
                    })}
                  </List>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default BrochureSections;
