import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
    Bold, Italic, Strikethrough, Code, Heading1, Heading2,
    List, ListOrdered, Quote, Minus, Undo, Redo, Link as LinkIcon
} from 'lucide-react';

interface TipTapEditorProps {
    content: string;
    onChange: (html: string) => void;
    editable?: boolean;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const isActive = (type: string, opts?: any) => editor.isActive(type, opts) ? 'bg-clipto-primary/20 text-clipto-primary' : 'hover:bg-clipto-surfaceLight text-clipto-textSecondary';
    const btnClass = "p-1.5 rounded transition-colors";

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-clipto-divider bg-clipto-surfaceLight/5">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`${btnClass} ${isActive('bold')}`}
                title="Bold"
            >
                <Bold size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`${btnClass} ${isActive('italic')}`}
                title="Italic"
            >
                <Italic size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`${btnClass} ${isActive('strike')}`}
                title="Strikethrough"
            >
                <Strikethrough size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`${btnClass} ${isActive('code')}`}
                title="Code"
            >
                <Code size={18} />
            </button>
            <div className="w-px h-6 bg-clipto-divider mx-1" />
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`${btnClass} ${isActive('heading', { level: 1 })}`}
                title="Heading 1"
            >
                <Heading1 size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`${btnClass} ${isActive('heading', { level: 2 })}`}
                title="Heading 2"
            >
                <Heading2 size={18} />
            </button>
            <div className="w-px h-6 bg-clipto-divider mx-1" />
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`${btnClass} ${isActive('bulletList')}`}
                title="Bullet List"
            >
                <List size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`${btnClass} ${isActive('orderedList')}`}
                title="Ordered List"
            >
                <ListOrdered size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`${btnClass} ${isActive('blockquote')}`}
                title="Blockquote"
            >
                <Quote size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className={`${btnClass} hover:bg-clipto-surfaceLight text-clipto-textSecondary`}
                title="Horizontal Rule"
            >
                <Minus size={18} />
            </button>
            <div className="w-px h-6 bg-clipto-divider mx-1" />
            <button
                onClick={() => editor.chain().focus().undo().run()}
                className={`${btnClass} hover:bg-clipto-surfaceLight text-clipto-textSecondary`}
                disabled={!editor.can().undo()}
                title="Undo"
            >
                <Undo size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                className={`${btnClass} hover:bg-clipto-surfaceLight text-clipto-textSecondary`}
                disabled={!editor.can().redo()}
                title="Redo"
            >
                <Redo size={18} />
            </button>
        </div>
    );
};

export const TipTapEditor = ({ content, onChange, editable = true }: TipTapEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
            }),
            Image,
        ],
        content: content,
        editable: editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] p-4 text-clipto-text',
            },
        },
    });

    return (
        <div className="flex flex-col h-full border border-clipto-divider rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-clipto-primary/50 transition-all">
            <MenuBar editor={editor} />
            <div className="flex-1 overflow-y-auto bg-clipto-surface/50">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};
