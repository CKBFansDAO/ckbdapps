import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'
import { currentLanguage } from '../../utils/i18n';
import './TimeLine.css'

const TimeLine = ({ eventConfig }) => {
    const [t] = useTranslation();

    useEffect(() => {

    }, []);

    return (
        <div className="mt-10 w-full timeline">
		<ul>
			<li>
				<span>3rd January 2020</span>
				<div className="content">
					<h3>What Is Lorem Ipsum?</h3>
					<p>
						Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
					</p>
				</div>
			</li>
			<li>
				<span>21st Jun 2019</span>
				<div className="content">
					<h3>What Is Lorem Ipsum?</h3>
					<p>
						Lorem Ipsum is simply dummy text of the printing and typesetting industry.
					</p>
				</div>
			</li>
			<li>
				<span>15th April 2018</span>
				<div className="content">
					<h3>What Is Lorem Ipsum?</h3>
					<p>
						Lorem Ipsum is simply dummy text of the printing and typesetting industry.
					</p>
				</div>
			</li>
			<li>
				<span>22nd Mars 2017</span>
				<div className="content">
					<h3>What Is Lorem Ipsum?</h3>
					<p>
						Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.
					</p>
				</div>
			</li>
		</ul>
	</div>
    );

}

export { TimeLine }