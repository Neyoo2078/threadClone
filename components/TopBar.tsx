'use client';
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import Image from 'next/image';
import Link from 'next/link';
import '../app/globals.css';
import { SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';

const TopBar = () => {
  const router = useRouter();
  return (
    <div className="topbar">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/logo.svg" alt="logo" width={32} height={32} />
        <h1 className="text-heading3-bold text-light-1 max-xs:hidden">
          Threads
        </h1>
      </Link>

      <div className="flex items-center gap-3">
        {' '}
        <div className=" items-center  block gap-3 md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image
                  src="/assets/logout.svg"
                  alt="logout"
                  height={24}
                  width={24}
                />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
        <div>
          <SignedOut>
            <button
              onClick={() => {
                router.push('/sign-in');
              }}
              className="text-white hover:font-semibold bg-primary-500 hover:bg-primary-500/70 p-2 rounded-lg"
            >
              Sign Ins
            </button>
          </SignedOut>
        </div>
        {/* <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: 'py-2 px-4',
            },
          }}
        /> */}
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default TopBar;
