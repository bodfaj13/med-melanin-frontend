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
} from '@chakra-ui/react';
import {
  updateSurgeryDateSchema,
  type UpdateSurgeryDateFormData,
} from '@/utils/validations/auth-validations';

interface UpdateSurgeryDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateSurgeryDateFormData) => Promise<void>;
  isLoading: boolean;
}

export const UpdateSurgeryDateModal: React.FC<UpdateSurgeryDateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateSurgeryDateFormData>({
    resolver: yupResolver(updateSurgeryDateSchema),
    mode: 'onChange',
  });

  const handleFormSubmit = async (data: UpdateSurgeryDateFormData) => {
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
        <ModalHeader>Update Surgery Date</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id='surgery-date-form' onSubmit={handleSubmit(handleFormSubmit)}>
            <FormControl isInvalid={!!errors.surgeryDate}>
              <FormLabel>Surgery Date</FormLabel>
              <Input
                type='date'
                {...register('surgeryDate')}
                max={new Date().toISOString().split('T')[0]}
              />
              <FormErrorMessage>{errors.surgeryDate?.message}</FormErrorMessage>
            </FormControl>
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
            loadingText='Updating...'
            form='surgery-date-form'
          >
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
