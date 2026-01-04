import { CommandInterface } from "./command-inteface";
import { deleteGeneric } from "@/api/delete-generic";

export interface CommandDeleteProps {
  tableName: string;
  registerId: number | string;
  isSoftDelete?: boolean;
}
export class CommandDelete implements CommandInterface<CommandDeleteProps> {
  async execute(params?: CommandDeleteProps): Promise<void> {
    await deleteGeneric(params!);
  }
}
