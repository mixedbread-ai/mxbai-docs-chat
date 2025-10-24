import { Chat } from "@/components/chat";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  return (
    <ScrollArea className="h-svh">
      <div className="flex justify-center">
        <main className="max-w-[95vw] w-2xl">
          <Chat />
        </main>
      </div>
    </ScrollArea>
  );
}
