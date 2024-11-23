import __debounce from "lodash/debounce";
import React, { ChangeEvent, useCallback, useState } from "react";

type DebouncedInputProps = {
    wait?: number;
    value?: string;
    onChange: (value: string) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function DebouncedInput({
  wait,
  value,
  onChange,
  ...rest
}: DebouncedInputProps) {
  const [userInput, setUserInput] = useState(value || "");
  const onDebouncedChanged = useCallback(
    __debounce((value: string) => {
      onChange(value);
    }, wait || 300),
    [wait],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    onDebouncedChanged(value);
  };

  return <input {...rest} value={userInput} onChange={handleChange} />;
}
