import React from 'react'

import { Route, Routes, Navigate } from 'react-router-dom'

import Home from '../pages/Home'
import Halving from '../pages/Halving'
import NotFound from '../pages/NotFound'
import Ecosystem from '../pages/Ecosystem'
import Events from '../pages/Events'


const PageRoutes = () => {
    return (
        <Routes>
            <Route path='/' exact element={<Home />}/>
            <Route path='/home' element={<Home />}/>
            <Route path='/ecosystem' element={<Ecosystem/>} />
            <Route path='/halving' element={<Halving/>} />
            <Route path='/events' element={<Events/>} />
            <Route path="/404" element={<NotFound />}/>
            <Route path='*' exact element={<NotFound />}/>
        </Routes>
    )
}

export default PageRoutes
