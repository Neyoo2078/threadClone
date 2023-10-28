'use client';
import { sidebarLinks } from '@/constants';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

const ButtomBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <section>
      <div className="bottombar">
        <div className="bottombar_container">
          {sidebarLinks.map((link) => {
            const isActive =
              (pathname.includes(link.route) && link.route.length > 1) ||
              pathname === link.route;
            return (
              <Link
                href={link.route}
                key={link.label}
                className={`bottombar_link ${isActive && 'bg-primary-500'}`}
              >
                <Image src={link.imgURL} alt="link" height={24} width={24} />

                <p className="text-light-1 text-subtle-medium max-sm:hidden">
                  {link.label.split(' ')[0]}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ButtomBar;
