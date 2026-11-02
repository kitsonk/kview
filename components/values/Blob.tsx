import type { KvKeyJSON } from "@deno/kv-utils/json";
import { matches } from "@oak/commons/media_types";
import { format } from "@std/fmt/bytes";
import { keyJsonToPath } from "@/utils/kv_path.ts";
import { BlobEntryJSON } from "@/utils/blobs.ts";

const WEB_IMAGE_MEDIA_TYPES = [
  "image/apng",
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
  "image/bmp",
  "image/x-icon",
];

const WEB_AUDIO_MEDIA_TYPES = [
  "audio/3gpp",
  "audio/3gpp2",
  "audio/3gp2",
  "audio/aac",
  "audio/mpeg",
  "audio/flac",
  "audio/x-flac",
  "audio/mpeg",
  "audio/mp4",
  "audio/ogg",
  "audio/wave",
  "audio/wav",
  "audio/x-wav",
  "audio/x-pn-wav",
  "audio/webm",
];

const WEB_VIDEO_MEDIA_TYPES = [
  "video/3gpp",
  "video/3gpp2",
  "video/3gp2",
  "video/mpeg",
  "video/mp4",
  "video/ogg",
  "video/quicktime",
  "video/webm",
];

const WEB_FRAMED_MEDIA_TYPES = [
  "application/json",
  "application/pdf",
  "text/css",
  "text/html",
  "text/plain",
  "text/xml",
];

function Preview(
  { contentType, currentKey, storeId }: { contentType: string; currentKey: KvKeyJSON; storeId: string },
) {
  if (matches(contentType, WEB_IMAGE_MEDIA_TYPES)) {
    return <img class="max-h-96 mx-auto my-4" src={`/api/store/${storeId}/blob/${keyJsonToPath(currentKey)}`} />;
  }
  if (matches(contentType, WEB_AUDIO_MEDIA_TYPES)) {
    return (
      <div>
        <audio controls src={`/api/store/${storeId}/blob/${keyJsonToPath(currentKey)}`} />
      </div>
    );
  }
  if (matches(contentType, WEB_VIDEO_MEDIA_TYPES)) {
    return (
      <div>
        <video controls src={`/api/store/${storeId}/blob/${keyJsonToPath(currentKey)}`} />
      </div>
    );
  }
  if (matches(contentType, WEB_FRAMED_MEDIA_TYPES)) {
    return (
      <div>
        <iframe class="w-full aspect-video" src={`/api/store/${storeId}/blob/${keyJsonToPath(currentKey)}`} />
      </div>
    );
  }
  return null;
}

export function ValueBlob({ entry, storeId }: { entry: BlobEntryJSON; storeId: string }) {
  let preview;
  let table;
  if (entry.meta.kind === "blob") {
    table = (
      <table class="table w-full">
        <tbody>
          <tr>
            <th>Type:</th>
            <td>{entry.meta.type}</td>
          </tr>
          {entry.meta.encrypted && (
            <tr>
              <th>Encrypted:</th>
              <td>True</td>
            </tr>
          )}
          {entry.meta.size && (
            <tr>
              <th>Size:</th>
              <td>{format(entry.meta.size)}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
    if (!entry.meta.encrypted) {
      preview = <Preview contentType={entry.meta.type} currentKey={entry.key} storeId={storeId} />;
    }
  } else if (entry.meta.kind === "file") {
    table = (
      <table class="table w-full">
        <tbody>
          <tr>
            <th>Type:</th>
            <td>{entry.meta.type}</td>
          </tr>
          <tr>
            <th>Name:</th>
            <td>{entry.meta.name}</td>
          </tr>
          {entry.meta.encrypted && (
            <tr>
              <th>Encrypted:</th>
              <td>True</td>
            </tr>
          )}
          {entry.meta.lastModified && (
            <tr>
              <th>Last Modified:</th>
              <td>{new Date(entry.meta.lastModified).toLocaleString()}</td>
            </tr>
          )}
          {entry.meta.size && (
            <tr>
              <th>Size:</th>
              <td>{format(entry.meta.size)}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
    if (!entry.meta.encrypted) {
      preview = <Preview contentType={entry.meta.type} currentKey={entry.key} storeId={storeId} />;
    }
  } else {
    table = (
      <table class="table w-full">
        <tbody>
          {entry.meta.encrypted && (
            <tr>
              <th>Encrypted:</th>
              <td>True</td>
            </tr>
          )}
          {entry.meta.size && (
            <tr>
              <th>Size:</th>
              <td>{format(entry.meta.size)}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }
  return (
    <div class="bg-base-100 border-base-300 divide-base-300 rounded-field border overflow-x-auto relative">
      {table}
      {preview}
      <div class="dropdown dropdown-bottom dropdown-end absolute top-2 right-2">
        <div tabindex={0} role="button" class="btn btn-ghost btn-circle btn-sm">
          <span class="iconify lucide--more-vertical size-4"></span>
        </div>
        <ul tabindex={-1} class="dropdown-content menu bg-base-200 rounded-box mt-2 w-52 shadow-sm">
          <li>
            <a href={`/api/store/${storeId}/blob/${keyJsonToPath(entry.key)}?download`}>
              <span class="iconify lucide--arrow-down-to-line size-4"></span>Download
            </a>
          </li>
          <li>
            <a
              href={`/api/store/${storeId}/blob/${keyJsonToPath(entry.key)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="iconify lucide--external-link size-4"></span>Open in a new tab
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
