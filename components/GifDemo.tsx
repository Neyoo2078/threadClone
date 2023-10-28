import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';
import { Grid } from '@giphy/react-components';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ResizeObserver from 'react-resize-observer';
import { text } from 'stream/consumers';

function GridDemo({ onGifClick, Search, SearchQuery, setSearch }: any) {
  const giphyFetch = new GiphyFetch('aA2x9oViLjBhMAuNKWRKFpgj6fz6yikG');
  console.log(SearchQuery);
  console.log(Search);

  const [datas, setdatas] = useState<any>(null);
  const [fetching, setfetching] = useState<any>(null);
  console.log({ datas });
  const fetchGifs = (offset: number) =>
    giphyFetch.trending({ offset, limit: 10 });

  const searchGifs = (offset: number) =>
    giphyFetch.search(SearchQuery, {
      sort: 'relevant',
      rating: 'g',
      lang: 'es',
      limit: 10,
      type: 'stickers',
      offset,
    });

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

  const [width, setWidth] = useState(window.innerWidth);
  return (
    <>
      {fetching ? (
        <div className="text-black">loading</div>
      ) : (
        <div className="w-full  grid grid-cols-3 gap-1 p-4 items-center justify-center">
          {datas?.map((items: any, i: number) => (
            <img
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
      {/* <Grid
        onGifClick={onGifClick}
        fetchGifs={searchGifs}
        width={width}
        columns={3}
        gutter={6}
      />
      <ResizeObserver
        onResize={({ width }: any) => {
          setWidth(width);
        }}
      /> */}
    </>
  );
}

export default GridDemo;
