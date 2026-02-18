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
            src="https://www.googletagmanager.com/gtag/js?id=G-NLE176KSH8"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
          >
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-NLE176KSH8');
              gtag('config', 'G-5LN0ZLM77J');
            `}
          </Script>
          <Script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id="0c78c6a2-9b88-4d62-8337-d7e6f4bfb386"
            strategy="afterInteractive"
          />
          <Script
            id="microsoft-clarity"
            strategy="afterInteractive"
          >
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "vjfh1hviur");
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
