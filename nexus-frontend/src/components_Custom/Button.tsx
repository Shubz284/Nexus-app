import type { ReactElement } from "react";

export interface ButtonProps {
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  text?: string;
  startIcon?: ReactElement;
  onClick?: () => void;
  fullWidth?:boolean;
  loading?:boolean
}


const Button = (props: ButtonProps) => {
  const variantClassses = {
    primary: "bg-[#e0e7ff] text-indigo-600 hover:bg-[#babfd1]",
    secondary: " text-white rounded-lg bg-[#5046e4] hover:bg-indigo-700",
  };

  const sizeStyles = {
    sm: "px-2 py-1",
    md: "px-3 py-1.5",
    lg: "px-6 py-3",
  };
  return (
    <div>
      <button
        onClick={props.onClick}
        className={`${variantClassses[props.variant]} ${sizeStyles[props.size]} 
        flex cursor-pointer items-center gap-2 rounded-lg font-normal 
        ${props.fullWidth ? " w-full flex justify-center items-center":""}
        `}
      >
        {props.startIcon && <span>{props.startIcon}</span>}
        <span>{props.text}</span>
      </button>
    </div>
  );
};

export default Button;
