export interface SignupData {
  username: string;
  email: string;
  password: string;
  phone_number: string;
  role: 'CUSTOMER' | 'PROVIDER';
  first_name?: string;
  last_name?: string;
}
