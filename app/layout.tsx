import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'MasterPeace AI — AI Companion, Prompt Studio & Mindful Workspace',
  description: 'An all-in-one AI companion, advanced prompt studio, memory vault, and mindful workspace powered by Gemini.',
  openGraph: {
    title: 'MasterPeace AI',
    description: 'An all-in-one AI companion, advanced prompt studio, memory vault, and mindful workspace powered by Gemini.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MasterPeace AI',
    description: 'An all-in-one AI companion, advanced prompt studio, memory vault, and mindful workspace powered by Gemini.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
