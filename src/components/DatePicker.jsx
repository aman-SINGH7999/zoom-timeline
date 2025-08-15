import React, { useCallback, useEffect, useState } from 'react'
import './DatePicker.css';

export default function DatePicker({setDateArray}) {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');


    const getDatesInRange = useCallback((start, end) => {
        const dateArray = [];
        let currentDate = new Date(start);
        const endDate = new Date(end);

        while (currentDate <= endDate) {
            let times = [];
            for(let i=0; i<24; i++){
                times.push(Math.ceil(Math.random()*5));
            }
            dateArray.push({day : new Date(currentDate), time : times});
            currentDate.setDate(currentDate.getDate() + 1);
        }

        setDateArray(dateArray);
    }, [setDateArray]);


    useEffect(()=>{
        if (!fromDate || !toDate) return; 
        if (new Date(fromDate) > new Date(toDate)) return; 

        getDatesInRange(fromDate, toDate);

    }, [fromDate,toDate])


  return (
    <div className="date-picker-container">
        {/* <label htmlFor="from-date">From</label> */}
        <input
            id='from-date'
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
        />
        <label htmlFor="to-date">To</label>
        <input
            id='to-date'
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
        />
    </div>
  )
}

