import * as yup from 'yup';

export const signUpSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  email: yup.string().required('Email is required').email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(4, 'Password must be at least 4 characters'),
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  //   'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  // ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export const signInSchema = yup.object({
  email: yup.string().required('Email is required').email('Please enter a valid email address'),
  password: yup.string().required('Password is required'),
});

export const updateProfileSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(30, 'First name must be less than 30 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(30, 'Last name must be less than 30 characters'),
});

export const updateSurgeryDateSchema = yup.object({
  surgeryDate: yup
    .string()
    .required('Surgery date is required')
    .test('not-future', 'Surgery date cannot be in the future', function (value) {
      if (!value) return true; // Let required validation handle empty values
      const selectedDate = new Date(value);
      const today = new Date();
      return selectedDate <= today;
    })
    .test(
      'not-too-old',
      'Please check your surgery date. It seems to be more than 2 years ago.',
      function (value) {
        if (!value) return true; // Let required validation handle empty values
        const selectedDate = new Date(value);
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
        return selectedDate >= twoYearsAgo;
      }
    ),
});

export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'New password must be at least 8 characters long')
    .test(
      'different-from-current',
      'New password must be different from current password',
      function (value) {
        const currentPassword = this.parent.currentPassword;
        return value !== currentPassword;
      }
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

export type SignUpFormData = yup.InferType<typeof signUpSchema>;
export type SignInFormData = yup.InferType<typeof signInSchema>;
export type UpdateProfileFormData = yup.InferType<typeof updateProfileSchema>;
export type UpdateSurgeryDateFormData = yup.InferType<typeof updateSurgeryDateSchema>;
export type ChangePasswordFormData = yup.InferType<typeof changePasswordSchema>;
