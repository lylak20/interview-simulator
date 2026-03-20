import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "purple" | "blue" | "amber" | "green" | "red" | "slate";
  className?: string;
}

export default function Badge({ children, variant = "slate", className }: BadgeProps) {
  const variants = {
    purple: "bg-purple-100 text-purple-700 border border-purple-200",
    blue: "bg-blue-100 text-blue-700 border border-blue-200",
    amber: "bg-amber-100 text-amber-700 border border-amber-200",
    green: "bg-green-100 text-green-700 border border-green-200",
    red: "bg-red-100 text-red-700 border border-red-200",
    slate: "bg-slate-100 text-slate-600 border border-slate-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
