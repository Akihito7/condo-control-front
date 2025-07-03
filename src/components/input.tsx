interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Root = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center border border-gray-300 rounded-md px-3 py-4 shadow-sm w-full focus-within:ring-2 focus-within:ring-blue-500">
    {children}
  </div>
);

const Input = ({ className, ...props }: InputProps) => (
  <input
    type="text"
    className="flex-1 outline-none bg-transparent placeholder-gray-500"
    {...props}
  />
);

const Icon = ({ children }: { children: React.ReactNode }) => (
  <div className="ml-2 text-gray-400" aria-hidden="true">
    {children}
  </div>
);

export const CustomInput = {
  Root,
  Input,
  Icon,
};
