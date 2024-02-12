import { LoaderIcon } from "lucide-react";

export const Loader = () => (
  <div className="flex items-center justify-center gap-2">
    <LoaderIcon className="w-6 h-6 rounded-full animate-spin-slow"></LoaderIcon>
    <span className="text-lg text-gray-700">Loading...</span>
  </div>
);
