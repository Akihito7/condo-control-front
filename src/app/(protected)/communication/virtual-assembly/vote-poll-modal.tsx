"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createVoteAssemblyVirtualPoll } from "@/api/create-vote-assembly-virtual-poll";
import { isBefore } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { getOptionsVote } from "@/api/get-options-vote";

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
  const [choice, setChoice] = useState<string>("");
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

  const { data: voteOptions } = useQuery({
    queryKey: ["options", pollSelected],
    queryFn: () => getOptionsVote(pollSelected?.id ?? -1),
    enabled: !!pollSelected?.id,
  });

  useEffect(() => {
    if (alreadyVoted) {
      setChoice(pollSelected?.currentVoteUser?.toString() as any);
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

  // Guardar resultado final (vencedores múltiplos em caso de empate)
  const [finalResults, setFinalResults] = useState<string[]>([]);

  useEffect(() => {
    if (alreadyFinished && pollSelected?.votesInfo) {
      const maxVotes = Math.max(...pollSelected.votesInfo.map((v) => v.total));
      const winners = pollSelected.votesInfo
        .filter((v) => v.total === maxVotes)
        .map((v) => v.optionName);
      setFinalResults(winners);
    }
  }, [alreadyFinished, pollSelected]);

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
      <DialogContent className="sm:max-w-lg rounded-2xl shadow-2xl p-6 bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {pollTitle}
          </DialogTitle>
          {pollSelected?.description && (
            <p className="mt-3 text-sm text-gray-600 italic leading-relaxed">
              {pollSelected.description}
            </p>
          )}
          <DialogDescription className="text-muted-foreground mt-1">
            {alreadyVoted
              ? "✅ Você já votou nesta enquete. Abaixo está sua escolha:"
              : "🗳️ Escolha uma opção abaixo para registrar seu voto."}
          </DialogDescription>
        </DialogHeader>

        {/* --- Tela de Votação --- */}
        {!alreadyFinished && (
          <div className="space-y-4 mt-4">
            <fieldset className="border border-gray-200 rounded-lg p-4">
              <legend className="text-sm font-semibold mb-2 text-gray-800">
                Sua escolha
              </legend>
              <RadioGroup
                value={choice}
                onValueChange={(val) => setChoice(val)}
                disabled={alreadyVoted}
              >
                {voteOptions?.map((option: any) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-2 rounded-md hover:bg-gray-50 p-2 transition"
                  >
                    <RadioGroupItem
                      value={String(option.id)}
                      id={String(option.id)}
                    />
                    <Label htmlFor={String(option.id)} className="cursor-pointer">
                      {option.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </fieldset>
          </div>
        )}

        {/* --- Resultados --- */}
        {alreadyFinished && (
          <div className="mt-6 space-y-4">
            <h4 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
              📊 Resultados da votação
            </h4>

            {choice && (
              <p className="font-medium mb-4">
                Sua escolha:{" "}
                <span className="text-blue-600 font-semibold">
                  {
                    voteOptions?.find(
                      (vote: any) => vote.id === pollSelected?.currentVoteUser
                    )?.name
                  }
                </span>
              </p>
            )}

            <p className="text-sm text-muted-foreground">
              Total de votos: <strong>{pollSelected?.totalVotes}</strong>
            </p>

            <div className="space-y-3">
              {pollSelected?.votesInfo.map((vote) => {
                const percentage =
                  pollSelected.totalVotes > 0
                    ? Math.round((vote.total / pollSelected.totalVotes) * 100)
                    : 0;

                const isWinner = finalResults.includes(vote.optionName);

                return (
                  <div
                    key={vote.optionId}
                    className={`space-y-1 p-2 rounded-lg ${
                      isWinner ? "bg-green-50 border border-green-300" : ""
                    }`}
                  >
                    <div className="flex justify-between text-sm">
                      <span
                        className={
                          isWinner ? "font-semibold text-green-700" : ""
                        }
                      >
                        {vote.optionName}
                      </span>
                      <span
                        className={
                          isWinner ? "font-semibold text-green-700" : ""
                        }
                      >
                        {vote.total} votos ({percentage}%)
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      className={isWinner ? "h-2 bg-green-300" : "h-2"}
                    />
                  </div>
                );
              })}
            </div>

            {finalResults.length > 1 ? (
              <p className="mt-4 text-lg font-semibold text-yellow-600">
                🤝 Empate entre: {finalResults.join(", ")}
              </p>
            ) : (
              finalResults.length === 1 && (
                <p className="mt-4 text-lg font-semibold text-green-600">
                  🏆 Resultado final: {finalResults[0]}
                </p>
              )
            )}
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
