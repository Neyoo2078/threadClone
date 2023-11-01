import React from 'react';
import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/Actions/User';
import SuggestedUsers from './SuggestedUsers';

const RightSideBar = async () => {
  const user = await currentUser();
  const users = await fetchUser({ userid: user?.id });
  const newUser = JSON.parse(users);

  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">
          Suggested Communities
        </h3>
      </div>
      <div className="flex flex-1 flex-col justify-start">
        <SuggestedUsers userid={newUser?._id} user={newUser} />
      </div>
    </section>
  );
};

export default RightSideBar;
