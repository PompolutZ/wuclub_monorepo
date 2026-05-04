import { useDeckValidityStats } from "./useDeckValidityStats";
import { useRecomputeDeckValidity } from "./useRecomputeDeckValidity";

export const AdminPage = () => {
  const { mutate, isPending, data, error } = useRecomputeDeckValidity();

  return (
    <div className="flex-1 text-gray-900">
      <div className="w-full sm:w-3/4 lg:w-1/2 mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold">Admin</h1>

        <DeckValidityStats />

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Jobs</h2>
          <p className="text-sm text-gray-600">
            Re-evaluate every deck and persist its play-format validity.
          </p>
          <button
            className="cursor-pointer px-4 py-2 font-bold bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-400"
            onClick={() => mutate()}
            disabled={isPending}
          >
            {isPending ? "Running…" : "Recompute deck validity"}
          </button>
          {data && (
            <p className="text-sm text-gray-700">
              Status: <code>{JSON.stringify(data)}</code>
            </p>
          )}
          {error && (
            <p className="text-sm text-red-600">
              {(error as Error).message ?? "Failed"}
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminPage;

const DeckValidityStats = () => {
  const { data, isLoading, error, refetch, isFetching } =
    useDeckValidityStats();

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Deck validity status</h2>
        <button
          className="cursor-pointer px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <p className="text-sm text-gray-600">2nd-edition decks only.</p>

      {isLoading && <p className="text-sm text-gray-500">Loading…</p>}
      {error && (
        <p className="text-sm text-red-600">
          {(error as Error).message ?? "Failed to load"}
        </p>
      )}
      {data && (
        <dl className="grid grid-cols-2 gap-y-1 text-sm">
          <StatRow label="Total" value={data.total} />
          <StatRow label="Public" value={data.public} />
          <StatRow label="Missing validity" value={data.missingValidity} />
          <StatRow label="Valid for Nemesis" value={data.nemesisValid} />
          <StatRow label="Listed publicly" value={data.publicListable} />
        </dl>
      )}
    </section>
  );
};

const StatRow = ({ label, value }: { label: string; value: number }) => (
  <>
    <dt className="text-gray-700">{label}</dt>
    <dd className="text-right font-mono">{value}</dd>
  </>
);
