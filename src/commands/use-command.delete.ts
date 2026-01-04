import { useMutation } from "@tanstack/react-query";
import { CommandDelete, CommandDeleteProps } from "./command.delete";

type UseCommandDeleteProps = {
  onSuccess?: () => void;
};

export function useCommandDelete({ onSuccess }: UseCommandDeleteProps) {
  const commandDelete = new CommandDelete();
  const { mutateAsync } = useMutation({
    mutationFn: commandDelete.execute,
    onSuccess,
  });

  return {
    execute: mutateAsync,
  };
}
