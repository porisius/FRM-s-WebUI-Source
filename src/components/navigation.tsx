import { Menubar, MenubarMenu } from "@/components/ui/menubar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Factory,
  HeartHandshake,
  Home,
  Map,
  Plane,
  PlugZap,
  Printer,
  Settings,
} from "lucide-react";

function Navigation() {
  return (
    <Menubar
      style={{
        margin: 5,
        padding: 25,
        justifyContent: "center",
        position: "sticky",
        top: 0,
        zIndex: 3,
      }}
    >
      <MenubarMenu>
        <Link href="/">
          <Button variant="secondary">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
        </Link>
        <Link href="/thanks">
          <Button variant="secondary">
            <HeartHandshake className="mr-2 h-4 w-4" />
            Thanks
          </Button>
        </Link>
        <Link href="/resourcesink">
          <Button variant="secondary">
            <Printer className="mr-2 h-4 w-4" /> Resource Sink
          </Button>
        </Link>
        <Link href="/map">
          <Button variant="secondary">
            <Map className="mr-2 h-4 w-4" /> Map
          </Button>
        </Link>
        <Link href="/power">
          <Button variant="secondary">
            <PlugZap className="mr-2 h-4 w-4" />
            Power
          </Button>
        </Link>
        <Link href="/drone">
          <Button variant="secondary">
            <Plane className="mr-2 h-4 w-4" />
            Drone
          </Button>
        </Link>
        <Link href="/overallprod">
          <Button variant="secondary">
            <Factory className="mr-2 h-4 w-4" />
            Overall Prod
          </Button>
        </Link>
        <Link href="/detailedprod">
          <Button variant="secondary">
            <Factory className="mr-2 h-4 w-4" />
            Detailed Prod
          </Button>
        </Link>
        <Link href="/settings">
          <Button variant="secondary">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </Link>
      </MenubarMenu>
    </Menubar>
  );
}

export default Navigation;
