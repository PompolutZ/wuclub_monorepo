import { createLazyFileRoute } from "@tanstack/react-router";
import { Input } from "../components/ui/input";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-col items-center text-gray-50 text-2xl">
      <div>
        <div>
          🚧 Here we are building new version of Wunderworlds club for
          Embergard. 🚧
        </div>
        <div>
          If you are looking for previous version, it is available{" "}
          <a className="underline text-xl" href="https://old.wunderworlds.club">
            here
          </a>
        </div>
        <div className="mt-20 flex flex-col space-y-10 items-center">
          <h1 className="text-2xl">
            Deck building website for Warhammer Underworlds
          </h1>
          <Input
            className="bg-white"
            placeholder="Type something, e.g. card name"
          />
        </div>
      </div>
    </div>
  );
}
