export type Progress = {
  chunkSize: number;
  total: number;
} | {
  finished: true;
  total: number;
};

type ProgressCallback = (progress: Progress) => void;

export class ProgressStream extends TransformStream<Uint8Array, Uint8Array> {
  #total = 0;

  constructor(callback?: ProgressCallback) {
    super({
      transform: (chunk, controller) => {
        this.#total += chunk.byteLength;
        callback?.({ chunkSize: chunk.byteLength, total: this.#total });
        controller.enqueue(chunk);
      },
      flush: () => {
        callback?.({ finished: true, total: this.#total });
      },
    });
  }
}
