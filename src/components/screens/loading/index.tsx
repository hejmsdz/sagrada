import { Header } from "@/components/layout/header";
import { Page } from "@/components/layout/page";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingScreen() {
  return (
    <Page aria-busy="true">
      <Header>
        <Skeleton className="w-[80%] h-8" />
      </Header>
      <div className="flex flex-col justify-center items-center h-full gap-2">
        <Skeleton className="w-full h-32" />
        <Skeleton className="w-full h-32" />
        <Skeleton className="w-full h-32" />
      </div>
    </Page>
  );
}
