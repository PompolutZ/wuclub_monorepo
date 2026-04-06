import type { Set as WuSet } from "@fxdxpz/wudb";

interface NemesisSetsInfoProps {
  selectedSets: WuSet[];
}

function NemesisSetsInfo({ selectedSets }: NemesisSetsInfoProps) {
  const tooManySets = selectedSets.length > 2;

  const issues: string[] = [];
  if (tooManySets) issues.push("max 2 sets allowed");

  const hasIssues = issues.length > 0;

  return (
    <div className="mb-4 text-sm">
      <span
        className={`font-semibold ${hasIssues ? "text-red-600" : "text-gray-500"}`}
      >
        {selectedSets.length}/2 sets selected
      </span>
      {hasIssues && (
        <ul className="mt-1 list-disc list-inside text-red-600">
          {issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NemesisSetsInfo;
