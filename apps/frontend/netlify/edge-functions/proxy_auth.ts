export default async (request, context) => {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/__/auth/")) {
    const response = await fetch(
      `https://yawudb.firebaseapp.com${url.pathname}${url.search}`,
      request,
    );

    return response;
  }

  return context.next();
};

export const config = { path: "/__/auth/*" };
