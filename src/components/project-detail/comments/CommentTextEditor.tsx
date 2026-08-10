'use client';

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill styles

const APP_URL = process.env.NEXT_PUBLIC_APP_URL 

export type CommentTextEditorHandle = {
  getContent: () => string
  resetContent: () => void
};

const CommentTextEditor = forwardRef<CommentTextEditorHandle, {id: number}>(({id}, ref) => {
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
        modules: {
          toolbar: false,
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
              console.log("inside", curr.getSemanticHTML())

              // const isDeletion = delta?.ops?.some((op: any) => op.hasOwnProperty('delete'));
              const content = quill.getContents();
              
              // if (!isDeletion) {
              //   curr.removeFormat(0, curr.getLength())
              // }
              const currentSelection = curr.getSelection()

              const strippedContents = content.map((op) => {
                if (op.insert && typeof op.insert === 'string') {
                  const isBlock = op.insert === '\n';
                  return {
                    insert: op.insert,
                    attributes: isBlock ? op.attributes : undefined
                  };
                }
                return op;
              });


              const ats = [...message.matchAll(/@[a-zA-Z0-9_]+/g)].map((tags, idx) => {
                return {
                  index: tags.index,
                  value: tags[0]
                }
              })


              // const result = message.split(" ").map((word) => {
              //   let matched = word.match(/@[a-zA-Z0-9_]+/g)
              //   if(matched){
              //     return word.replace(/@[a-zA-Z0-9_]+/g, `<a href='http://localhost:3000/user/${matched}'>${matched}</a>`)
              //   }

              //   return word
              // })
              quill.setContents(strippedContents)

              if(currentSelection){
                curr.setSelection(currentSelection.index, currentSelection.length, Quill.sources.SILENT);
              }

              console.log("the writed :",message, content)


              ats.forEach((at) => {
                curr.formatText(at.index, at.value.length, {
                  'link': `${APP_URL}/user/${at.value}`,
                });

                const nextCharIndex = at.index + at.value.length;
                const docLength = curr.getLength();
                
                if (nextCharIndex < docLength) {
                  curr.formatText(nextCharIndex, 1, {
                    'link': false,
                  });
                }
              })
              
              // if (currentSelection) {
              //   curr.setSelection(currentSelection.index, currentSelection.length, Quill.sources.SILENT);
              // }
              // const length = quill.getLength();
              // quill.setSelection(length, 0);
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
      console.log(quill?.getSemanticHTML())
      return (quill) ? quill.getSemanticHTML().replaceAll("&nbsp;", " ").replaceAll(/<(p|span|div|[b-z])(.*?)>|<\/(p|span|div|[b-z])>/g, "") : ""
    },

    resetContent: () => {
      quillRef.current?.setText("")
    }
  }));

  return <div className='input-style p-0! h-20'>
    <div key={id} ref={editorRef} className='h-full' onClick={handleClickEventInEditor} />
  </div>;
});

export default CommentTextEditor;