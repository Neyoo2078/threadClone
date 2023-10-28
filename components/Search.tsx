'use client';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import SearchBar from './SearchBar';
import SearchResultsList from './SearchResultsList';
import { useRouter } from 'next/navigation';

export const Search = ({ value: values }: any) => {
  const [results, setResults] = useState([]);
  const [onFocus, setonFocus] = useState(false);
  const [value, setvalue] = useState(values ? values : '');
  const router = useRouter();
  return (
    <div className="w-[60%] m-auto relative flex flex-col items-center min-w-[200px]">
      <SearchBar
        setResults={setResults}
        setonFocus={setonFocus}
        setvalue={setvalue}
        value={value}
      />
      {results && results.length > 0 && onFocus && (
        <SearchResultsList results={results} value={value} />
      )}
      {results.length === 0 && onFocus && (
        <div
          className={`w-full z-20 absolute ${
            value.length > 2 && results.length === 0
              ? '-bottom-[60px]'
              : '-bottom-[60px]'
          } bg-white flex-col p-3 rounded-[10px] min-h-[50px] mt-[16px] overflow-y-auto shadow-md`}
          onClick={() => {
            router.push(`/explore?query=${value}`);
          }}
        >
          <div className="w-full flex gap-2 items-center justify-start cursor-pointer">
            <FaSearch className="w-[20px] h-[20px]" />
            <h1 className="text-[20px]">{value}</h1>
          </div>
        </div>
      )}
      {value.length === 0 && results.length === 0 && onFocus && (
        <div className="w-full absolute -bottom-[90px] p-6 bg-white flex-col z-20 rounded-[10px] mt-[16px] overflow-y-auto shadow-md">
          <h1>Try searching for people, lists, or keywords</h1>
        </div>
      )}
    </div>
  );
};
