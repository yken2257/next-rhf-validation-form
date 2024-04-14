import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "SendGridを使ったフォーム送信",
	description:
		"Next.js Server ActionsとSendGridを使ったフォーム送信のサンプルです。",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ja">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
