import type { PropsWithChildren } from 'react';
import {
  FormProvider,
  useForm,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
} from 'react-hook-form';

interface FormProps<TFieldValues extends FieldValues = FieldValues> {
  // Single prop that accepts either config or methods
  formConfig?: UseFormProps<TFieldValues> | UseFormReturn<TFieldValues>;

  // Standard form props
  onSubmit?: (data: TFieldValues) => void | Promise<void>;
  className?: string;
  id?: string;
}

// Type guard to check if the prop is UseFormReturn (methods)
function isFormMethods<TFieldValues extends FieldValues>(
  formConfig: UseFormProps<TFieldValues> | UseFormReturn<TFieldValues> | undefined
): formConfig is UseFormReturn<TFieldValues> {
  return formConfig !== undefined && 'handleSubmit' in formConfig;
}

const Form = <TFieldValues extends FieldValues = FieldValues>({
  children,
  formConfig,
  onSubmit,
  className,
  id,
}: PropsWithChildren<FormProps<TFieldValues>>) => {
  const methods = isFormMethods(formConfig) ? formConfig : useForm<TFieldValues>(formConfig);

  const handleSubmit = methods.handleSubmit(async (data) => {
    if (onSubmit) {
      await onSubmit(data);
    }
  });

  return (
    <FormProvider {...methods}>
      <form className={className} id={id} onSubmit={handleSubmit}>
        {children}
      </form>
    </FormProvider>
  );
};

export default Form;
