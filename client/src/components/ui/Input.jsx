function Input({
  type,
  placeholder,
  value,
  onChange,
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        w-full
        px-4
        py-4
        mb-4
        rounded-xl
        border
        border-slate-200
        bg-slate-50
        text-slate-800
        placeholder:text-slate-400
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:border-transparent
        transition-all
        duration-300
      "
    />
  );
}

export default Input;