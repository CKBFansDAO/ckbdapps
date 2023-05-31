import React, {useRef, useEffect} from 'react'

import './dropdown.css'

const clickOutsideRef = (content_ref, toggle_ref) => {
    document.addEventListener('mousedown', (e) => {
        console.log('mousedown');
        // user click toggle
        if (toggle_ref.current && toggle_ref.current.contains(e.target)) {
            content_ref.current.classList.toggle('active')
        } else {
            // user click outside toggle and content
            if (content_ref.current && !content_ref.current.contains(e.target)) {
                content_ref.current.classList.remove('active')
            }
        }
    })
}

const clearRef = (content_ref, toggle_ref) => {
    document.removeEventListener('mousedown', (e) => {
        if (content_ref.current) {
            content_ref.current.classList.remove('active')
        }
    })
}

const DropdownMenu = props => {

    const dropdown_toggle_el = useRef(null)
    const dropdown_content_el = useRef(null)

    useEffect(() => {
        clickOutsideRef(dropdown_content_el, dropdown_toggle_el);

        return () => {
            clearRef(dropdown_content_el, dropdown_toggle_el);
        };
    }, []);
    
    const onClickMenu = () => {
        if (dropdown_content_el.current) {
            dropdown_content_el.current.classList.remove('active')
        }
    }

    const exClassName = props.className ? props.className : '';
    return (
        <div className={`dropdown `}>
            <button ref={dropdown_toggle_el} className="dropdown__toggle">
                {
                    props.icon ? <i className={props.icon}></i> : ''
                }
                {
                    props.badge ? <span className='dropdown__toggle-badge'>{props.badge}</span> : ''
                }
                {
                    props.customToggle ? props.customToggle() : ''
                }
            </button>
            <div ref={dropdown_content_el} className={`dropdown__content ${exClassName}`} onClick={onClickMenu}>
                {
                    props.contentData && props.renderItems ? props.contentData.map((item, index) => props.renderItems(item, index)) : ''
                }
                {
                    props.renderFooter ? (
                        <div className="dropdown__footer">
                            {props.renderFooter()}
                        </div>
                    ) : ''
                }
            </div>
        </div>
    )
}

export default DropdownMenu
