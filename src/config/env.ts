import { APP_ENV } from '@/shared/constants/app-env';
import * as yup from 'yup';

const envSchema = yup.object({
  APP_ENV: yup.string().oneOf(Object.values(APP_ENV)).required(),
  APP_VERSION: yup.string().required(),
  APP_API_SERVICE_BASEURL: yup.string().required(),
});

const validateEnv = () => {
  try {
    // validateSync throws if validation fails
    const validated = envSchema.validateSync(import.meta.env, {
      abortEarly: false, // Get all errors, not just the first one
      stripUnknown: true, // Remove unknown properties
    });
    return validated;
  } catch (ex) {
    if (ex instanceof yup.ValidationError) {
      console.error('❌ Invalid environment variables:');
      ex.inner.forEach((err) => {
        console.error(`  - ${err.path}: ${err.message}`);
      });
    }
    return null;
  }
};

export const env = validateEnv();
