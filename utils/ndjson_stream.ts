import { concat } from "$std/bytes/concat.ts";

const LF = 0x0a;
const CR = 0x0d;
const decoder = new TextDecoder();

function stripEol(u8: Uint8Array): Uint8Array {
  const length = u8.byteLength;
  if (u8[length - 1] === LF) {
    let drop = 1;
    if (length > 1 && u8[length - 2] === CR) {
      drop = 2;
    }
    return u8.subarray(0, length - drop);
  }
  return u8;
}

/** A transform stream that takes a byte stream and outputs chunks which
 * represent the individual new line delimitated JSON records. */
// deno-lint-ignore no-explicit-any
export class NdJsonStream<T = any> extends TransformStream<Uint8Array, T> {
  #buffer = new Uint8Array(0);
  #count = 0;
  #pos = 0;

  get count(): number {
    return this.#count;
  }

  constructor() {
    super({
      transform: (chunk, controller) => {
        this.#transform(chunk, controller);
      },
      flush: (controller) => {
        const slice = stripEol(this.#buffer.subarray(this.#pos));
        if (slice.length) {
          try {
            const record = JSON.parse(decoder.decode(slice));
            controller.enqueue(record);
          } catch (err) {
            controller.error(err);
          }
        }
      },
    });
  }

  #readRecord(): Uint8Array | null {
    let slice: Uint8Array | null = null;

    const i = this.#buffer.subarray(this.#pos).indexOf(LF);
    if (i >= 0) {
      slice = this.#buffer.subarray(this.#pos, this.#pos + i + 1);
      this.#pos += i + 1;
      return stripEol(slice);
    }
    return null;
  }

  *#records(): IterableIterator<T | null> {
    while (true) {
      const record = this.#readRecord();
      if (!record) {
        this.#truncate();
        return null;
      }
      this.#count++;
      yield JSON.parse(decoder.decode(record));
    }
  }

  #transform(
    chunk: Uint8Array,
    controller: TransformStreamDefaultController<T>,
  ) {
    this.#buffer = concat([this.#buffer, chunk]);
    try {
      for (const record of this.#records()) {
        if (!record) {
          break;
        }
        controller.enqueue(record);
      }
    } catch (err) {
      controller.error(err);
    }
  }

  #truncate() {
    this.#buffer = this.#buffer.slice(this.#pos);
    this.#pos = 0;
  }
}
