import { type Handlers } from "$fresh/server.ts";
import { ACCESS_TOKEN, keys, SecureCookieMap } from "$utils/cookies.ts";

export default function Login() {
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
              Logged out
            </h1>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              You have been logged out of kview
            </p>
            <form action="/login">
              <button
                type="submit"
                class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export const handler: Handlers = {
  async GET(req, { render }) {
    const response = await render();
    const cookies = new SecureCookieMap(req, { keys, response });
    await cookies.delete(ACCESS_TOKEN);
    return response;
  },
};
