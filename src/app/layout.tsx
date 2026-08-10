import type { Metadata } from "next";
import { Quicksand, Stack_Sans_Notch, Nunito, Basic, Stack_Sans_Headline } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { NextClerkProviderProps } from "@clerk/nextjs/types";
import { Toaster } from "sonner";

const main = Stack_Sans_Headline({
  variable: "--font-stack-sans-headline",
  weight: "variable",
  subsets: ["latin"],
});

const secondary = Quicksand({
  variable: "--font-quicksand",
  // weight: "400",
  subsets: ["latin"],
});

// const epilogue = Epilogue({
//   variable: "--font-epilogue",
//   subsets: ["latin"],
// });

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
      colorPrimary: "var(--main)"
    }
  };
  return (
    <html
      lang="en"
      className={`${main.variable} ${secondary.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Toaster position="top-center" richColors />
        <ClerkProvider appearance={clerkAppearance}>
            {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
