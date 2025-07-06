import { LoginForm } from "./login-form";

export default function Signin() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex w-1/2 items-center justify-center text-white px-8">
        <h2 className="text-3xl font-bold text-center">
          Organização, segurança e praticidade na gestão do seu condomínio.
        </h2>
      </div>
      <div className="flex flex-1 bg-white items-center justify-center px-2 py-12 lg:w-1/2">
        <div className="w-full max-w-md xl:px-32 xl:max-w-full space-y-6">
          <h1 className="text-4xl font-semibold text-gray-800 text-center lg:text-left">
            Seja bem-vindo novamente 👋
          </h1>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
