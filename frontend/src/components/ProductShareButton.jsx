import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "../lib/utils";

async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.readOnly = true;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand?.("copy");
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error("Copy command failed");
  }
}

export default function ProductShareButton({
  product,
  className = "",
  style = {},
  iconSize = 14,
  ...props
}) {
  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const slug = product?.slug;
    if (!slug || typeof window === "undefined") {
      toast.error("Sharing is unavailable for this product");
      return;
    }

    const url = new URL(`/product/${slug}`, window.location.origin).toString();
    const title = product?.name || "Thread Tales by Teju";
    const text = `Check out ${title} from Thread Tales by Teju`;

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        toast.success("Share options opened");
        return;
      }

      await copyToClipboard(url);
      toast.success("Product link copied");
    } catch (error) {
      if (error?.name === "AbortError") return;

      try {
        await copyToClipboard(url);
        toast.success("Product link copied");
      } catch {
        toast.error("Could not share this product");
      }
    }
  };

  return (
    <button
      type="button"
      aria-label={`Share ${product?.name || "product"}`}
      title="Share"
      onClick={handleShare}
      className={cn(
        "rounded-none shrink-0 transition-all duration-300 flex items-center justify-center",
        className
      )}
      style={style}
      {...props}
    >
      <Share2 size={iconSize} />
    </button>
  );
}
