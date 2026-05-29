import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import TalentDiscovery from '@/components/TalentDiscovery';

export const metadata: Metadata = {
  title: '发现你的天赋 | 打包Takeaway',
  description:
    '基于八木仁平《世界一やさしい「才能」の見つけ方》的自助探索工具，通过回答五个问题、从天赋清单选择、询问他人三个步骤，发现你的天赋所在。',
};

export default async function TalentDiscoveryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (
    <main>
      <Nav />
      <TalentDiscovery />
    </main>
  );
}