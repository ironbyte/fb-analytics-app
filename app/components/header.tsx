import { NavLink } from '@remix-run/react';

import { UserButton } from '@clerk/remix';
import { Menu } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

import { Button } from '~/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet';

type NavLinkItem = {
  title: string;
  href: string;
};

type NavLinkItems = NavLinkItem[];

const baseStyle =
  'hover:text-foreground underline-offset-8 hover:underline hover:transition hover:duration-500 hover:ease-in-out focus:outline-none';
const activeStyle = twMerge(
  baseStyle,
  'text-active-foreground underline underline-offset-8',
);
const inactiveStyle = twMerge(baseStyle, 'text-muted-foreground');

function NavLinks({ navLinkItems }: { navLinkItems: NavLinkItems }) {
  return (
    <>
      {navLinkItems.map((i) => (
        <NavLink
          key={i.title}
          to={i.href}
          className={({ isActive }) => {
            return isActive ? activeStyle : inactiveStyle;
          }}
        >
          {i.title}
        </NavLink>
      ))}
    </>
  );
}

export function Header({ user }: { user: string }) {
  const navLinkItems: NavLinkItems = [
    {
      title: 'Home',
      href: '/',
    },
  ];

  if (user)
    navLinkItems.push({
      title: 'Dashboard',
      href: '/dashboard',
    });

  return (
    <header className="container flex h-16 items-center justify-between gap-4 px-4 py-8 md:px-6">
      <div>
        <nav className="hidden flex-col gap-6 text-lg font-medium text-violet-800 md:flex md:flex-row md:items-center md:gap-5 lg:gap-6">
          <NavLinks navLinkItems={navLinkItems} />
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <NavLinks navLinkItems={navLinkItems} />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex font-semibold text-violet-800">
          {user ? (
            `${user}`
          ) : (
            <NavLink
              to="/sign-in"
              className={({ isActive }) => {
                return isActive ? activeStyle : inactiveStyle;
              }}
            >
              Sign In
            </NavLink>
          )}
        </div>
        <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
