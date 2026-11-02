import { dismissNotification, notifications } from "@/utils/notifications.ts";

export default function NotificationCenter() {
  return (
    <div class="toast toast-bottom toast-end z-50">
      {notifications.value.map((n) => (
        <div
          key={n.id}
          class={`alert alert-${n.kind} cursor-pointer`}
          onClick={() => dismissNotification(n.id)}
          role="status"
        >
          <span>{n.message}</span>
        </div>
      ))}
    </div>
  );
}
