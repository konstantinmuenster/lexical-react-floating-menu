import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";

import { FloatingMenu, FloatingMenuCoords } from "../components/FloatingMenu";

const DOM_ELEMENT = document.body;

export function FloatingMenuPlugin() {
  const ref = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<FloatingMenuCoords>(undefined);
  const [editor] = useLexicalComposerContext();

  return createPortal(
    <FloatingMenu ref={ref} editor={editor} coords={coords} />,
    DOM_ELEMENT
  );
}
