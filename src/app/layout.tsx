import type { Metadata } from "next";
import { Raleway, Instrument_Sans, Epilogue } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { NextClerkProviderProps } from "@clerk/nextjs/types";
import { Toaster } from "sonner";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Iterative App",
  description: "Show the process not just the result",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const clerkAppearance: NextClerkProviderProps['appearance'] = {
    theme: "simple",
    cssLayerName: "clerk",
    variables: {
      colorMuted: "var(--color-light-gray)",
      colorPrimary: "var(--color-purplish)"
    }
  };
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${raleway.variable} ${epilogue.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col  font-instrument">
        <Toaster position="top-center" richColors />
        <ClerkProvider appearance={clerkAppearance}>
            {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
