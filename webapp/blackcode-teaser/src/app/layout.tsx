// app/layout.tsx
import "../styles/globals.css";

export const metadata = {
  title: "BlackCode Teaser",
  description: "Page d'accueil immersive BlackCode",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-black text-green-500">
        {children}
      </body>
    </html>
  );
}
