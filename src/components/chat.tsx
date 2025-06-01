"use client";
import React, { useEffect, useState } from "react";

import { useSettingsStore } from "@stores/settings";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { rgbaFloatToRGBA } from "@/lib/helpers";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import Link from "next/link";

type ChatMessage = {
  ServerTimeStamp: number;
  Sender: string;
  Type: "System" | "Player";
  Message: string;
  Color: {
    R: number;
    G: number;
    B: number;
    A: number;
  };
};

export default function Chat() {
  const { baseURL, fetchSpeed, authToken, username, _hasHydrated } =
    useSettingsStore();
  const [data, setData] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!_hasHydrated) return;
    const interval = setInterval(async () => {
      try {
        let data: ChatMessage[] = (
          await axios.get(baseURL + "/getChatMessages")
        ).data;
        data = data.map((message) => {
          return message.Type == "System"
            ? {
                ...message,
                Sender: "System",
                Message: message.Message.replace(
                  "<PlayerName/>",
                  message.Sender,
                ),
              }
            : message;
        });
        setData(data);
      } catch {}
    }, fetchSpeed);
    return () => {
      clearInterval(interval);
    };
  }, [_hasHydrated]);

  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = React.useCallback(async () => {
    if (!message.trim()) return;
    try {
      const response = await axios.post(
        baseURL + "/sendChatMessage",
        {
          message,
          sender: username,
        },
        {
          headers: {
            "X-FRM-Authorization": authToken,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === 200) setMessage("");
      return response.status === 200
        ? { status: "OK", message: "Message Sent!" }
        : { status: "Error", message: response.data.error };
    } catch (error: any) {
      return {
        status: "Error",
        message: error.message || "Failed to send message",
      };
    }
  }, [baseURL, authToken, username, message]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!_hasHydrated) return;

  return (
    <div className={"overflow-hidden"}>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 1, scale: 1, x: 0 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 0 }}
            className={`right-4 bottom-4 absolute size-10 rounded-full rounded-br-none bg-card`}
          >
            {username.trim() == "" || authToken.trim() == "" ? (
              <Tooltip>
                <TooltipTrigger
                  className={
                    "size-10 rounded-full rounded-br-none overflow-hidden"
                  }
                >
                  <Link
                    href={
                      location.origin +
                      `/settings${username.trim() == "" || authToken.trim() == "" ? (username.trim() == "" ? "#username" : "#authorization") : ""}`
                    }
                  >
                    <Button
                      variant={"outline"}
                      className={"p-1 size-10 rounded-full rounded-br-none"}
                      disabled={username.trim() == "" || authToken.trim() == ""}
                      asChild
                    >
                      <span>
                        <MessageCircle className="text-muted-foreground" />
                      </span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent className={"bg-card text-primary border"}>
                  <p>
                    To use chat feature please go to settings and set it up!
                  </p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant={"outline"}
                className={"p-1 size-10 rounded-full rounded-br-none"}
                onClick={() => setIsOpen(() => true)}
                disabled={username.trim() == "" || authToken.trim() == ""}
              >
                <MessageCircle />
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="w-[30vw] h-[50vh] bg-card absolute right-0 bottom-0 rounded-tl-md border-l border-t flex flex-col overflow-hidden shadow-lg"
            key={"chat"}
            style={{ transformOrigin: "bottom right" }}
            initial={{ opacity: 0, scale: 0, x: 0 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 0 }}
          >
            <Button
              variant={"outline"}
              className={"p-1 !bg-card absolute left-1 top-1 z-1 size-6"}
              onClick={() => setIsOpen(() => false)}
            >
              <X />
            </Button>
            <ScrollArea className="p-3 flex-1 overflow-y-auto bg-card flex flex-col gap-1 scrollarea-child-target">
              {data.map((message) => {
                const isUser = message.Sender == username;
                const [r, g, b, a] = rgbaFloatToRGBA(message.Color);
                return (
                  <div
                    key={message.ServerTimeStamp + message.Sender}
                    className={`max-w-[80%] p-3 rounded-md shadow-sm border space-y-1 right-0 my-1 ${
                      isUser
                        ? "self-end rounded-br-none"
                        : `self-start rounded-bl-none`
                    }`}
                    style={{
                      borderColor:
                        message.Sender === "System"
                          ? "var(--color-blue-400)"
                          : `rgb(${r},${g},${b})`,
                      color:
                        message.Sender === "System"
                          ? "var(--color-blue-400)"
                          : `rgb(${r},${g},${b})`,
                      backgroundColor:
                        message.Sender === "System"
                          ? "color-mix(in oklab, var(--color-blue-400) /* oklch(70.7% 0.165 254.624) */ 10%, transparent)"
                          : `rgb(${r},${g},${b},0.1)`,
                    }}
                  >
                    <p className="font-semibold text-sm mb-1">
                      {message.Type == "System"
                        ? message.Sender
                        : message.Sender
                          ? message.Sender
                          : "FRM"}
                    </p>
                    <p className="text-sm whitespace-pre-wrap">
                      {message.Message}
                    </p>
                  </div>
                );
              })}
            </ScrollArea>

            <div className="flex p-3 border-t rounded-b-md space-x-2">
              <Input
                placeholder="Type your message..."
                className="flex-1 rounded-md border px-3 py-2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />
              <Button
                className="px-5 py-2 rounded-md transition"
                onClick={sendMessage}
                disabled={message.trim() == ""}
              >
                Send
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
