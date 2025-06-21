import React, { useEffect } from 'react'

import { useTranslation } from 'react-i18next';
import { currentLanguage } from '../../utils/i18n';
import community_link from '../../assets/JsonData/hyper_link.json'


const Footer = (props) => {

    const [t] = useTranslation();

    const footer_res_config = [
        /*{
            display_name: "footer.feedback",
            link: "https://talk.nervos.org/t/dis-ckbfans-ckbdapps-com-ckbfans-community-grant-proposal-ckbdapps-com/7004/29"
        },*/
        {
            display_name: "footer.followus",
            class_name:'',
            link: "https://twitter.com/@CKB_CN"
        },
        {
            display_name: "footer.submit-dapp",
            class_name:'opacity-90 flex items-center rounded-full px-3 py-1 text-white font-bold hover:text-black bg-[#F56100]',
            link: "https://github.com/CKBFansDAO/ckbdapps/issues"
        }/*,
        {
            display_name: "footer.submit-event",
            class_name:'opacity-90 flex items-center rounded-full px-3 py-1 text-white font-bold hover:text-black bg-[#28C1B0]',
            link:"https://forms.gle/JV4MW6CFT4zgTVCX7"
        }*/
    ]

    useEffect(() => {

    }, []);

    return (
        <div className='w-full bg-[#232325] py-8'>
            <div className='text-lg px-3 flex items-center justify-center'>
                <a className='text-lg px-3 py-5' href={community_link.community[currentLanguage()].feedback.link} rel="noopener noreferrer" target="_blank">
                {community_link.community[currentLanguage()].feedback.name}
            </a>
            {
                footer_res_config.map((item, index) => {
                        return <a key={index} className={`text-lg px-3 py-5`} href={item.link} rel="noopener noreferrer" target="_blank">
                        <span className={item.class_name}>{t(item.display_name)}</span>
                    </a>
                })
            }
        </div>
            <div className='text-xl px-3 py-5 flex items-center justify-center'>
            © 2023 - {new Date().getFullYear()} ckbdapps.com All rights reserved
        </div>
    </div>
    )
}

export default Footer
