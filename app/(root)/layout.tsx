import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import TopBar from '@/components/TopBar';
import RightSideBar from '@/components/RightSideBar';
import LeftSideBar from '@/components/LeftSideBar';
import ButtomBar from '@/components/ButtomBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Treads',
  description: 'Next Js Threads App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <TopBar />
          <main className="flex flex-row ">
            <LeftSideBar />
            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>
            <RightSideBar />
          </main>
          <ButtomBar />
          <div id="photo-picker-element"></div>
        </body>
      </html>
    </ClerkProvider>
  );
}
