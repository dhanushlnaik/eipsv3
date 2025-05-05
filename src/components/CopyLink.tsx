"use client"

import { CopyIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"

interface CopyLinkProps {
  link: string
  style?: React.CSSProperties
}

const CopyLink: React.FC<CopyLinkProps> = ({ link, style }) => {
  const { toast } = useToast()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link)
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      })
    } catch  {
      toast({
        variant: "destructive",
        title: "Failed to copy!",
        description: "There was an issue copying the link.",
        action: <ToastAction altText="Try again">Retry</ToastAction>,
      })
    }
  }

  return (
    <Button
      onClick={copyToClipboard}
      variant="ghost"
      size="icon"
      className="bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-blue-500 rounded-md transition-all"
      style={style}
    >
      <CopyIcon className="w-5 h-5" />
    </Button>
  )
}

export default CopyLink
