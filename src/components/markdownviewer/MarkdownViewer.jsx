import React, { useEffect, useState } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import 'github-markdown-css';
import './MarkdownViewer.css'

const MarkdownViewer = ({ filePath }) => {

    const [markdownContent, setMarkdownContent] = useState('');
    console.log(filePath);
    useEffect(() => {
        const fetchMarkdown = async () => {
            try {
                const response = await fetch(filePath); // 根据实际文件路径获取 Markdown 文件
                const text = await response.text();
                setMarkdownContent(text);
            } catch (error) {
                console.error('Failed to fetch Markdown file:', error);
            }
        };

        fetchMarkdown();
    }, [filePath]);

    return (<div>
        <div className="markdown-body md:px-10" style={{ backgroundImage: `url('/images/halving_desc_bg.png')` }}>
            <MarkdownPreview source={markdownContent} />
        </div>

    </div>
    );
};

export default MarkdownViewer;