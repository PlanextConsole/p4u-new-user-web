import './globals.css';
import { Inter } from 'next/font/google';
import { CartProvider } from "@/providers/CartContext";
import { AuthProvider } from "@/providers/AuthContext";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'p4u-new-user-web',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}