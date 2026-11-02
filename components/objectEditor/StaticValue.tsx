export function StaticValue({ value }: { value: string }) {
  return <input type="text" class="input input-sm w-full" value={value} disabled />;
}
