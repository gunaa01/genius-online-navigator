import { cn } from "@/lib/utils"

interface RoleBadgeProps {
  role: string
  className?: string
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const roleStyles = {
    admin: {
      bg: "bg-purple-100 dark:bg-purple-900/50",
      text: "text-purple-800 dark:text-purple-200",
      border: "border-purple-200 dark:border-purple-800"
    },
    owner: {
      bg: "bg-amber-100 dark:bg-amber-900/50",
      text: "text-amber-800 dark:text-amber-200",
      border: "border-amber-200 dark:border-amber-800"
    },
    member: {
      bg: "bg-blue-100 dark:bg-blue-900/50",
      text: "text-blue-800 dark:text-blue-200",
      border: "border-blue-200 dark:border-blue-800"
    },
    developer: {
      bg: "bg-green-100 dark:bg-green-900/50",
      text: "text-green-800 dark:text-green-200",
      border: "border-green-200 dark:border-green-800"
    },
    designer: {
      bg: "bg-pink-100 dark:bg-pink-900/50",
      text: "text-pink-800 dark:text-pink-200",
      border: "border-pink-200 dark:border-pink-800"
    },
    marketing: {
      bg: "bg-indigo-100 dark:bg-indigo-900/50",
      text: "text-indigo-800 dark:text-indigo-200",
      border: "border-indigo-200 dark:border-indigo-800"
    },
  }

  const style = roleStyles[role as keyof typeof roleStyles] || roleStyles.member

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        style.bg,
        style.text,
        style.border,
        className
      )}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  )
}
