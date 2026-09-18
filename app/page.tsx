import { BANNERS } from "@/data/banners";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Library } from "@/components/Library";
import { voterId } from "@/lib/request";
import { listPuns, redis, votedBy } from "@/lib/store";

export default async function Home() {
  const [puns, voted] = await Promise.all([listPuns(), voterId().then(votedBy)]);
  const live = !!redis;
  return (
    <>
      <Header canSubmit={live} />
      <main>
        <Library puns={puns} voted={voted} canVote={live} banners={BANNERS} />
      </main>
      <Footer />
    </>
  );
}
