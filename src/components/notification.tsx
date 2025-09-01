import { BellIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface NotificationItem {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
}

// Exemplo de notificações
const sampleNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "Nova Mensagem",
    description: "Você recebeu uma nova mensagem.",
    createdAt: "Agora",
    read: false,
  },
  {
    id: 2,
    title: "Atualização",
    description: "O relatório do condomínio foi atualizado.",
    createdAt: "1h atrás",
    read: true,
  },
  {
    id: 3,
    title: "Alerta",
    description: "Nova tarefa atribuída a você.",
    createdAt: "2h atrás",
    read: false,
  },
  {
    id: 4,
    title: "Lembrete",
    description: "Reunião começando em 30 minutos.",
    createdAt: "3h atrás",
    read: true,
  },
  {
    id: 5,
    title: "Nova Mensagem",
    description: "Você recebeu uma nova mensagem.",
    createdAt: "Agora",
    read: false,
  },
  {
    id: 6,
    title: "Atualização",
    description: "O relatório do condomínio foi atualizado.",
    createdAt: "1h atrás",
    read: true,
  },
];

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const unreadCount = sampleNotifications.filter((n) => !n.read).length;
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown quando clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative flex justify-end" ref={dropdownRef}>
      {/* Botão do sino */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
      >
        <BellIcon className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Drop-down */}
      {open && (
        <div className="absolute right-0 mt-10 min-w-[300px] w-96 bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden z-50">
          <div className="px-4 py-2 border-b border-gray-200 font-semibold text-gray-700">
            Notificações
          </div>
          <div className="max-h-80 overflow-y-auto">
            {sampleNotifications.map((n) => (
              <div
                key={n.id}
                className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                  n.read ? "hover:bg-gray-100" : "bg-blue-100 hover:bg-blue-200"
                }`}
              >
                <div className="font-medium text-gray-800">{n.title}</div>
                <div className="text-gray-600 text-sm">{n.description}</div>
                <div className="text-gray-400 text-xs mt-1">{n.createdAt}</div>
              </div>
            ))}
          </div>
          {/*  <div className="px-4 py-2 border-t border-gray-200 text-center text-sm text-gray-500 hover:bg-gray-100 cursor-pointer">
            Ver todas as notificações
          </div> */}
        </div>
      )}
    </div>
  );
}
