'use client';
import { fetchAllCommunity } from '@/lib/Actions/community';
import { useEffect, useState } from 'react';
import CommunityCard from './CommunityCard';

const CommunityList = () => {
  const [Community, setCommunity] = useState([]);
  const FetchAllCommunity = async () => {
    const res = await fetchAllCommunity();
    setCommunity(JSON.parse(res));
  };
  useEffect(() => {
    FetchAllCommunity();
  }, []);

  return (
    <div>
      {Community.length === 0 ? (
        <div>
          <div>NO Community Availabe</div>
          <div>Create a community</div>
        </div>
      ) : (
        <div>
          {Community.map((items, i) => (
            <CommunityCard items={items} key={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityList;
