import * as yup from 'yup';

export const loginFormSchema = yup.object().shape({
  username: yup.string().label('Username').required(),
  password: yup.string().label('Password').required(),
});
