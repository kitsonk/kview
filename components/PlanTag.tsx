const styles: Record<string, string> = {
  pro:
    "rounded-full px-3 py-1 bg-primary-300 dark:bg-primary-700 text-primary-900 dark:text-white",
  builder:
    "rounded-full px-3 py-1 bg-primary-300 dark:bg-primary-700 text-primary-900 dark:text-white",
};

export function PlanTag({ plan }: { plan: string }) {
  return (
    <div
      class={styles[plan] ??
        "rounded-full px-3 py-1 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white"}
    >
      {plan}
    </div>
  );
}
