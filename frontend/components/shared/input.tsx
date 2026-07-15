"use client";

interface Props {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="theme-muted text-sm">{label}</label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          w-full
          px-4
          py-3
          rounded-lg
          theme-input
          border
          outline-none
        "
      />
    </div>
  );
}
