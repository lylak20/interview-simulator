"use client";

import { ChoiceOption } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  choices: ChoiceOption[];
  selected: ChoiceOption | null;
  onSelect: (choice: ChoiceOption) => void;
  showRationale?: boolean;
}

export default function MultipleChoicePanel({
  choices,
  selected,
  onSelect,
  showRationale = false,
}: Props) {
  return (
    <div className="space-y-3">
      {choices.map((choice) => {
        const isSelected = selected?.id === choice.id;
        const isCorrect = choice.id === "A";
        const isWrong = isSelected && !isCorrect;

        let stateClass = "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50";
        if (!showRationale && isSelected) {
          stateClass = "border-brand bg-brand/5 shadow-sm";
        } else if (showRationale && isCorrect) {
          stateClass = "border-green-400 bg-green-50";
        } else if (showRationale && isWrong) {
          stateClass = "border-red-400 bg-red-50";
        } else if (showRationale && isSelected && isCorrect) {
          stateClass = "border-green-400 bg-green-50";
        }

        return (
          <button
            key={choice.id}
            onClick={() => !showRationale && onSelect(choice)}
            disabled={showRationale}
            className={cn(
              "w-full text-left p-4 rounded-xl border-2 transition-all duration-150 cursor-pointer disabled:cursor-default",
              stateClass
            )}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mt-0.5",
                  !showRationale && isSelected
                    ? "bg-brand text-white"
                    : showRationale && isCorrect
                    ? "bg-green-500 text-white"
                    : showRationale && isWrong
                    ? "bg-red-500 text-white"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {choice.id}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 leading-relaxed">{choice.label}</p>
                {showRationale && choice.rationale && (
                  <p
                    className={cn(
                      "mt-2 text-xs leading-relaxed font-medium",
                      isCorrect ? "text-green-700" : isWrong ? "text-red-700" : "text-slate-500"
                    )}
                  >
                    {isCorrect ? "✓ " : isWrong ? "✗ " : ""}
                    {choice.rationale}
                  </p>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
