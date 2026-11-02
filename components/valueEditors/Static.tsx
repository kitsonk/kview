export function StaticValueEditor({ value }: { value: string }) {
  return (
    <>
      <label class="input w-full">
        <span class="iconify lucide--circle-slash h-[1em] opacity-50"></span>
        <input
          type="text"
          value={value}
          disabled
        />
      </label>
    </>
  );
}
