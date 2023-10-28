import { fetchThread } from '@/lib/Actions/CreateThreads';
import ThreadCard from '@/components/ThreadCard';
import Comment from '@/components/Comment';
import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/Actions/User';
import Comments from '@/components/Comments';
const page = async ({ params }: { params: { id: string } }) => {
  const res = await fetchThread(params.id);
  const post = JSON.parse(res);
  const user = await currentUser();
  const userinfo: any = await fetchUser({ userid: user?.id });
  const userinfos = JSON.parse(userinfo);
  console.log({ threadPost: post });
  return (
    <div className="flex flex-col gap-3 w-full">
      <ThreadCard thread post={post} />
      <div className="mt-7 w-full">
        <Comment
          Threadid={post._id}
          CurrentUserImg={userinfos.image}
          CurrentUserId={userinfos._id}
        />
      </div>
      <Comments posts={post.children} />
    </div>
  );
};

export default page;
