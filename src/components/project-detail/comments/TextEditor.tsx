'use client';

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill styles

export type RichTextEditorHandle = {
  getContent: () => string
  resetContent: () => void
};

const RichTextEditor = forwardRef<RichTextEditorHandle>((_, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  let timeout:  ReturnType<typeof setTimeout> | undefined;
  
  const handleClickEventInEditor = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.target as HTMLElement

    const matchesAchor = el.matches("a");
    const href = el.getAttribute("href")
    if(matchesAchor && el && href){
      window.open(href, "_blank");
    }
  }

  useEffect(() => {
    if (editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        // readOnly: true,
        modules: {
          toolbar: false
        },
        placeholder: 'Write here...',
      });

      const quill = quillRef.current
      if(quillRef.current){
        quillRef.current.on('text-change', (delta, oldDelta, source) => {
          if(source != "user") return;

          clearTimeout(timeout)

          let curr = quillRef.current

          timeout = setTimeout(() => {
            if(curr){

              const message = curr.getText()

              const ats = [...message.matchAll(/@[a-zA-Z0-9_]+/g)].map((tags) => {
                return {
                  index: tags.index,
                  value: tags[0]
                }
              })

              ats.forEach((at) => {
                curr.formatText(at.index, at.value.length, {
                  'link': `http://localhost:3000/user/${at.value}`,
                });

                const nextCharIndex = at.index + at.value.length;
                const docLength = curr.getLength();
                
                if (nextCharIndex < docLength) {
                  curr.formatText(nextCharIndex, 1, {
                    'link': false,
                  });
                }
              })
            }
          }, 500)
        });
      }
    }

    return () => {
      quillRef.current = null;
    };
  }, []);

  useImperativeHandle(ref, () => ({
    getContent: () => {
      let quill = quillRef.current
      return (quill) ? quill.getSemanticHTML() : ""
    },

    resetContent: () => {
      quillRef.current?.setText("")
    }
  }));

  return <div className='input-style p-0! h-20'>
    <div ref={editorRef} className='h-full' onClick={handleClickEventInEditor} />
  </div>;
});

RichTextEditor.displayName = 'RichTextEditor';
export default RichTextEditor;