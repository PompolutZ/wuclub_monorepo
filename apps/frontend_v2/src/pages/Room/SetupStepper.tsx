import { Check } from "lucide-react";
import { SETUP_STEPS, stepIndex, type SetupStepId } from "./setupSteps";

type SetupStepperProps = {
  current: SetupStepId;
};

const CIRCLE_SIZE = 32;

export const SetupStepper = ({ current }: SetupStepperProps) => {
  const currentIdx = stepIndex(current);

  return (
    <ol className="flex w-full">
      {SETUP_STEPS.map((step, idx) => {
        const isDone = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const isFirst = idx === 0;
        const connectorActive = idx <= currentIdx;
        return (
          <li
            key={step.id}
            className="relative flex-1 flex flex-col items-center"
          >
            {!isFirst && (
              <div
                className={`absolute right-1/2 h-0.5 w-full ${
                  connectorActive ? "bg-purple-500" : "bg-gray-300"
                }`}
                style={{ top: CIRCLE_SIZE / 2 - 1 }}
              />
            )}
            <StepMarker index={idx + 1} isDone={isDone} isCurrent={isCurrent} />
            <span
              className={`mt-2 text-xs text-center ${
                isCurrent
                  ? "text-purple-700 font-semibold"
                  : isDone
                    ? "text-gray-700"
                    : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

const StepMarker = ({
  index,
  isDone,
  isCurrent,
}: {
  index: number;
  isDone: boolean;
  isCurrent: boolean;
}) => {
  const style = isDone
    ? "bg-purple-500 text-white"
    : isCurrent
      ? "bg-white text-purple-700 ring-2 ring-purple-500"
      : "bg-gray-200 text-gray-500";

  return (
    <div
      className={`relative z-10 flex items-center justify-center rounded-full text-sm font-semibold ${style}`}
      style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
    >
      {isDone ? <Check className="w-4 h-4" /> : index}
    </div>
  );
};
