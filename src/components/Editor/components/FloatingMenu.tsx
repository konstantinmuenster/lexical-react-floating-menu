import { forwardRef, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";

import { IconButton } from "../../IconButton";

export type FloatingMenuCoords = { x: number; y: number } | undefined;

type FloatingMenuState = {
  isBold: boolean;
  isCode: boolean;
  isItalic: boolean;
  isStrikethrough: boolean;
  isUnderline: boolean;
};

type FloatingMenuProps = {
  editor: ReturnType<typeof useLexicalComposerContext>[0];
  coords: FloatingMenuCoords;
};

export const FloatingMenu = forwardRef<HTMLDivElement, FloatingMenuProps>(
  function FloatingMenu(props, ref) {
    const { editor, coords } = props;

    const shouldShow = coords !== undefined;

    const [state, setState] = useState<FloatingMenuState>({
      isBold: false,
      isCode: false,
      isItalic: false,
      isStrikethrough: false,
      isUnderline: false,
    });

    useEffect(() => {
      const unregisterListener = editor.registerUpdateListener(
        ({ editorState }) => {
          editorState.read(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            setState({
              isBold: selection.hasFormat("bold"),
              isCode: selection.hasFormat("code"),
              isItalic: selection.hasFormat("italic"),
              isStrikethrough: selection.hasFormat("strikethrough"),
              isUnderline: selection.hasFormat("underline"),
            });
          });
        }
      );
      return unregisterListener;
    }, [editor]);

    return (
      <div
        ref={ref}
        className="flex items-center justify-between bg-slate-100 border-[1px] border-slate-300 rounded-md p-1 gap-1"
        aria-hidden={!shouldShow}
        style={{
          position: "absolute",
          top: coords?.y,
          left: coords?.x,
          visibility: shouldShow ? "visible" : "hidden",
          opacity: shouldShow ? 1 : 0,
        }}
      >
        <IconButton
          icon="bold"
          aria-label="Format text as bold"
          active={state.isBold}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          }}
        />
        <IconButton
          icon="italic"
          aria-label="Format text as italics"
          active={state.isItalic}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
          }}
        />
        <IconButton
          icon="underline"
          aria-label="Format text to underlined"
          active={state.isUnderline}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
          }}
        />
        <IconButton
          icon="strike"
          aria-label="Format text with a strikethrough"
          active={state.isStrikethrough}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
          }}
        />
        <IconButton
          icon="code"
          aria-label="Format text with inline code"
          active={state.isCode}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
          }}
        />
      </div>
    );
  }
);
