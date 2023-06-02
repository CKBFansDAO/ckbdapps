import React, { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import ProjectIconsSVG from '../components/svg/ProjectIconSVG';
import dappListCache from '../utils/cache/dappListCache';

const Home = () => {

    const [t] = useTranslation()
    const [dappLogos, setDappLogos] = useState([]);

    useEffect(() => {
        const fetchDappLogos = async () => {
            const logos = await dappListCache.getDappLogos();
            setDappLogos(logos);
        };

        fetchDappLogos();
    }, []);

    document.title = t('page-title.home');
    return (
        <div className='flex flex-col '>
            <div className='-mx-3 md:-mx-7 -mt-3 md:-mt-7'>
                <ProjectIconsSVG icons={dappLogos} />
            </div>

        </div>
    )
}

export default Home
