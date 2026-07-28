import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center p-12">
      <LoadingSpinner />
    </div>
  );
}