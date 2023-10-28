import { getActivity } from '@/lib/Actions/CreateThreads';
import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/Actions/User';
import Link from 'next/link';
import Image from 'next/image';

const page = async () => {
  const user = await currentUser();
  const users = await fetchUser({ userid: user?.id });
  const userDetails = JSON.parse(users);
  const activity = await getActivity(userDetails._id);
  console.log({ activity });
  //   const userDetails = JSON.parse(users);
  return (
    <div className="text-white">
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((items) => (
              <Link key={items._id} href={`/thread/${items.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={items.author.image}
                    alt="profile_photo"
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                  <p className="!text-small-regular">
                    <span className="mr-1 text-purple-400">
                      {items.author.name}
                    </span>
                    replied to your message
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <></>
        )}
      </section>
    </div>
  );
};

export default page;
