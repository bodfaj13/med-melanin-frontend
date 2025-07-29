import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Text,
  Link,
  HStack,
  Divider,
  Box,
  FormErrorMessage,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { useSignIn } from '@/api/auth/use-auth';
import { signInSchema, type SignInFormData } from '@/utils/validations/auth-validations';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setAuth } from '@/store/auth-slice';
import type { User } from '@/api/auth/types';

// Type for API error response
interface ApiErrorResponse {
  response?: {
    data?: {
      errors?: Array<{
        message?: string;
      }>;
    };
  };
}

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const signInMutation = useSignIn();
  const toast = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: yupResolver(signInSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      setErrorMessage(null);
      const response = await signInMutation.mutateAsync(data);
      toast({
        title: 'Signed in successfully',
        status: 'success',
        duration: 2000,
      });

      // Store auth data in Redux
      dispatch(
        setAuth({
          user: response.data?.user as User,
          token: response.data?.token as string,
        })
      );

      navigate('/dashboard');
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'response' in error
          ? (error as ApiErrorResponse)?.response?.data?.errors?.[0]?.message ||
            'An error occurred during sign in'
          : 'An error occurred during sign in';
      setErrorMessage(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={6}>
        {/* Error Alert */}
        {errorMessage && (
          <Alert status='error' borderRadius='lg'>
            <AlertIcon />
            <Text fontSize='sm'>{errorMessage}</Text>
          </Alert>
        )}

        {/* Email Field */}
        <FormControl isRequired isInvalid={!!errors.email}>
          <FormLabel fontWeight='semibold' color='gray.700'>
            Email Address
          </FormLabel>
          <Input
            {...register('email')}
            type='email'
            placeholder='Enter your email address'
            size='lg'
            borderRadius='lg'
            _focus={{
              borderColor: 'blue.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
            }}
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        {/* Password Field */}
        <FormControl isRequired isInvalid={!!errors.password}>
          <FormLabel fontWeight='semibold' color='gray.700'>
            Password
          </FormLabel>
          <InputGroup size='lg'>
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter your password'
              borderRadius='lg'
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
              }}
            />
            <InputRightElement>
              <IconButton
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                variant='ghost'
                size='sm'
                onClick={() => setShowPassword(!showPassword)}
                _hover={{ bg: 'transparent' }}
              />
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>

        {/* Forgot Password Link */}
        <Box w='full' textAlign='right'>
          <Link color='blue.500' fontSize='sm' _hover={{ textDecoration: 'underline' }}>
            Forgot your password?
          </Link>
        </Box>

        {/* Sign In Button */}
        <Button
          type='submit'
          colorScheme='blue'
          w='full'
          size='lg'
          isLoading={signInMutation.isPending}
          loadingText='Signing in...'
          fontWeight='semibold'
          _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
          transition='all 0.2s'
        >
          Sign In
        </Button>

        {/* Divider */}
        <HStack w='full' py={2}>
          <Divider />
          <Text fontSize='sm' color='gray.500' px={4}>
            or
          </Text>
          <Divider />
        </HStack>

        {/* Demo Login */}
        <VStack spacing={3} w='full'>
          <Text fontSize='sm' color='gray.600' textAlign='center'>
            Try our demo with sample data
          </Text>
          <Button
            variant='outline'
            colorScheme='blue'
            w='full'
            size='lg'
            onClick={() => {
              toast({
                title: 'Demo mode activated',
                description: 'You can now explore the dashboard with sample data',
                status: 'info',
                duration: 3000,
              });
              // For demo mode, we'll just show the toast and let the user navigate manually
            }}
            _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
            transition='all 0.2s'
          >
            🚀 Try Demo
          </Button>
        </VStack>

        {/* Security Notice */}
        <Box bg='blue.50' p={4} borderRadius='lg' border='1px' borderColor='blue.200' w='full'>
          <Text fontSize='sm' color='blue.700' textAlign='center'>
            🔒 Your medical information is protected with bank-level security
          </Text>
        </Box>
      </VStack>
    </form>
  );
};

export default SignIn;
