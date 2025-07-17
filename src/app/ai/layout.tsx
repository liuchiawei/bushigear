import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AIアシスタント',
  description: 'ブシギアのAIアシスタントです。',
};

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      {children}
    </main>
  );
}