function Button({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        w-full
        bg-gradient-to-r
        from-blue-600
        to-indigo-600
        text-white
        py-3
        rounded-xl
        font-semibold
        shadow-lg
        hover:scale-[1.02]
        hover:shadow-xl
        transition-all
        duration-300
      "
    >
      {text}
    </button>
  );
}

export default Button;