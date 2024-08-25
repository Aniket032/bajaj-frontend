import Head from "next/head";
import "./globals.css";

export const metadata = {
  title: "21BCI033", // Replace with your actual roll number
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>21BCI0333</title>{" "}
      </Head>
      <body>{children}</body>
    </html>
  );
}
