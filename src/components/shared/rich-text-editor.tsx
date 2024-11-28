"use client";

import Link from "@tiptap/extension-link";
import { EditorContent, type Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { BlockquoteToolbar } from "@/components/toolbars/blockquote";
import { BoldToolbar } from "@/components/toolbars/bold";
import { BulletListToolbar } from "@/components/toolbars/bullet-list";
import { CodeToolbar } from "@/components/toolbars/code";
import { CodeBlockToolbar } from "@/components/toolbars/code-block";
import { HardBreakToolbar } from "@/components/toolbars/hard-break";
import { HorizontalRuleToolbar } from "@/components/toolbars/horizontal-rule";
import { ItalicToolbar } from "@/components/toolbars/italic";
import { OrderedListToolbar } from "@/components/toolbars/ordered-list";
import { RedoToolbar } from "@/components/toolbars/redo";
import { StrikeThroughToolbar } from "@/components/toolbars/strikethrough";
import { ToolbarProvider } from "@/components/toolbars/toolbar-provider";
import { UndoToolbar } from "@/components/toolbars/undo";
import { Separator } from "@/components/ui/separator";

const extensions = [
  StarterKit.configure({
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal",
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: "list-disc",
      },
    },
    code: {
      HTMLAttributes: {
        class: "bg-accent rounded-md p-1",
      },
    },
    horizontalRule: {
      HTMLAttributes: {
        class: "my-2",
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class: "bg-primary text-primary-foreground p-2 text-sm rounded-md p-1",
      },
    },
    heading: {
      levels: [1, 2, 3, 4],
      HTMLAttributes: {
        class: "tiptap-heading",
      },
    },
  }),
  Link.configure({
    openOnClick: true, // Optional: Opens links on click
    linkOnPaste: true, // Optional: Automatically convert links on paste
  }),
];

const RichTextEditor = ({
  value,
  onChange,
  disabled = false,
}: {
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
}) => {
  const editor = useEditor({
    extensions: extensions as Extension[],
    content: value, // Set initial content
    onUpdate: ({ editor }) => {
      // Call onChange when content updates
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border w-full relative rounded-md overflow-hidden">
      <div className="flex w-full items-center py-2 px-2 justify-between border-b sticky top-0 left-0 bg-background z-20">
        <ToolbarProvider editor={editor}>
          <div className="flex items-center gap-2">
            <UndoToolbar />
            <RedoToolbar />
            <Separator orientation="vertical" className="h-7" />
            <BoldToolbar />
            <ItalicToolbar />
            <StrikeThroughToolbar />
            <BulletListToolbar />
            <OrderedListToolbar />
            <CodeToolbar />
            <CodeBlockToolbar />
            {/*<LinkToolbar />*/}
            <HorizontalRuleToolbar />
            <BlockquoteToolbar />
            <HardBreakToolbar />
          </div>
        </ToolbarProvider>
      </div>

      {/* Editor Content Section */}
      <div
        onClick={() => {
          editor?.chain().focus().run();
        }}
        className="cursor-text bg-background min-h-[10rem] max-h-[16rem] h-full overflow-y-auto"
      >
        <EditorContent
          editor={editor}
          className="outline-none p-2 h-full overflow-y-auto"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
