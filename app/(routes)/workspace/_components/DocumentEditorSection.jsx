"use client"
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import DcoumentHeader from './DcoumentHeader'
import DocumentInfo from './DocumentInfo'
const RichDocumentEditor = dynamic(() => import("../_components/RichDocumentEditor"), { ssr: false }); 

import { Button } from '@/components/ui/button'
import { MessageCircle, X } from 'lucide-react'
import CommentBox from './CommentBox'

function DocumentEditorSection({ params }) { 

  const [openComment, setOpenComment] = useState(false);
  const [downloadPDF, setDownloadPDF] = useState(null);
   // console.log(params)

  return (
    <div className='relative'>
      {/* Header  */}
      <DcoumentHeader handleDownloadPDF={downloadPDF} />

      {/* Document Info  */}
      <DocumentInfo params={params} />

      {/* Rich Text Editor  */}
 
      <RichDocumentEditor params={params} setDownloadPDF={setDownloadPDF} />
 
      <div className='fixed right-10 bottom-10 '>
        <Button onClick={() => setOpenComment(!openComment)}>
          {openComment ? <X /> : <MessageCircle />} </Button>
        {openComment && <CommentBox />}
      </div>
    
    </div>
  )
}

export default DocumentEditorSection