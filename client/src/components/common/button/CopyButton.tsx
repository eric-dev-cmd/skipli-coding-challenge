import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { copyToClipboard } from "@/utils/copyToClipboard"; // nếu bạn có util

export function CopyButton({ textToCopy }: { textToCopy: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 cursor-pointer"
      aria-label="Copy text"
    >
      {copied ? (
        <CheckIcon className="h-5 w-5 text-green-600" />
      ) : (
        <CopyIcon className="h-5 w-5" />
      )}
    </button>
  );
}
