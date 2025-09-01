import { useNotificationContext } from "@/providers/use-notification-context";
import { BellIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "@/api/mark-notification-as-read";

function parseDateWithoutTimezone(dateString: string) {
  const [year, month, day, hour, minute, second] = dateString
    .split(/[-T:.Z]/)
    .map(Number);
  return new Date(year, month - 1, day, hour, minute, second || 0);
}

export function NotificationDropdown() {
  const { notifications } = useNotificationContext();
  const [open, setOpen] = useState(false);
  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const queryClient = useQueryClient();
  const { mutateAsync: handleMarkNotificationAsRead } = useMutation({
    mutationFn: (notificationId: number) =>
      markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });

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
            {notifications?.map((n) => (
              <div
                key={n.id}
                className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                  n.read ? "hover:bg-gray-100" : "bg-blue-100 hover:bg-blue-200"
                }`}
                onClick={async () => {
                  await handleMarkNotificationAsRead(n.id);
                }}
              >
                <div className="font-medium text-gray-800">{n.title}</div>
                <div className="text-gray-600 text-sm">{n.description}</div>
                <div className="text-gray-400 text-xs mt-1">
                  {formatDistanceToNow(
                    n.createdAt
                      ? parseDateWithoutTimezone(n.createdAt as string)
                      : new Date(),
                    {
                      addSuffix: true,
                      locale: ptBR,
                    }
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
