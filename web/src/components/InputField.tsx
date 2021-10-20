import { FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react"
import { useField } from "formik"
import React, { InputHTMLAttributes } from "react";

// make input component accept props
type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
};

const InputField: React.FC<InputFieldProps> = ({label, size: _, ...props}) => {
  const [field, {error}] = useField(props);
  return (
    // convert error to boolean
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...field} {...props} id={field.name} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  )
}

export default InputField;