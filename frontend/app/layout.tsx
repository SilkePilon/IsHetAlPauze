import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/AuthContext";
import NavigationButtons from "@/components/NavigationButtons";
import { Toaster } from "@/components/ui/toaster";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "School Break Timer",
  description: "A countdown timer for school breaks with teacher roster",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <NavigationButtons />
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
