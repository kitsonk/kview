import { importEntries } from "@deno/kv-utils/import-export";

import { setAccessToken } from "./dash.ts";
import { getKvPath } from "./kv_state.ts";
import { getLogger } from "./logs.ts";

export type JobState =
  | "pending"
  | "processing"
  | "aborted"
  | "done"
  | "errored";

interface JobJSON {
  count: number;
  duration?: number;
  error?: string;
  href?: string;
  id: number;
  name?: string;
  skipped: number;
  state: JobState;
}

const logger = getLogger(["kview", "utils", "kv_bulk"]);

export class Job {
  #measure?: PerformanceMeasure;
  #state: JobState = "pending";

  get duration(): number | undefined {
    return this.#measure?.duration;
  }

  set state(value: JobState) {
    if (this.#state === "pending" && value !== "pending") {
      performance.mark(`job_${this.id}`);
    }
    if (
      !(this.#measure) &&
      (value === "aborted" || value === "done" ||
        value === "errored")
    ) {
      this.#measure = performance.measure(
        `job ${this.id} duration`,
        { start: `job_${this.id}` },
      );
    }
    this.#state = value;
  }

  get state(): JobState {
    return this.#state;
  }

  accessToken?: string;
  count = 0;
  databaseId: string;
  // deno-lint-ignore no-explicit-any
  error?: any;
  errors = 0;
  href?: string;
  id: number;
  name?: string;
  path?: string;
  prefix: Deno.KvKey;
  skipped = 0;

  constructor(
    databaseId: string,
    prefix: Deno.KvKey,
    name: string | null,
    href: string | null,
  ) {
    this.id = ++jobUid;
    this.databaseId = databaseId;
    this.prefix = prefix;
    if (name) {
      this.name = name;
    }
    if (href) {
      this.href = href;
    }
  }

  toJSON(): JobJSON {
    const {
      id,
      name,
      href,
      count,
      skipped,
      state,
      duration,
      error,
    } = this;
    const json: JobJSON = {
      id,
      name,
      href,
      count,
      skipped,
      state,
      duration,
    };
    if (error) {
      json.error = String(error);
    }
    return json;
  }
}

let jobUid = 0;

const jobs = new Map<number, Job>();

export function abort(id: number): boolean {
  const job = jobs.get(id);
  if (job && (job.state === "processing" || job.state === "pending")) {
    job.state = "aborted";
    return true;
  }
  return false;
}

export function getJob(id: number): Job | undefined {
  return jobs.get(id);
}

export function getJobs(): Job[] {
  return [...jobs.values()];
}

export async function importNdJson(
  id: string,
  prefix: Deno.KvKey,
  data: Uint8Array,
  { overwrite, name, href }: {
    overwrite: boolean;
    name: string | null;
    href: string | null;
  },
): Promise<Job> {
  logger.debug("Start Importing: {id}", { id });
  const job = new Job(id, prefix, name, href);
  jobs.set(job.id, job);
  const info = getKvPath(id);
  if (!info) {
    job.error = new Error("Unable to resolve DB ID.");
    return job;
  }
  const { path, accessToken } = info;
  job.path = path;
  job.accessToken = accessToken;

  if (accessToken) {
    setAccessToken(accessToken);
  }
  const kv = await Deno.openKv(path);
  importEntries(kv, data, {
    prefix,
    overwrite,
    onProgress(count, skipped, errors) {
      if (job.state === "pending") {
        job.state = "processing";
      }
      job.count = count;
      job.skipped = skipped;
      job.errors = errors;
    },
  }).then(({ count, skipped, errors, aborted }) => {
    job.state = aborted ? "aborted" : "done";
    job.count = count;
    job.skipped = skipped;
    job.errors = errors;
  }).catch((error) => {
    job.state = "errored";
    job.error = error;
  });
  return job;
}
