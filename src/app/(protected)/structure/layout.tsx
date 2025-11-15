import { Suspense } from "react";

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div>Carregando...</div>}>{children}</Suspense>;
}
