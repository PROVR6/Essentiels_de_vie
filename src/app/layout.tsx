import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Essentiels de Vie", description: "Lieux et bons plans 100% visuels — Manger, Se loger, Se former, Sport, Sortir", };
export default function RootLayout({ children }: { children: React.ReactNode }) { return (<html lang="fr"><body>{children}</body></html>); }
