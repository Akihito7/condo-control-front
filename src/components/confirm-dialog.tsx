import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

export const ConfirmDialogWrapper = ({children} : { children : React.ReactNode}) => {
    return 
    <Dialog>


        <DialogContent>
             <DialogHeader>
          <DialogTitle>Registro de Visitantes</DialogTitle>
          <DialogDescription>
            Preencha as informações da unidade e das pessoas vinculadas à
            visita.
          </DialogDescription>
        </DialogHeader>
        </DialogContent>
    </Dialog>
}