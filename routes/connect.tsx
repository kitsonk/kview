import { define } from "@/utils/fresh.ts";

export default define.page(function Connect(_ctx) {
  return (
    <div class="grid grid-cols-12 overflow-auto sm:h-screen">
      <div class="relative hidden bg-primary-100 lg:col-span-7 lg:block xl:col-span-8 2xl:col-span-9 dark:bg-primary-950">
        <div class="absolute inset-0 flex items-center justify-center">
          <img class="object-cover" alt="Auth Image" src="/images/auth-hero.png" />
        </div>
      </div>
      <div class="col-span-12 lg:col-span-5 xl:col-span-4 2xl:col-span-3">
        <div class="flex flex-col items-stretch p-6 md:p-8 lg:p-16">
          <a href="/" class="hover:underline">
            <div class="flex gap-3">
              <img alt="Logo" class="h-5.5" src="/logo.svg" />kview
            </div>
          </a>
          <h3 class="mt-8 text-center text-xl font-semibold md:mt-12 lg:mt-24">Connect</h3>
          <h3 class="text-base-content/70 mt-2 text-center text-sm">
            Provide your registered GitHub username and a personal access token to connect your account and view stores
            on Deno Deploy.
          </h3>
          <div class="mt-6 md:mt-10">
            <fieldset class="fieldset">
              <legend class="fieldset-legend">GitHub Username</legend>
              <label class="input w-full focus:outline-0">
                <span class="iconify lucide--github text-base-content/80 size-5"></span>
                <input
                  class="grow focus:outline-0"
                  placeholder="GitHub Username"
                  type="text"
                />
              </label>
            </fieldset>
            <fieldset class="fieldset" x-data="{ show: false }">
              <legend class="fieldset-legend">Access Token</legend>
              <label class="input w-full focus:outline-0">
                <span class="iconify lucide--key-round text-base-content/80 size-5"></span>
                <input
                  class="grow focus:outline-0"
                  placeholder="Access Token"
                  id="password"
                />
              </label>
            </fieldset>
            <div class="text-end">
              <a
                class="label-text text-base-content/80 text-xs hover:underline"
                href="./auth-forgot-password.html"
              >
                Don't have an access token?
              </a>
            </div>
            <a
              class="btn btn-primary btn-wide mt-4 max-w-full gap-3 md:mt-6"
              href="./dashboards-ecommerce.html"
            >
              <span class="iconify lucide--log-in size-4"></span>
              Connect
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});
