interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={`cursor-pointer bg-blue-600 hover:bg-blue-700 w-full text-white font-medium py-4 px-4 rounded-md transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
