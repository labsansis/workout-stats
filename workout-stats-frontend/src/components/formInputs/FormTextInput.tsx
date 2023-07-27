/*
A text input field for use in forms driven by Formik.
*/
import { useField } from "formik";

// default HTML props for an input
type BuiltInTextInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

type TextInputProps = { label: string; name: string } & BuiltInTextInputProps;

const FormTextInput = ({ label, ...props }: TextInputProps) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);

  return (
    <div>
      <input
        className="border-2 rounded p-2 w-full"
        placeholder={label}
        {...field}
        {...props}
      />
      <div className="text-sm text-[#b91c1c] min-h-[2em] px-[0.5em]">
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </div>
    </div>
  );
};

export default FormTextInput;
