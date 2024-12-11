import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export function Section({ children, className = "" }: SectionProps) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">{children}</div>
    </section>
  );
}
