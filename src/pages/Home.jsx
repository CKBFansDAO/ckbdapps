import React from 'react'

import { useTranslation } from 'react-i18next'


const Home = () => {

    const [t] = useTranslation()

    document.title = t('page-title.home');
    return (
        <div className='flex flex-col'>
            <div>Home {t('page-title.home')}</div>
            
            Receive, Send

        </div>
    )
}

export default Home
