import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '@/utils/validations/auth-validations';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ChangePasswordFormData) => Promise<void>;
  isLoading: boolean;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const handleFormSubmit = async (data: ChangePasswordFormData) => {
    await onSubmit(data);
    reset();
    setShowPasswords({ current: false, new: false, confirm: false });
  };

  const handleClose = () => {
    reset();
    setShowPasswords({ current: false, new: false, confirm: false });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Change Password</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id='password-form' onSubmit={handleSubmit(handleFormSubmit)}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.currentPassword}>
                <FormLabel>Current Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPasswords.current ? 'text' : 'password'}
                    {...register('currentPassword')}
                    placeholder='Enter your current password'
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPasswords.current ? 'Hide password' : 'Show password'}
                      icon={showPasswords.current ? <ViewOffIcon /> : <ViewIcon />}
                      variant='ghost'
                      size='sm'
                      onClick={() =>
                        setShowPasswords(prev => ({ ...prev, current: !prev.current }))
                      }
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.currentPassword?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.newPassword}>
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPasswords.new ? 'text' : 'password'}
                    {...register('newPassword')}
                    placeholder='Enter your new password'
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPasswords.new ? 'Hide password' : 'Show password'}
                      icon={showPasswords.new ? <ViewOffIcon /> : <ViewIcon />}
                      variant='ghost'
                      size='sm'
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.newPassword?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel>Confirm New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    placeholder='Confirm your new password'
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPasswords.confirm ? 'Hide password' : 'Show password'}
                      icon={showPasswords.confirm ? <ViewOffIcon /> : <ViewIcon />}
                      variant='ghost'
                      size='sm'
                      onClick={() =>
                        setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))
                      }
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
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
            loadingText='Changing...'
            form='password-form'
          >
            Change Password
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
