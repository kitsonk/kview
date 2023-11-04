export interface BreadcrumbItem {
  href: string | undefined;
  text: string;
}

export function Breadcrumbs(
  { breadcrumbs }: { breadcrumbs?: BreadcrumbItem[] },
) {
  return (
    <div>
      {breadcrumbs?.map(({ href, text }, i) => (
        <a
          href={href}
          class="font-semibold text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
        >
          {text}
          {i !== breadcrumbs.length - 1
            ? <span class="text-gray-300 dark:text-gray-700 px-2">/</span>
            : undefined}
        </a>
      ))}
    </div>
  );
}
