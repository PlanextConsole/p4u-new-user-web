import './globals.css';
import { Inter } from 'next/font/google';
import { CartProvider } from "@/providers/CartContext";
import { AuthProvider } from "@/providers/AuthContext";
import { AppLoadingProvider } from "@/providers/AppLoadingProvider";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'p4u-new-user-web',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppLoadingProvider>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </AppLoadingProvider>
      </body>
    </html>
  );
}