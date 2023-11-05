import React from 'react';
import FollowCard from './FollowCard';

const MemberList = ({ member, users }: any) => {
  return (
    <div>
      {member.length === 0 ? (
        <div>No Member</div>
      ) : (
        <div className="flex flex-col gap-3 items-start justify-center">
          {member.map((items: any, i: number) => (
            <FollowCard key={i} user={items} users={users} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberList;
