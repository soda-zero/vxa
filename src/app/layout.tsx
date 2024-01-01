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
        <div className="bg-red-400/40 p-8 text-2xl font-bold">
          Proyecto muerto porque Instagram bloquea la forma de obtener los datos
          y no pienso hacerlo manualmente. 🚧 🚧 🚧
        </div>
        {children}
        <Squiggly />
      </body>
    </html>
  );
}
