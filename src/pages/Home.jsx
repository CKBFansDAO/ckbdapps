import React from 'react'

import { useTranslation } from 'react-i18next'
import ProjectIconsSVG from '../components/svg/ProjectIconSVG';

// 项目图标列表，每个图标对应一个链接
const projectIcons = [
    { url: 'project1-url', name:'unipass', icon: 'https://646caaa3c14db509e07445b1--majestic-narwhal-d007bc.netlify.app/dappList/unipass/unipass.ico' },
    { url: 'project2-url', name:'yokaiswap', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/yokaiswap/yokaiswap.webp' },
    { url: 'project3-url', name:'nervape', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/nervape/nervape.jpeg' },
    { url: 'project3-url', name:'ckbull', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/ckbull/ckbull-logo.png' },
    { url: 'project1-url', name:'.bit', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/dotbit/dotbit.svg' },
    { url: 'project1-url', name:'unipass', icon: 'https://646caaa3c14db509e07445b1--majestic-narwhal-d007bc.netlify.app/dappList/unipass/unipass.ico' },
    { url: 'project2-url', name:'yokaiswap', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/yokaiswap/yokaiswap.webp' },
    { url: 'project3-url', name:'nervape', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/nervape/nervape.jpeg' },
    { url: 'project3-url', name:'ckbull', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/ckbull/ckbull-logo.png' },
    { url: 'project1-url', name:'.bit', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/dotbit/dotbit.svg' },
    { url: 'project1-url', name:'unipass', icon: 'https://646caaa3c14db509e07445b1--majestic-narwhal-d007bc.netlify.app/dappList/unipass/unipass.ico' },
    { url: 'project2-url', name:'yokaiswap', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/yokaiswap/yokaiswap.webp' },
    { url: 'project3-url', name:'nervape', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/nervape/nervape.jpeg' },
    { url: 'project3-url', name:'ckbull', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/ckbull/ckbull-logo.png' },
    { url: 'project1-url', name:'.bit', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/dotbit/dotbit.svg' },
    { url: 'project1-url', name:'unipass', icon: 'https://646caaa3c14db509e07445b1--majestic-narwhal-d007bc.netlify.app/dappList/unipass/unipass.ico' },
    { url: 'project2-url', name:'yokaiswap', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/yokaiswap/yokaiswap.webp' },
    { url: 'project3-url', name:'nervape', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/nervape/nervape.jpeg' },
    { url: 'project3-url', name:'ckbull', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/ckbull/ckbull-logo.png' },
    { url: 'project1-url', name:'.bit', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/dotbit/dotbit.svg' },
    { url: 'project1-url', name:'unipass', icon: 'https://646caaa3c14db509e07445b1--majestic-narwhal-d007bc.netlify.app/dappList/unipass/unipass.ico' },
    { url: 'project2-url', name:'joyid', icon: 'https://joy.id/logo.png' },
    { url: 'project3-url', name:'nervape', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/nervape/nervape.jpeg' },
    { url: 'project3-url', name:'ckbull', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/ckbull/ckbull-logo.png' },
    { url: 'project1-url', name:'.bit', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/dotbit/dotbit.svg' },
    { url: 'project1-url', name:'.bit', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/dotbit/dotbit.svg' },
    { url: 'project1-url', name:'unipass', icon: 'https://646caaa3c14db509e07445b1--majestic-narwhal-d007bc.netlify.app/dappList/unipass/unipass.ico' },
    { url: 'project2-url', name:'yokaiswap', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/yokaiswap/yokaiswap.webp' },
    { url: 'project3-url', name:'nervape', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/nervape/nervape.jpeg' },
    { url: 'project3-url', name:'ckbull', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/ckbull/ckbull-logo.png' },
    { url: 'project1-url', name:'.bit', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/dotbit/dotbit.svg' },
    { url: 'project1-url', name:'unipass', icon: 'https://646caaa3c14db509e07445b1--majestic-narwhal-d007bc.netlify.app/dappList/unipass/unipass.ico' },
    { url: 'project2-url', name:'joyid', icon: 'https://joy.id/logo.png' },
    { url: 'project3-url', name:'nervape', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/nervape/nervape.jpeg' },
    { url: 'project3-url', name:'ckbull', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/ckbull/ckbull-logo.png' },
    { url: 'project1-url', name:'.bit', icon: 'https://646cd339d67c2d2ae38e1236--majestic-narwhal-d007bc.netlify.app/dappList/dotbit/dotbit.svg' },
    { url: 'project1-url', name:'daruma', icon: './images/DarumaDAO.png' },

    // 添加更多项目图标...
  ];

const Home = () => {

    const [t] = useTranslation()

    document.title = t('page-title.home');
    return (
        <div className='flex flex-col '>
            <div className='-mx-3 md:-mx-7 -mt-3 md:-mt-7'>
                <ProjectIconsSVG icons={projectIcons}></ProjectIconsSVG>
            </div>
            
            

        </div>
    )
}

export default Home
