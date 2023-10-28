'use client';
import SearchResult from './SearchResult';
import { useRouter } from 'next/navigation';

const SearchResultsList = ({ results, value }: any) => {
  const router = useRouter();

  console.log({
    DD: value.length > 2 && results.length,
    ll: results.length <= 1,
    pp: value.length > 2,
  });
  return (
    <div
      className={`w-full z-20 absolute ${
        value.length > 2 && results.length > 1
          ? '-bottom-[230px]'
          : '-bottom-[150px]'
      } bg-white flex-col rounded-[10px] mt-[16px] overflow-y-auto shadow-md`}
    >
      {value.length > 2 && (
        <div
          onClick={(e) => {
            e.stopPropagation();

            router.push(`/explore?query=${value}`);
          }}
          className="cursor-pointer"
        >
          <p className="text-black  p-3">search for "{value}"</p>
          <hr className="my-3" />
        </div>
      )}
      {results?.map((results: any, id: string) => {
        return <SearchResult result={results} key={id} />;
      })}
    </div>
  );
};
export default SearchResultsList;
