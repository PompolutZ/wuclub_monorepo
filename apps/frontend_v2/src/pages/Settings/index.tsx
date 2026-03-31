import { offlineDB } from "@services/db";
import { queryClient } from "@services/queryClient";

function Settings() {
  const handleClearData = async () => {
    if (
      !window.confirm(
        "This will remove all cached data, your in-progress deck draft, and anonymous decks stored on this device. Continue?"
      )
    ) {
      return;
    }

    localStorage.clear();
    await offlineDB.anonDecks.clear();
    queryClient.clear();
    window.location.reload();
  };

  return (
    <div className="flex-1 text-gray-900">
      <div className="w-full sm:w-2/4 lg:w-1/4 mx-auto p-4 space-y-4">
        <h1 className="text-xl">Settings</h1>
        <section className="space-y-2">
          <h2 className="font-semibold">Danger Zone</h2>
          <p className="text-sm text-gray-600">
            If you're experiencing errors (especially when creating decks), clearing local data often fixes it. This removes cached data, any in-progress deck draft, and decks saved locally for anonymous use.
          </p>
          <button
            className="w-full cursor-pointer px-4 py-2 font-bold bg-red-600 hover:bg-red-700 text-white"
            onClick={handleClearData}
          >
            Clear All Local Data
          </button>
        </section>
      </div>
    </div>
  );
}

export default Settings;
