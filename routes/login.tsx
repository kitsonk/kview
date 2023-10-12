import { type Handlers, type PageProps } from "$fresh/server.ts";
import {
  ACCESS_TOKEN,
  keys,
  mergeHeaders,
  SecureCookieMap,
} from "$utils/cookies.ts";

type Data = { error?: true };

export default function Login({ data: { error } }: PageProps<Data>) {
  return (
    <main class="bg-gray-50 dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="/"
          class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            class="w-8 h-8 mr-2"
            src="/logo.svg"
            alt="kview logo"
          />
          kview
        </a>
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Provide an access token
            </h1>
            {error && (
              <h2 class="text-lg font-bold p-2 bg-red(500 dark:800) text-center">
                Previous request was invalid.
              </h2>
            )}
            <form class="space-y-4 md:space-y-6" action="/login" method="post">
              <div>
                <label
                  for="access_token"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Access Token
                </label>
                <input
                  type="access_token"
                  name="access_token"
                  id="access_token"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Deno Deploy Access Token"
                  required
                />
              </div>
              <button
                type="submit"
                class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
              <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Don't have an access token yet?{" "}
                <a
                  href="https://dash.deno.com/account#access-tokens"
                  class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  target="_blank"
                >
                  Add one
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export const handler: Handlers<Data> = {
  GET(_req, { render }) {
    return render({});
  },
  async POST(req, { render }) {
    const formData = await req.formData();
    const accessToken = formData.get(ACCESS_TOKEN);
    if (accessToken && typeof accessToken === "string") {
      const cookies = new SecureCookieMap(req, { keys });
      await cookies.set(ACCESS_TOKEN, accessToken);
      return new Response("", {
        status: 303,
        statusText: "See Other",
        headers: mergeHeaders({ "Location": "/" }, cookies),
      });
    }
    return render({ error: true });
  },
};
