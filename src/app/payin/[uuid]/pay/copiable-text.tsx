import { Button } from "@/components/ui/button";
import copy from "copy-to-clipboard";
import { useEffect, useState } from "react";

interface CopiableTextProp {
  text: string;
  textToCopy: string;
}

export default function CopiableText({ text, textToCopy }: CopiableTextProp) {
  const [copyActive, setCopyActive] = useState(false);

  const onCopyClick = () => {
    copy(textToCopy);
    setCopyActive(true);
  };

  useEffect(() => {
    const clearCopy = setTimeout(() => setCopyActive(false), 2000);

    return () => clearTimeout(clearCopy);
  }, [copyActive]);

  return (
    <div
      className={`${copyActive ? "animate-pulse text-(--primary-color)" : ""}`}
    >
      <span className="text-sm mr-3">{text}</span>
      <Button
        className={`p-0 h-6 text-(--primary-color) ${copyActive ? "" : "cursor-pointer"}`}
        variant="link"
        disabled={copyActive}
        onClick={onCopyClick}
      >
        {copyActive ? "Copied!" : "Copy"}
      </Button>
    </div>
  );
}
