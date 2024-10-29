import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="grid place-content-center">
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
      </div>
    </div>
  );
}
