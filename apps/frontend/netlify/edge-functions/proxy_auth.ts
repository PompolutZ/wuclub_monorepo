export default async (request, context) => {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/__/auth/")) {
    console.log("Pathname", url.pathname);
    console.log("Search", url.search);

    const newUrl = new URL(request.url);
    newUrl.hostname = "yawudb.firebaseapp.com";

    const proxyRequest = new Request(newUrl.toString(), request);
    return fetch(proxyRequest);
  }

  return context.next();
};

export const config = { path: "/__/auth/*" };
