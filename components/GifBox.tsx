import GridDemo from './GifDemo';
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import { useState, useEffect } from 'react';
import React, { ChangeEvent } from 'react';
import { GiphyFetch } from '@giphy/js-fetch-api';

const GifBox = ({ closeModal, setimageMessage }: any) => {
  const [Search, setSearch] = useState(false);
  const [SearchQuery, setSearchQuery] = useState('funny');
  const [datas, setdatas] = useState<any>(null);
  const [fetching, setfetching] = useState<any>(null);

  const giphyFetch = new GiphyFetch('aA2x9oViLjBhMAuNKWRKFpgj6fz6yikG');

  // handle SearchInput

  const HandleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const gifGif = async (query: string = 'dogs') => {
    setfetching(true);
    const { data: gifs } = await giphyFetch.search(query, {
      sort: 'relevant',
      lang: 'es',
      limit: 300,
      type: 'gifs',
    });
    setdatas(gifs);
    setfetching(false);
  };

  useEffect(() => {
    gifGif(SearchQuery.length === 0 ? 'kiss' : SearchQuery);
  }, [SearchQuery]);

  return (
    <div className="absolute  w-[600px] bg-white top-[50px] left-[460px] h-[500px] overflow-x-hidden overflow-y-scroll">
      <div className="w-full relative">
        <div className="w-full sticky  top-0  p-2 flex items-center justify-between bg-[#848181e0]">
          <AiOutlineClose
            className="text-black w-[20px] h-[20px]"
            onClick={() => {
              closeModal();
            }}
          />{' '}
          <div className="w-[464px] flex  p-2 justify-between items-center h-[40px] bg-white rounded-full">
            <AiOutlineSearch className="text-black w-[20px] h-[20px]" />
            <input
              placeholder="Search for Gifs"
              className="w-[95%] outline-none text-black"
              onChange={HandleSearch}
            />
          </div>
        </div>
        {fetching ? (
          <div className="text-black m-auto">loading</div>
        ) : (
          <div className="w-full  grid grid-cols-3 gap-1 p-4 items-center justify-center">
            {datas?.map((items: any, i: number) => (
              <img
                onClick={() => {
                  setimageMessage(items.images.downsized.url);
                  closeModal(true);
                }}
                key={i}
                src={items.images.downsized.url}
                alt="gif"
                width={100}
                height={100}
                className="w-[190px] h-[130px]"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GifBox;
