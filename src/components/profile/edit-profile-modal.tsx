import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import {
  updateProfileSchema,
  type UpdateProfileFormData,
} from '@/utils/validations/auth-validations';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateProfileFormData) => Promise<void>;
  isLoading: boolean;
  defaultValues: {
    firstName: string;
    lastName: string;
  };
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  defaultValues,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileFormData>({
    resolver: yupResolver(updateProfileSchema),
    defaultValues,
    mode: 'onChange',
  });

  const handleFormSubmit = async (data: UpdateProfileFormData) => {
    await onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id='profile-form' onSubmit={handleSubmit(handleFormSubmit)}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.firstName}>
                <FormLabel>First Name</FormLabel>
                <Input {...register('firstName')} placeholder='Enter your first name' />
                <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.lastName}>
                <FormLabel>Last Name</FormLabel>
                <Input {...register('lastName')} placeholder='Enter your last name' />
                <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
              </FormControl>
            </VStack>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant='ghost' mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type='submit'
            colorScheme='blue'
            isLoading={isLoading}
            loadingText='Saving...'
            form='profile-form'
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
