import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/ui/navigation-menu";
import { forwardRef } from "react";

export const Navbar = () => {
  return (
    <NavigationMenu className="header pointer-events-none absolute text-black w-full justify-between max-w-full bg-transparent p-2">
      {/* Title */}
      <NavigationMenuLink className="pointer-events-auto">
        <Button variant={"ghost"} className={cn("headerText", "active")}>
          LC 100: UZJ100W-GNPEK
        </Button>
      </NavigationMenuLink>
      <NavigationMenuList className="text-sm w-full flex justify-around items-center gap-4">
        {/* Engine */}
        <NavigationMenuItem className="pointer-events-auto">
          <NavigationMenuTrigger className="headerText">ENGINE / FUEL / TOOL</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <ListItem href="/docs" title="Introduction">
                Example 1
              </ListItem>
              <ListItem href="/docs/installation" title="Installation">
                Example 2
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {/* Power Train */}
        <NavigationMenuItem className="pointer-events-auto">
          <NavigationMenuTrigger className="headerText">
            POWER TRAIN / CHASSIS
          </NavigationMenuTrigger>
          <div>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <ListItem href="/docs" title="Introduction">
                  Example 1
                </ListItem>
                <ListItem href="/docs/installation" title="Installation">
                  Example 2
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </div>
        </NavigationMenuItem>
        <NavigationMenuItem className="pointer-events-auto">
          <NavigationMenuTrigger className="headerText">BODY / INTERIOR</NavigationMenuTrigger>

          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <ListItem href="/docs" title="Introduction">
                Example 1
              </ListItem>
              <ListItem href="/docs/installation" title="Installation">
                Example 2
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {/* Electrical */}
        <NavigationMenuItem className="pointer-events-auto">
          <div className="relative z-10 flex max-w-max flex-1 items-center justify-center">
            <NavigationMenuTrigger className="headerText">ELECTRICAL</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <ListItem href="/docs" title="Introduction">
                  Example 1
                </ListItem>
                <ListItem href="/docs/installation" title="Installation">
                  Example 2
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </div>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}>
            <div className="text-sm leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = "ListItem";
