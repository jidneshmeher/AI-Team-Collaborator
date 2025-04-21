import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import DocumentOptions from './DocumentOptions';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { toast } from 'sonner';
import { use } from 'react';

function DocumentList({documentList,params}) {
    const router=useRouter();
    const param = use(params);

    const DeleteDocument=async(docId)=>{
      await deleteDoc(doc(db, "workspaceDocuments", docId));
      toast('Document Deleted !')
    }

  return (
    <div>
        {documentList.map((doc,index)=>(
            <div key={index} 
            onClick={()=>router.push('/workspace/'+param?.workspaceid+"/"+doc?.id)}
            className={`mt-3 p-2 px-3 hover:bg-gray-200 
            rounded-lg cursor-pointer flex justify-between items-center
            ${doc?.id==param?.documentid&&'bg-white'}
            `}>
                <div className='flex gap-2 items-center'>
                  {!doc.emoji&&  <Image src={'/svg/loopdocument.svg'} width={20} height={20} alt=''/>}
                    <h2 className='flex gap-2'> {doc?.emoji} {doc.documentName}</h2>
                </div>
                <DocumentOptions doc={doc} deleteDocument={(docId)=>DeleteDocument(docId)} />
            </div>
        ))}
    </div>
  )
}

export default DocumentList