import { GeistSans } from "geist/font/sans";
import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: `FashionBuddy`,
  description: `Welcome to Fashion Buddy. Recreate your favorite outfit!`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-MFYVD97W0Z" />
      <Script id="google-analytics">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
   
            gtag('config', 'G-MFYVD97W0Z');
          `}
      </Script>
      <body>{children}</body>
    </html>
  );
}
