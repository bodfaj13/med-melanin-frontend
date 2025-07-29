import { useState } from 'react';
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
  Checkbox,
  Box,
  Alert,
  AlertIcon,
  SimpleGrid,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { useSignUp } from '@/api/auth/use-auth';
import { signUpSchema, type SignUpFormData } from '@/utils/validations/auth-validations';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setAuth } from '@/store/auth-slice';
import type { User } from '@/api/auth/types';

const SignUp = () => {
  const signUpMutation = useSignUp();
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: SignUpFormData) => {
    if (!agreedToTerms) {
      toast({
        title: 'Terms and Conditions',
        description: 'Please agree to the terms and conditions to continue',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    try {
      const response = await signUpMutation.mutateAsync(data);

      console.log('response', response);

      // Store auth data in Redux
      dispatch(
        setAuth({
          user: response.data?.user as User,
          token: response.data?.token as string,
        })
      );

      // Clear any existing dashboard visit flag for new user
      localStorage.removeItem('dashboard-visited');

      // Show success toast with personalized message
      toast({
        title: `Welcome, ${data.firstName}!`,
        description: 'Your account has been created successfully. Redirecting to your dashboard...',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={6}>
        {/* Error Alert */}
        {signUpMutation.error && (
          <Alert status='error' borderRadius='lg'>
            <AlertIcon />
            <Text fontSize='sm'>{signUpMutation.error.message}</Text>
          </Alert>
        )}

        {/* Name Fields */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w='full'>
          <FormControl isRequired isInvalid={!!errors.firstName}>
            <FormLabel fontWeight='semibold' color='gray.700'>
              First Name
            </FormLabel>
            <Input
              {...register('firstName')}
              placeholder='First name'
              size='lg'
              borderRadius='lg'
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
              }}
            />
            <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.lastName}>
            <FormLabel fontWeight='semibold' color='gray.700'>
              Last Name
            </FormLabel>
            <Input
              {...register('lastName')}
              placeholder='Last name'
              size='lg'
              borderRadius='lg'
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
              }}
            />
            <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>

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

        {/* Password Fields */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w='full'>
          <FormControl isRequired isInvalid={!!errors.password}>
            <FormLabel fontWeight='semibold' color='gray.700'>
              Password
            </FormLabel>
            <InputGroup size='lg'>
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder='Create password'
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

          <FormControl isRequired isInvalid={!!errors.confirmPassword}>
            <FormLabel fontWeight='semibold' color='gray.700'>
              Confirm Password
            </FormLabel>
            <InputGroup size='lg'>
              <Input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Confirm password'
                borderRadius='lg'
                _focus={{
                  borderColor: 'blue.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
                }}
              />
              <InputRightElement>
                <IconButton
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                  variant='ghost'
                  size='sm'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  _hover={{ bg: 'transparent' }}
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>

        {/* Terms and Conditions */}
        <Box w='full'>
          <Checkbox
            isChecked={agreedToTerms}
            onChange={e => setAgreedToTerms(e.target.checked)}
            colorScheme='blue'
            size='lg'
          >
            <Text fontSize='sm' color='gray.600'>
              I agree to the{' '}
              <Text as='span' color='blue.500' fontWeight='semibold'>
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text as='span' color='blue.500' fontWeight='semibold'>
                Privacy Policy
              </Text>
            </Text>
          </Checkbox>
        </Box>

        {/* Medical Consent */}
        <Alert status='info' borderRadius='lg'>
          <AlertIcon />
          <Box>
            <Text fontSize='sm' fontWeight='semibold'>
              Medical Information Consent
            </Text>
            <Text fontSize='xs' color='gray.600'>
              By creating an account, you consent to share your medical information for personalized
              aftercare services.
            </Text>
          </Box>
        </Alert>

        {/* Create Account Button */}
        <Button
          type='submit'
          colorScheme='blue'
          w='full'
          size='lg'
          isLoading={signUpMutation.isPending}
          loadingText='Creating account...'
          fontWeight='semibold'
          _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
          transition='all 0.2s'
        >
          Create Account
        </Button>

        {/* Benefits */}
        <Box bg='green.50' p={4} borderRadius='lg' border='1px' borderColor='green.200' w='full'>
          <VStack spacing={2} align='start'>
            <Text fontSize='sm' fontWeight='semibold' color='green.700'>
              ✅ What you'll get:
            </Text>
            <Text fontSize='xs' color='green.600'>
              • Personalized recovery tracking
            </Text>
            <Text fontSize='xs' color='green.600'>
              • Interactive aftercare guide
            </Text>
            <Text fontSize='xs' color='green.600'>
              • Symptom monitoring tools
            </Text>
            <Text fontSize='xs' color='green.600'>
              • 24/7 access to medical resources
            </Text>
          </VStack>
        </Box>
      </VStack>
    </form>
  );
};

export default SignUp;
