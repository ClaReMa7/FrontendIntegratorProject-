import React from "react";

function Button({ variant = "primary", children, onClick }) {
  const baseStyles = "px-4 py-2 rounded-lg font-semibold transition duration-300 text-sm sm:text-base md:text-lg";

  const variants = {
    primary: "bg-[#730f06] text-[#d9c6b0] hover:bg-[#d9c6b0] hover:text-[#3e0b05] ",
    secondary: "bg-[#b08562] text-[#1e1e1e] hover:bg-[#757575]",
    accent: "bg-[#730f06] text-[#d9c6b0] hover:bg-[#3e0b05]",
    danger: "bg-[#730f06] text-white hover:bg-[#3e0b05]",
    outline: "border-2 border-[#b08562] text-[#b08562] hover:bg-[#d9c6b0] hover:text-[#3e0b05] hover:border-transparent",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} w-full sm:w-auto`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
