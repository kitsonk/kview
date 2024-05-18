import { type BlobMeta } from "@kitsonk/kv-toolbox/blob";
import { type KvKeyJSON } from "@kitsonk/kv-toolbox/json";
import { matches } from "@oak/commons/media_types";
import { format } from "@std/fmt/bytes";
import { keyJsonToPath } from "$utils/kv.ts";

import ArrowUpRightIcon from "./icons/ArrowUpRight.tsx";
import DownloadIcon from "./icons/Download.tsx";

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
  { contentType, databaseId, currentKey }: {
    contentType: string;
    databaseId: string;
    currentKey: KvKeyJSON;
  },
) {
  if (matches(contentType, WEB_IMAGE_MEDIA_TYPES)) {
    return (
      <div class="p-2">
        <img
          class="border rounded-lg p-2 mx-auto"
          src={`/api/blob/serve/${databaseId}/${keyJsonToPath(currentKey)}`}
        />
      </div>
    );
  }
  if (matches(contentType, WEB_AUDIO_MEDIA_TYPES)) {
    return (
      <div class="p-2 flex justify-center">
        <audio
          controls
          src={`/api/blob/serve/${databaseId}/${keyJsonToPath(currentKey)}`}
        />
      </div>
    );
  }
  if (matches(contentType, WEB_VIDEO_MEDIA_TYPES)) {
    return (
      <div class="p-2 flex justify-center">
        <video
          controls
          class="w-full lg:w-4/5 rounded-lg"
          src={`/api/blob/serve/${databaseId}/${keyJsonToPath(currentKey)}`}
        />
      </div>
    );
  }
  if (matches(contentType, WEB_FRAMED_MEDIA_TYPES)) {
    return (
      <div class="p-2 flex justify-center">
        <iframe
          class="border rounded-lg p-2 w-full h-60 lg:h-96"
          src={`/api/blob/serve/${databaseId}/${keyJsonToPath(currentKey)}`}
        />
      </div>
    );
  }
  return null;
}

export function BlobViewer(
  { databaseId, currentKey, meta }: {
    databaseId: string;
    currentKey: KvKeyJSON;
    meta: BlobMeta;
  },
) {
  let table;
  let preview;
  switch (meta.kind) {
    case "blob":
      if (!meta.encrypted) {
        preview = (
          <Preview
            contentType={meta.type}
            databaseId={databaseId}
            currentKey={currentKey}
          />
        );
      }
      table = (
        <table class="w-full m-2">
          <tbody>
            <tr>
              <td>Type:</td>
              <td>
                <code>{meta.type}</code>
              </td>
            </tr>
            {meta.encrypted
              ? (
                <tr>
                  <td>Encrypted:</td>
                  <td>True</td>
                </tr>
              )
              : undefined}
            {meta.size
              ? (
                <tr>
                  <td>Size:</td>
                  <td>{format(meta.size)}</td>
                </tr>
              )
              : undefined}
          </tbody>
        </table>
      );
      break;
    case "buffer":
      table = (
        <table class="w-full m-2">
          <tbody>
            {meta.encrypted
              ? (
                <tr>
                  <td>Encrypted:</td>
                  <td>True</td>
                </tr>
              )
              : undefined}
            {meta.size
              ? (
                <tr>
                  <td>Size:</td>
                  <td>{format(meta.size)}</td>
                </tr>
              )
              : undefined}
          </tbody>
        </table>
      );
      break;
    case "file":
      if (!meta.encrypted) {
        preview = (
          <Preview
            contentType={meta.type}
            databaseId={databaseId}
            currentKey={currentKey}
          />
        );
      }
      table = (
        <table class="w-full m-2">
          <tbody>
            <tr>
              <td>Type:</td>
              <td>
                <code>{meta.type}</code>
              </td>
            </tr>
            <tr>
              <td>Filename:</td>
              <td>
                <code>{meta.name}</code>
              </td>
            </tr>
            {meta.encrypted
              ? (
                <tr>
                  <td>Encrypted:</td>
                  <td>True</td>
                </tr>
              )
              : undefined}
            {meta.lastModified
              ? (
                <tr>
                  <td>Last modified:</td>
                  <td>{new Date(meta.lastModified).toISOString()}</td>
                </tr>
              )
              : undefined}
            {meta.size
              ? (
                <tr>
                  <td>Size:</td>
                  <td>{format(meta.size)}</td>
                </tr>
              )
              : undefined}
          </tbody>
        </table>
      );
  }

  return (
    <>
      <div class="relative">
        {table}
        <div class="absolute top-0 right-2 flex">
          <a
            href={`/api/blob/download/${databaseId}/${
              keyJsonToPath(currentKey)
            }`}
            class="hover:text-primary-600 dark:hover:text-primary-400"
            download
            aria-label="Download"
          >
            <DownloadIcon />
          </a>
          <a
            href={`/api/blob/serve/${databaseId}/${keyJsonToPath(currentKey)}`}
            class="hover:text-primary-600 dark:hover:text-primary-400"
            target="_blank"
            aria-label="Open in new tab"
          >
            <ArrowUpRightIcon />
          </a>
        </div>
      </div>
      {preview}
    </>
  );
}
