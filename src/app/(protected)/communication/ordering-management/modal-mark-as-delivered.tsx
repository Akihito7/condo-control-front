import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendCodeToMarkAsDelivered } from "@/api/send-code-to-mark-as-delivered";
import { Delivery } from "@/api/fetch-deliveries";
import { Factory } from "lucide-react";
import { confirmationCode } from "@/api/confirmation-code";

interface ModalMarkAsDeliveredProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deliverySelected: Delivery | undefined;
  setDeliverySelected: React.Dispatch<
    React.SetStateAction<Delivery | undefined>
  >;
}

export function ModalMarkAsDelivered({
  isOpen,
  setIsOpen,
  deliverySelected,
  setDeliverySelected,
}: ModalMarkAsDeliveredProps) {
  const [code, setCode] = useState("");
  const [emailSent, setEmailSent] = useState("");
  const queryClient = useQueryClient();

  const { mutateAsync: handleSendCode } = useMutation({
    mutationFn: () => {
      setEmailSent("");
      return sendCodeToMarkAsDelivered(deliverySelected!.id);
    },
    onSuccess: () => {
      setEmailSent("Codigo enviado para seu email.");
    },
  });

  const { mutateAsync: handleConfirmation } = useMutation({
    mutationFn: () => {
      return confirmationCode(code);
    },
    onSuccess: () => {
      setDeliverySelected(undefined);
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["deliveries"],
        exact: false,
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
      <DialogContent className="sm:max-w-md rounded-2xl shadow-2xl p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Confirmar entrega
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Clique para enviar o codigo e insira abaixo os 6 dígitos para
            confirmar a entrega.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            {/* Linha do botão de enviar */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Código de confirmação
              </span>
              <Button variant="link" size="sm" onClick={() => handleSendCode()}>
                Enviar código
              </Button>
            </div>

            {emailSent && (
              <span className="text-sm text-green-600 font-medium">
                {emailSent}
              </span>
            )}
          </div>

          {/* Input OTP */}
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(val) => setCode(val)}
            >
              <InputOTPGroup>
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="mt-6 flex justify-between">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            onClick={() => {
              handleConfirmation();
            }}
            disabled={code.length !== 6}
          >
            Confirmar entrega
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
