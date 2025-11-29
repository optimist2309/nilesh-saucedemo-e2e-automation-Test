/**
 * Test Data for Login Tests
 * Contains various user credentials for testing
 */

export interface LoginTestData {
  username: string;
  password: string;
  description: string;
  isValid: boolean;
}

export const LOGIN_TEST_DATA: LoginTestData[] = [
  {
    username: 'standard_user',
    password: 'secret_sauce',
    description: 'Valid standard user credentials',
    isValid: true,
  },
  {
    username: 'problem_user',
    password: 'secret_sauce',
    description: 'Valid problem user credentials',
    isValid: true,
  },
  {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    description: 'Valid performance glitch user credentials',
    isValid: true,
  },
  {
    username: 'locked_out_user',
    password: 'secret_sauce',
    description: 'Locked out user - should fail',
    isValid: false,
  },
  {
    username: 'invalid_user',
    password: 'wrong_password',
    description: 'Invalid username and password',
    isValid: false,
  },
  {
    username: 'standard_user',
    password: 'wrong_password',
    description: 'Valid username but wrong password',
    isValid: false,
  },
  {
    username: '',
    password: 'secret_sauce',
    description: 'Empty username',
    isValid: false,
  },
  {
    username: 'standard_user',
    password: '',
    description: 'Empty password',
    isValid: false,
  },
];
