import { KvKey } from "./KvKey.tsx";
import { format } from "@std/fmt/duration";

import { keyToJSON } from "@kitsonk/kv-toolbox/json";
import { getJobs, type Job, type JobState } from "$utils/kv_bulk.ts";

function JobState({ state }: { state: JobState }) {
  let label: string = state;
  let color = "gray";
  switch (state) {
    case "aborted":
      label = "Aborted";
      color = "orange";
      break;
    case "done":
      label = "Done";
      color = "green";
      break;
    case "errored":
      label = "Errored";
      color = "red";
      break;
    case "pending":
      label = "Pending";
      color = "yellow";
      break;
    case "processing":
      label = "Processing";
      color = "blue";
      break;
  }
  return (
    <div
      class={`bg-${color}-100 dark:bg-${color}-900 text-${color}-800 dark:text-${color}-300 font-medium w-fit inline-block mx-1 px-2.5 py-0.5 rounded`}
    >
      {label}
    </div>
  );
}

function JobItem(
  {
    job: {
      id,
      state,
      duration,
      count,
      total,
      skipped,
      error,
      name,
      href,
      prefix,
    },
  }: {
    job: Job;
  },
) {
  return (
    <div class="border rounded p-4 mb-4">
      <h1 class="text-lg font-bold mb-4">Job #{id}</h1>
      {name && href
        ? (
          <>
            <h2 class="font-bold my-2">Database</h2>
            <a href={href}>{name}</a>
          </>
        )
        : undefined}
      {prefix.length
        ? (
          <>
            <h2 class="font-bold my-2">Prefix</h2>
            <KvKey value={keyToJSON(prefix)} />
          </>
        )
        : undefined}
      <h2 class="font-bold my-2">State</h2>
      <JobState state={state} />
      {state === "processing" && total
        ? (
          <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 my-2">
            <div
              class="bg-primary-600 h-2.5 rounded-full"
              style={`width: ${Math.floor(count / total * 100)}%`}
            />
          </div>
        )
        : undefined}
      {duration
        ? (
          <>
            <h2 class="font-bold my-2">Duration</h2>
            <div>{format(Math.trunc(duration), { ignoreZero: true })}</div>
          </>
        )
        : undefined}
      {count
        ? (
          <>
            <h2 class="font-bold my-2">Count {skipped ? "(Skipped)" : ""}</h2>
            <div>{count} {skipped ? <span>({skipped})</span> : undefined}</div>
          </>
        )
        : undefined}
      {error && error instanceof Error
        ? (
          <>
            <h2 class="font-bold my-2">Error</h2>
            <div class="text-red-800 dark:text-red-100">{error.message}</div>
          </>
        )
        : undefined}
    </div>
  );
}

export function Jobs() {
  const jobs = getJobs();
  if (jobs.length) {
    return <>{jobs.map((job) => <JobItem job={job} />)}</>;
  } else {
    return (
      <div class="col-span-3 p-8 flex justify-center">
        <div class="italic text-gray(600 dark:400)">no jobs</div>
      </div>
    );
  }
}
