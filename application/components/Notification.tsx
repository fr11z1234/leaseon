'use client';
import EventEmitter from '@/EventEmitter';
import React, { useEffect, useState } from 'react';

export default () => {

    const [text, setText] = useState('');
    const [show, setShow] = useState(false);

    useEffect(() => {
        EventEmitter.on('notify', e => {
            setText(e);
            setShow(true);
            window.setTimeout(() => {
                setShow(false)
                window.setTimeout(() => {
                    setText('');
                }, 200)
            }, 6000);
        });
    }, []);

    return (
        <div className={'flex px-5 py-2.5 min-w-[200px] bg-white fixed right-5 bottom-5 rounded shadow border border-gray-200 transition-all ' + (!show ? 'right-[-300px]' : '')}>
            <div className='absolute w-1.5 h-full bg-blue-500 rounded-l left-0 top-0 max-2-[250px]'></div>
            <p className='text-sm'>{text}</p>
        </div>
    );
};
