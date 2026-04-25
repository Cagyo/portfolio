import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Archivo, Space_Grotesk } from "next/font/google";
import { cookies } from "next/headers";
import { siteConfig } from "@/app/_config/site-config";
import { JsonLd } from "@/app/_schema/JsonLd";
import { buildPersonSchema } from "@/app/_schema/person";
import { buildWebSiteSchema } from "@/app/_schema/website";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["300", "400", "500", "600", "700", "900"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

export async function generateMetadata() {
  const t = await (await import("next-intl/server")).getTranslations("metadata");
  return {
    metadataBase: new URL(siteConfig.url),
    title: t("title"),
    description: t("description"),
    openGraph: {
      type: "website",
      siteName: siteConfig.author.name,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export const viewport = {
  themeColor: "#F59E0B",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value;
  const t = await (await import("next-intl/server")).getTranslations("metadata");
  const personSchema = buildPersonSchema(t);
  const websiteSchema = buildWebSiteSchema(t);

  return (
    <html
      lang={locale}
      className={`${archivo.variable} ${spaceGrotesk.variable} h-full antialiased`}
      data-theme={theme === "light" ? "light" : undefined}
    >
      <head />
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <JsonLd data={personSchema} />
        <JsonLd data={websiteSchema} />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
