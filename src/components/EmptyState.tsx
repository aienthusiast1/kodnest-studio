interface EmptyStateProps {
  message: string;
  action?: string;
  actionHref?: string;
}

export default function EmptyState({ message, action, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-border bg-card px-4 py-5">
      <p className="text-center text-[0.95rem] text-muted-foreground">{message}</p>
      {action && actionHref && (
        <a
          href={actionHref}
          className="mt-2 inline-block rounded-md bg-primary px-3 py-1 text-[0.85rem] font-medium text-primary-foreground transition-default hover:opacity-90"
        >
          {action}
        </a>
      )}
    </div>
  );
}
