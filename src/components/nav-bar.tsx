import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Logo from "@/components/ui/logo.tsx";
import Instructions from "@/components/instructions.tsx";
import { memo } from "react";
function NavBar() {
  return (
    <div className={"flex gap-2 items-center justify-start pl-2"}>
      <a href={"https://www.dotidot.io"}>
        <Logo />
      </a>
      <NavigationMenu className={"p-2"}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-4 md:w-[400px] lg:w-[500px]">
                <Instructions />
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href={"https://github.com/lfilipiuk/dotidot-graph"}
              className={navigationMenuTriggerStyle()}
            >
              Documentation
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const MemoizedNavBar = memo(NavBar);

export default MemoizedNavBar;
