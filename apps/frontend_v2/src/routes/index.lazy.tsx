import { createLazyFileRoute } from "@tanstack/react-router";
import { Input } from "../components/ui/input";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      {/* Hero image container */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source
            srcSet="/assets/hero/Background_Texture_Green.avif"
            type="image/avif"
          />
          <source
            srcSet="/assets/hero/Background_Texture_Green.webp"
            type="image/webp"
          />
          <img
            loading="lazy"
            src="/assets/hero/Background_Texture_Green.jpg"
            alt="Hero Image"
            className="w-full h-full object-cover"
          />
        </picture>
      </div>
      
      {/* Existing content with added z-index */}
      <div className="relative z-1 flex flex-col items-center text-gray-50 text-2xl">
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
    </>
  );
}
