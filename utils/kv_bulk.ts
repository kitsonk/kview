import { setAccessToken } from "./dash.ts";
import { toValue } from "$utils/kv.ts";
import { entryToJSON, toKey } from "./kv.ts";
import { type KvEntryJSON } from "./kv_json.ts";
import { getKvPath } from "./kv_state.ts";
import { NdJsonStream } from "./ndjson_stream.ts";

const encoder = new TextEncoder();

export function exportNdJson(
  id: string,
  prefix: Deno.KvKey,
): ReadableStream<Uint8Array> | undefined {
  const info = getKvPath(id);
  if (!info) {
    return undefined;
  }
  const { path, accessToken } = info;
  if (accessToken) {
    setAccessToken(accessToken);
  }
  let kv: Deno.Kv | undefined;
  let cancelled = false;
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      kv = await Deno.openKv(path);
      const iterator = kv.list({ prefix });
      for await (const entry of iterator) {
        if (cancelled) {
          return;
        }
        controller.enqueue(
          encoder.encode(`${JSON.stringify(entryToJSON(entry))}\n`),
        );
      }
      kv.close();
      kv = undefined;
      controller.close();
    },
    cancel(_reason) {
      cancelled = true;
      kv?.close();
      kv = undefined;
    },
  });
}

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
  total: number;
}

export class Job {
  #measure?: PerformanceMeasure;
  #state: JobState = "pending";
  #transformStream = new NdJsonStream<KvEntryJSON>();

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

  get total(): number {
    return this.#transformStream.count;
  }

  get transformStream(): NdJsonStream<KvEntryJSON> {
    return this.#transformStream;
  }

  id: number;
  count = 0;
  databaseId: string;
  href?: string;
  name?: string;
  prefix: Deno.KvKey;
  skipped = 0;
  path?: string;
  accessToken?: string;
  file?: ReadableStream<Uint8Array>;
  // deno-lint-ignore no-explicit-any
  error?: any;

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
      total,
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
      total,
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

export function importNdJson(
  id: string,
  prefix: Deno.KvKey,
  blob: Blob,
  { overwrite, name, href }: {
    overwrite: boolean;
    name: string | null;
    href: string | null;
  },
): Job {
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
  (async () => {
    const stream = blob.stream().pipeThrough(job.transformStream);
    try {
      if (accessToken) {
        setAccessToken(accessToken);
      }
      const kv = await Deno.openKv(path);
      if (job.state === "pending") {
        job.state = "processing";
        for await (const { key, value } of stream) {
          job.count++;
          const entryKey = prefix.length
            ? [...prefix, ...toKey(key)]
            : toKey(key);
          if (!overwrite) {
            const maybeEntry = await kv.get(entryKey);
            if (maybeEntry.versionstamp) {
              job.skipped++;
              continue;
            }
          }
          await kv.set(entryKey, toValue(value));
          if (job.state !== "processing") {
            break;
          }
        }
      }
      kv.close();
      if (job.state === "processing") {
        job.state = "done";
      }
    } catch (err) {
      job.state = "errored";
      job.error = err;
      console.log(err);
    }
  })();
  return job;
}
