import React, {useEffect} from 'react'

import { useTranslation } from 'react-i18next';


const Footer = (props) => {

    const [t] = useTranslation();

    const footer_res_config = [
        {
            display_name:"footer.feedback",
            link:"https://talk.nervos.org"
        },
        {
            display_name:"footer.followus",
            link:"https://twitter.com/@ckbmeta"
        }
    ]

    useEffect(() => {

    }, []);

    return (<div className='flex flex-col place-content-center gap-4'>
                <span className='border-[0.1px] seperator'></span>
                <div className=' text-sm px-3 flex items-center justify-center'>
                    {
                        footer_res_config.map((item, index) => {
                            return <a key={index} className=' text-sm px-3 py-5' href={item.link} rel="noopener noreferrer" target="_blank">
                            {t(item.display_name)}
                            </a>
                        })
                    }
                </div>
                
                <div className=' text-sm px-3 py-5 flex items-center justify-center'>
                © 2023 ckbdapps.com All rights reserved
                </div>
            </div>
    )
}

export default Footer