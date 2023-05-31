import React from 'react'
import HalvingContainer from '../components/halving/HalvingContainer'
import MarkdownViewer from '../components/markdownviewer/MarkdownViewer'
import { useSelector } from 'react-redux'

const Halving = () => {

    const langReducer = useSelector((state) => state.langReducer);

    return (
        <div className='flex flex-col'>

            <HalvingContainer />
            {/*
                <div className='flex gap-4 text-blue-600'>
                    <span>{estimatedHalvingTime}</span>
                    <span>{tipHeader.number}</span>
                    <span>{tipHeader.timestamp}</span>
                </div>
                 <div className='h-20 w-full' style={{ backgroundImage: `url('/images/halving_desc_bg.png')` }}>

                </div>
                */

            }

            <div className='bg-white -mx-3 md:-mx-7 py-10 px-5'>
                <MarkdownViewer filePath={`./markdown/halving_${langReducer.language}.md`}></MarkdownViewer>
            </div>

        </div>
    )
}

export default Halving
