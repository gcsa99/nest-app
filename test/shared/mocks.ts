import { CreateAccountBodySchema, CreateQuestionBodySchema } from '@/dto';

export const createAccount: CreateAccountBodySchema = {
  name: 'Test Account',
  email: 'test@example.com',
  password: 'password',
};

export const createQuestion: CreateQuestionBodySchema[] = [
  {
    title: 'Test Question 1',
    content: 'Test Question Content 1',
  },
  {
    title: 'Test Question 2',
    content: 'Test Question Content 2',
  },
  {
    title: 'Test Question 3',
    content: 'Test Question Content 3',
  },
];
