export default async (request, context) => {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/__/auth/")) {
    console.log("Incoming request", request);
    console.log(request.url);
    console.log(request.headers);
    console.log(request.method);
    console.log(request.body);

    const newUrl = new URL(request.url);
    newUrl.hostname = "yawudb.firebaseapp.com";

    const proxyRequest = new Request(newUrl.toString(), request);
    console.log("Proxy request", proxyRequest);
    console.log(proxyRequest.url);
    console.log(proxyRequest.headers);
    console.log(proxyRequest.method);
    console.log(proxyRequest.body);

    return fetch(proxyRequest);
  }

  return context.next();
};

export const config = { path: "/__/auth/*" };
