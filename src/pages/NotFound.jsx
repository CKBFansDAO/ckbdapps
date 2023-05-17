import React from 'react'

import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'


const NotFound = () => {

    const [t] = useTranslation()

    return (
        <Navigate to="/" />
    )
}

export default NotFound
