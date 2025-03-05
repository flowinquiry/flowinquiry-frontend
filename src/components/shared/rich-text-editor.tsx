// components/RichTextEditor.tsx
"use client";

import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { findUsersByTerm } from "@/lib/actions/users.action";
import { UserDTO } from "@/types/users";

// Define a type that matches TipTap's expected MentionNodeAttrs
interface MentionNodeAttrs {
  id: string;
  label: string;
}

// Separate portal component to avoid ref type issues
interface MentionPortalProps {
  items: UserDTO[];
  command: (item: UserDTO) => void;
  isLoading: boolean;
  clientRect: DOMRect;
  containerRef: HTMLDivElement | null;
}

const MentionPortal = ({
  items,
  command,
  isLoading,
  clientRect,
  containerRef,
}: MentionPortalProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // Calculate position based on the cursor position
  const style = {
    position: "absolute",
    top: `${clientRect.top + clientRect.height + window.scrollY}px`,
    left: `${clientRect.left + window.scrollX}px`,
    zIndex: 9999, // Very high z-index to appear above dialogs/sheets
  } as React.CSSProperties;

  const handleItemClick = (user: UserDTO) => {
    command(user);
  };

  // Determine where to render the portal
  const portalTarget = containerRef || document.body;

  return createPortal(
    <div
      ref={ref}
      className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden max-w-xs w-full mention-dropdown-container"
      style={style}
    >
      {isLoading ? (
        <div className="p-2 text-sm text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      ) : items.length === 0 ? (
        <div className="p-2 text-sm text-gray-500 dark:text-gray-400">
          No users found
        </div>
      ) : (
        <div className="max-h-60 overflow-y-auto">
          {items.map((user) => (
            <button
              key={user.id?.toString() || user.email}
              className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleItemClick(user)}
              type="button"
            >
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={`${user.firstName} ${user.lastName || ""}`}
                  className="w-6 h-6 rounded-full mr-2"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center mr-2">
                  {user.firstName.charAt(0)}
                </div>
              )}
              <span>{`${user.firstName} ${user.lastName || ""}`}</span>
              {user.title && (
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  {user.title}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>,
    portalTarget,
  );
};

// Main editor component
interface RichTextEditorProps {
  value?: string | null;
  onChange?: (content: string) => void;
  onBlur?: () => void;
  onMentionSelect?: () => boolean | void;
}

const RichTextEditor = ({
  value,
  onChange,
  onBlur,
  onMentionSelect,
}: RichTextEditorProps) => {
  const [mentionSuggestions, setMentionSuggestions] = useState<UserDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mentionClientRect, setMentionClientRect] = useState<DOMRect | null>(
    null,
  );
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);

  // Ref to the editor container for proper portal rendering
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Function to fetch mention suggestions from API
  const loadMentionSuggestions = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      const users = await findUsersByTerm(query);

      // Make sure users is treated as an array
      const usersArray = Array.isArray(users) ? users : [users].filter(Boolean);

      setMentionSuggestions(usersArray);
      return usersArray;
    } catch (error) {
      console.error("Error fetching mention suggestions:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);
  // Initialize the editor with extensions and content
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 dark:text-blue-400 underline cursor-pointer",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border border-gray-300 dark:border-gray-700 w-full mb-4",
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
      Mention.configure({
        HTMLAttributes: {
          class:
            "inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded mr-1",
        },
        renderLabel({ node }) {
          return `@${node.attrs.label ?? node.attrs.id}`;
        },
        suggestion: {
          char: "@",
          items: async ({ query }) => {
            const users = await loadMentionSuggestions(query);
            return users;
          },
          command: ({ editor, range, props }) => {
            const user = props as unknown as UserDTO;
            const deleteFrom = Math.max(0, range.from - 1);

            // Prevent the editor from losing focus
            editor.view.focus();

            // Insert the mention without closing the editor
            editor
              .chain()
              .focus()
              .deleteRange({ from: deleteFrom, to: range.to })
              .run();

            editor
              .chain()
              .focus()
              .insertContent({
                type: "mention",
                attrs: {
                  id: user.id ? user.id.toString() : user.email,
                  label: `${user.firstName} ${user.lastName || ""}`.trim(),
                },
              })
              .insertContent(" ")
              .run();

            // Ensure the editor remains focused and interactive
            editor.view.focus();

            // Reset suggestion state
            setShowMentionSuggestions(false);

            // Prevent mode switching
            return true;
          },
          render: () => {
            return {
              onStart: (props) => {
                if (props.clientRect) {
                  setMentionClientRect(props.clientRect());
                }
                setMentionSuggestions(props.items);
                setShowMentionSuggestions(true);
              },
              onUpdate: (props) => {
                if (props.clientRect) {
                  setMentionClientRect(props.clientRect());
                }
                setMentionSuggestions(props.items);
              },
              onKeyDown: (props) => {
                if (props.event.key === "Escape") {
                  setShowMentionSuggestions(false);
                  return true;
                }
                return false;
              },
              onExit: () => {
                setShowMentionSuggestions(false);
              },
            };
          },
        },
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      // Call onChange with the HTML content whenever the editor is updated
      onChange && onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const handleBlur = () => {
      // Delay to ensure any interactions are completed
      setTimeout(() => {
        onBlur && onBlur();
      }, 100);
    };

    const editorDom = editor.view.dom;

    editorDom.addEventListener("blur", handleBlur, { capture: true });

    return () => {
      editorDom.removeEventListener("blur", handleBlur);
    };
  }, [editor, onBlur]);

  // Update editor content when value prop changes
  useEffect(() => {
    if (
      editor &&
      value !== undefined &&
      value !== null &&
      editor.getHTML() !== value
    ) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  // Handle adding a link
  const addLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // add http:// if it doesn't exist
    const httpUrl =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `http://${url}`;

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: httpUrl })
      .run();
  };

  // Handle adding a table
  const addTable = () => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div
      className="border border-gray-300 dark:border-gray-700 rounded-md"
      ref={editorContainerRef}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        >
          Bold
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        >
          Italic
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
        >
          Strike
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
        >
          Code
        </ToolbarButton>
        <div className="h-6 border-r border-gray-300 dark:border-gray-700 mx-1"></div>
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive("paragraph")}
        >
          Paragraph
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
        >
          Bullet List
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
        >
          Ordered List
        </ToolbarButton>
        <div className="h-6 border-r border-gray-300 dark:border-gray-700 mx-1"></div>
        <ToolbarButton onClick={addLink} isActive={editor.isActive("link")}>
          Link
        </ToolbarButton>
        <ToolbarButton onClick={addTable}>Insert Table</ToolbarButton>

        {/* Table operations, only shown when inside a table */}
        {editor.isActive("table") && (
          <div className="flex flex-wrap gap-1 ml-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().addColumnBefore().run()}
            >
              Add Column Before
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              Add Column After
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().addRowBefore().run()}
            >
              Add Row Before
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              Add Row After
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().deleteColumn().run()}
            >
              Delete Column
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().deleteRow().run()}
            >
              Delete Row
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().deleteTable().run()}
            >
              Delete Table
            </ToolbarButton>
          </div>
        )}
      </div>

      {/* Editor Content */}
      <div className="px-4 py-3 bg-white dark:bg-gray-900">
        <EditorContent
          editor={editor}
          className="prose dark:prose-invert max-w-none focus:outline-none [&_.ProseMirror_table]:border-collapse [&_.ProseMirror_table_td]:border [&_.ProseMirror_table_td]:border-gray-300 [&_.ProseMirror_table_td]:dark:border-gray-700 [&_.ProseMirror_table_td]:p-2 [&_.ProseMirror_table_th]:border [&_.ProseMirror_table_th]:border-gray-300 [&_.ProseMirror_table_th]:dark:border-gray-700 [&_.ProseMirror_table_th]:p-2 [&_.ProseMirror_table_th]:bg-gray-100 [&_.ProseMirror_table_th]:dark:bg-gray-800 [&_.ProseMirror]:min-h-[300px] [&_.ProseMirror]:pl-4 [&_.ProseMirror]:pt-2"
        />
      </div>

      {/* Mention Suggestions Portal */}
      {showMentionSuggestions && mentionClientRect && (
        <MentionPortal
          items={mentionSuggestions}
          command={(user) => {
            if (!editor) return;

            const editorObj = editor as any;
            if (
              editorObj.__tiptapSuggestion &&
              typeof editorObj.__tiptapSuggestion.command === "function"
            ) {
              editorObj.__tiptapSuggestion.command(user);
            } else {
              // Fallback implementation
              const { state } = editor;
              const { selection } = state;
              const { from } = selection;

              // Try to find the '@' character before the cursor
              let atPos = from;
              let foundAt = false;
              for (let i = from - 1; i >= Math.max(0, from - 20); i--) {
                const char = state.doc.textBetween(i, i + 1);
                if (char === "@") {
                  atPos = i;
                  foundAt = true;
                  break;
                }
              }

              if (foundAt) {
                // Delete the '@' and the query text
                editor.commands.deleteRange({ from: atPos, to: from });
              }

              // Insert the mention
              editor.commands.insertContent({
                type: "mention",
                attrs: {
                  id: user.id ? user.id.toString() : user.email,
                  label: `${user.firstName} ${user.lastName || ""}`.trim(),
                },
              });

              editor.commands.insertContent(" ");
            }

            // Hide the suggestions
            setShowMentionSuggestions(false);
          }}
          isLoading={isLoading}
          clientRect={mentionClientRect}
          containerRef={editorContainerRef.current}
        />
      )}
    </div>
  );
};

// Toolbar button component
const ToolbarButton = ({
  onClick,
  isActive,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        p-2 rounded-md text-sm font-medium
        ${
          isActive
            ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
        }
      `}
    >
      {children}
    </button>
  );
};

export default RichTextEditor;
