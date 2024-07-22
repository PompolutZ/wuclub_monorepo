export default async (request, context) => {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/__/auth/")) {
    console.log("Incoming request", JSON.stringify(request, null, 2));

    const newUrl = new URL(request.url);
    newUrl.hostname = "yawudb.firebaseapp.com";

    const proxyRequest = new Request(newUrl.toString(), request);
    console.log("Proxy request", JSON.stringify(proxyRequest, null, 2));

    return fetch(proxyRequest);
  }

  return context.next();
};

export const config = { path: "/__/auth/*" };
