import { Search } from '@/components/Search';
import { fetchAllUsers } from '@/lib/Actions/User';
import { fetchTrendingWords } from '@/lib/Actions/CreateThreads';
import TrendindWord from '@/components/TrendindWord';

const page = async () => {
  type TrendingWord = {
    word: string;
    count: number;
    hashtag: boolean;
    // Add more properties as needed
  };
  const res = await fetchAllUsers();
  const trendingWords = await fetchTrendingWords();
  const trends: TrendingWord[] = JSON.parse(trendingWords);

  return (
    <div className="flex gap-3 flex-col">
      <Search />
      <h1 className="text-[40px] font-semibold text-white">Trending Topics</h1>
      <div className="text-white flex flex-col">
        {trends.slice(0, 5).map((items, i) => (
          <TrendindWord items={items} index={i} key={i} />
        ))}
      </div>
      <div className="flex flex-col gap-1 p-3 ">
        <h1 className="text-white">Show more</h1>
      </div>
    </div>
  );
};

export default page;
