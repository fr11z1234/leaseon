import { Montserrat } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import FacebookPixel from '@/components/Pages/Shared/FacebookPixel';
import "./globals.scss";
import Menu from "@/components/Pages/Shared/Menu";
import Footer from "@/components/Pages/Shared/Footer";
import { Metadata } from 'next';
import Notification from "@/components/Notification";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Leaseon.dk - De Bedste Leasingtilbud På Nettet",
  description: "Udforsk de bedste leasingmuligheder hos Leaseon. Drag fordel af billige leasingaftaler og nem overtagelse af leasing. Start med at køre din drømmebil i dag med vores økonomiske løsninger, der er tilpasset alle budgetter. Find de bedste tilbud og spar på din næste billeasing nu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
      </head>
      <body className={montserrat.className}>
        <Menu />
        {children}
        <Notification />
        <Footer />
      </body>
      <FacebookPixel pixelId="1596331991152744" />
      <GoogleAnalytics gaId="GTM-TQB9MLDD" />
    </html>
  );
}
