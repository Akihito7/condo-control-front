import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ModalCreateAsset() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Adicionar Ativo</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">EM BREVE</DialogTitle>
          <DialogDescription>EM BREVE</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
