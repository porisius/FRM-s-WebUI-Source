"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Settings_API from "@/app/settings/settings pages/api";
import { appVersion, author } from "@/lib/constants";
import Link from "next/link";

export default function Settings() {
  return (
    <div style={{ margin: 5, padding: 25 }}>
      <Card>
        <CardHeader>
          <CardTitle>Web UI Version : {appVersion}</CardTitle>
          <CardDescription>Web UI settings</CardDescription>
        </CardHeader>
        <CardContent style={{ margin: 5 }}>
          <Settings_API />
        </CardContent>
        <CardFooter>
          <Link
            href={author.url}
            className={"text-sm text-muted-foreground underline"}
            rel="noopener noreferrer"
            target="_blank"
          >
            Made By {author.name} 🩷
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
