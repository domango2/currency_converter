import { ReactNode } from "react";

interface PageWrapperProps {
  title: string;
  children: ReactNode;
}

export default function PageWrapper({ title, children }: PageWrapperProps) {
  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">{title}</h1>
      {children}
    </div>
  );
}
