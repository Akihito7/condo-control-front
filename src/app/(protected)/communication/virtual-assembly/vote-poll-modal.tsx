"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PollWithStats } from "@/api/fetch-assembly-polls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVoteAssemblyVirtualPoll } from "@/api/create-vote-assembly-virtual-poll";
import { isBefore } from "date-fns";
import { Progress } from "@/components/ui/progress";

type VotePollModalProps = {
  pollTitle: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPollSelected: React.Dispatch<
    React.SetStateAction<PollWithStats | undefined>
  >;
  pollSelected: PollWithStats | undefined;
};

export function VotePollModal({
  pollTitle,
  isOpen,
  setIsOpen,
  setPollSelected,
  pollSelected,
}: VotePollModalProps) {
  const [choice, setChoice] = useState<"sim" | "não" | "">("");
  const alreadyVoted = pollSelected?.currentUserAlreadyVoted ?? false;
  const alreadyFinished = pollSelected
    ? isBefore(new Date(pollSelected?.endDate), new Date())
    : false;

  const queryClient = useQueryClient();

  const { mutateAsync: handleCreateVote } = useMutation({
    mutationFn: async ({ pollId, choice }: any) =>
      createVoteAssemblyVirtualPoll({ pollId, choice }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["polls"],
        exact: false,
      });
    },
  });

  useEffect(() => {
    if (alreadyVoted) {
      setChoice(pollSelected?.currentVoteUser?.toLowerCase() as any);
    }
  }, [pollSelected, alreadyVoted]);

  const handleSubmit = () => {
    if (alreadyFinished) {
      alert("Votação encerrada");
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      setIsOpen(false);
      setPollSelected(undefined);
      return;
    }
    if (choice) {
      handleCreateVote({ pollId: pollSelected!.id, choice });
    }
    setIsOpen(false);
    setPollSelected(undefined);
    setChoice("");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (pollSelected && !open) {
          setPollSelected(undefined);
        }
        setIsOpen(open);
      }}
    >
      <DialogContent className="sm:max-w-lg rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{pollTitle}</DialogTitle>
          {pollSelected?.description && (
            <p className="mt-3 text-sm text-gray-600 italic leading-relaxed">
              {pollSelected.description}
            </p>
          )}
          <DialogDescription className="text-muted-foreground mt-1">
            {alreadyVoted
              ? "Você já votou nesta enquete. Abaixo está sua escolha:"
              : "Escolha uma opção abaixo para registrar seu voto."}
          </DialogDescription>
        </DialogHeader>

  
        {!alreadyFinished && (
          <div className="space-y-4 mt-4">
            <fieldset className="border border-gray-200 rounded-md p-4">
              <legend className="text-sm font-semibold mb-2">
                Sua escolha
              </legend>
              <RadioGroup
                value={choice}
                onValueChange={(val) => setChoice(val as "sim" | "não")}
                disabled={alreadyVoted}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="vote-sim" />
                  <Label htmlFor="vote-sim">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="não" id="vote-nao" />
                  <Label htmlFor="vote-nao">Não</Label>
                </div>
              </RadioGroup>
            </fieldset>
          </div>
        )}

    
        {alreadyFinished && (
          <div className="mt-6 space-y-4">
            <h4 className="font-semibold text-base">Resultados da votação</h4>

   
            {choice && (
              <p className="font-medium mb-4">
                Sua escolha:{" "}
                <span
                  className={
                    choice === "sim" ? "text-green-600" : "text-red-600"
                  }
                >
                  {choice.charAt(0).toUpperCase() + choice.slice(1)}
                </span>
              </p>
            )}
=
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Sim</span>
                <span>{pollSelected!.percentageYes.toFixed(1)}%</span>
              </div>
              <Progress
                value={pollSelected!.percentageYes}
                className="bg-green-200 [&>div]:bg-green-500"
              />
            </div>

            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Não</span>
                <span>{pollSelected!.percentageNo.toFixed(1)}%</span>
              </div>
              <Progress
                value={pollSelected!.percentageNo}
                className="bg-red-200 [&>div]:bg-red-500"
              />
            </div>

            <div className="text-sm text-muted-foreground mt-2">
              <p>
                Total de votos: <strong>{pollSelected?.totalVotes}</strong>
              </p>
              <p>Votos "Sim": {pollSelected?.totalVotesYes}</p>
              <p>Votos "Não": {pollSelected?.totalVotesNo}</p>
              {pollSelected?.finalResult && (
                <p className="mt-2">
                  <strong>Resultado final:</strong> {pollSelected?.finalResult}
                </p>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline">
              {alreadyVoted || alreadyFinished ? "Fechar" : "Cancelar"}
            </Button>
          </DialogClose>
          {!alreadyVoted && !alreadyFinished && (
            <Button type="button" onClick={handleSubmit} disabled={!choice}>
              Confirmar Voto
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
