import { Breadcrumb } from "@/components/breadcrumb";

export default function EditUser() {
  return (
    <div className="bg-white w-full min-h-screen grid grid-rows-[auto_1fr] p-6">
      <Breadcrumb paths={["home", "backoffice", "users"]} />

      <div className="bg-white w-full rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Editar Usuário
        </h1>

        <form className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nome Completo
            </label>
            <input
              id="name"
              type="text"
              placeholder="Maria Silva"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm 
                focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="maria@email.com"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm 
                focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="cpf"
              className="block text-sm font-medium text-gray-700"
            >
              CPF
            </label>
            <input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              maxLength={14}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm 
                focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="birthdate"
              className="block text-sm font-medium text-gray-700"
            >
              Data de Nascimento
            </label>
            <input
              id="birthdate"
              type="date"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm 
                focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="condominium"
              className="block text-sm font-medium text-gray-700"
            >
              Condomínio
            </label>
            <input
              id="condominium"
              type="text"
              placeholder="Condomínio Exemplo"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm 
                focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="apartment"
              className="block text-sm font-medium text-gray-700"
            >
              Apartamento
            </label>
            <input
              id="apartment"
              type="text"
              placeholder="101"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm 
                focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Função
            </label>
            <select
              id="role"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm 
                focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
            >
              <option>Administrador</option>
              <option>Usuário</option>
              <option>Moderador</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="reset"
              className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
