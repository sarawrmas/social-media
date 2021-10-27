import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from "@chakra-ui/react"
import { useField } from "formik"
import React, { InputHTMLAttributes } from "react";

// make input component accept props
type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  textarea?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({label, textarea, size: _, ...props}) => {
  let InputOrTextarea: any = Input;
  if (textarea) {
    InputOrTextarea = Textarea;
  }
  const [field, {error}] = useField(props);
  return (
    // convert error to boolean
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputOrTextarea {...field} {...props} id={field.name} p={15}/>
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  )
}

export default InputField;