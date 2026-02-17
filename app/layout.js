import { Manrope } from "next/font/google";
import PlausibleProvider from "next-plausible";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import config from "@/config";
import "./globals.css";
import Script from 'next/script';
import FacebookPixel from "@/components/FacebookPixel";

const manrope = Manrope({
  subsets: ["latin"],
  variable: '--font-manrope',
});

export const viewport = {
  // Will use the primary color of your theme to show a nice theme color in the URL bar of supported browsers
  themeColor: config.colors.main,
  width: "device-width",
  initialScale: 1,
};

// This adds default SEO tags to all pages in our app.
// You can override them in each page passing params to getSOTags() function.
export const metadata = getSEOTags();

export default function RootLayout({ children }) {
  return (
    <html lang="es" data-theme={config.colors.theme} className={`${manrope.variable} font-sans`}>
      {config.domainName && (
        <head>
          <PlausibleProvider domain={config.domainName} />
          <Script
            strategy="afterInteractive"
            src="https://www.googletagmanager.com/gtag/js?id=G-5LN0ZLM77J"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
          >
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-5LN0ZLM77J');
            `}
          </Script>
        </head>
      )}
      <body>
        <FacebookPixel />
        {/* ClientLayout contains all the client wrappers (Crisp chat support, toast messages, tooltips, etc.) */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
