import Logo from "@icons/underworlds_logo.svg?react";

export const LazyLoading = () => (
  <div
    className="flex h-screen w-full"
    style={{ width: "100%", height: "100vh", display: "flex" }}
  >
    <div className="m-auto">
      <Logo className="animate-pulse fill-current text-purple-900 text-9xl" />
    </div>
  </div>
);
