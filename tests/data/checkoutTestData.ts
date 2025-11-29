/**
 * Test Data for Checkout Tests
 * Contains user information and product details
 */

export interface CheckoutUserData {
  firstName: string;
  lastName: string;
  postalCode: string;
  description: string;
  isValid: boolean;
}

export interface ProductData {
  name: string;
  description: string;
}

export const CHECKOUT_USER_DATA: CheckoutUserData[] = [
  {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345',
    description: 'Valid checkout form data',
    isValid: true,
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    postalCode: '54321',
    description: 'Another valid checkout user',
    isValid: true,
  },
  {
    firstName: '',
    lastName: 'Doe',
    postalCode: '12345',
    description: 'Missing first name',
    isValid: false,
  },
  {
    firstName: 'John',
    lastName: '',
    postalCode: '12345',
    description: 'Missing last name',
    isValid: false,
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '',
    description: 'Missing postal code',
    isValid: false,
  },
  {
    firstName: '',
    lastName: '',
    postalCode: '',
    description: 'All fields empty',
    isValid: false,
  },
];

export const PRODUCT_DATA: ProductData[] = [
  {
    name: 'Sauce Labs Backpack',
    description: 'A robust and practical backpack for your shopping needs',
  },
  {
    name: 'Sauce Labs Bike Light',
    description: 'A bright bike light for your safety',
  },
  {
    name: 'Sauce Labs Bolt T-Shirt',
    description: 'A comfortable t-shirt with lightning bolt design',
  },
  {
    name: 'Sauce Labs Fleece Jacket',
    description: 'A warm and cozy fleece jacket',
  },
];
