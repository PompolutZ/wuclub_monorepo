import Logo from "@icons/underworlds_logo.svg?react";

interface DeckIssuesProps {
  issues: string[];
}

export const DeckIssues = ({ issues }: DeckIssuesProps) => {
  if (issues.length === 0) return null;

  return (
    <section className="my-4 text-accent3-700 text-sm p-4 bg-accent3-100/20 rounded border border-accent3-700 relative">
      <h2 className="absolute -top-3 left-2 bg-accent3-700 text-white px-2 rounded font-bold">
        Deck is not valid!
      </h2>
      <ul>
        {issues.map((issue, i) => (
          <li key={i} className="flex items-center space-x-1">
            <Logo className="fill-current text-accent3-900 text-3xl lg:text-base" />
            <span className="font-semibold">{issue}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
