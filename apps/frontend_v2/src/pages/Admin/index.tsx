import { useRecomputeDeckValidity } from "./useRecomputeDeckValidity";

export const AdminPage = () => {
  const { mutate, isPending, data, error } = useRecomputeDeckValidity();

  return (
    <div className="flex-1 text-gray-900">
      <div className="w-full sm:w-3/4 lg:w-1/2 mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold">Admin</h1>

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
