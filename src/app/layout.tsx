import Squiggly from "@/components/ui/squiggly";
import "./globals.css";
import type { Metadata } from "next";
import { inter } from "@/libs/fonts";

export const metadata: Metadata = {
  title: "Vegano por Accidente Arg",
  description:
    "Buscador para los productos de la página de Instagram @veganoporaccideten.arg",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR">
      <body className={inter.className}>
        {children}
        <Squiggly />
      </body>
    </html>
  );
}
