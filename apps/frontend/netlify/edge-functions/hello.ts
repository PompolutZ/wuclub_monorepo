export default () => new Response("Hello, World!", { status: 200 });

export const config = { path: "/__/auth/*" };
