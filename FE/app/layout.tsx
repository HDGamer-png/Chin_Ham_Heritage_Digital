import './globals.css';
import '@/src/shaders/threeui.css';
import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Cormorant_Garamond } from 'next/font/google';
import { AppShell } from '@/components/AppShell';
import { SmoothMotionProvider } from '@/components/SmoothMotionProvider';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '500', '600', '700', '800'],
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Chín Hầm | Di tích lịch sử và bảo tàng số Đồi Thiên Thai Huế',
  description: 'Không gian số hóa 3D Khu Di Tích Lịch Sử Chín Hầm — Đồi Thiên Thai, Huế. Tái hiện dòng thời gian, kiến trúc ngầm và ký ức bất khuất của các chiến sĩ cách mạng.',
  icons: {
    icon: '/Logo CH1.png',
    shortcut: '/Logo CH1.png',
    apple: '/Logo CH1.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${cormorantGaramond.variable}`}
    >
      <body className="bg-[#080808] text-stone-100 antialiased relative min-h-screen overflow-x-hidden selection:bg-red-500/30 selection:text-red-200">
        <SmoothMotionProvider>
          <AppShell>{children}</AppShell>
        </SmoothMotionProvider>
      </body>
    </html>
  );
}
