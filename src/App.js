import React, { useState } from 'react'
import DatePicker from './components/DatePicker'
import './App.css'
import ShowTimeline from './components/ShowTimeline'


export default function App() {
  const [dateArray, setDateArray] = useState([]);
  return (
    <div className='app'>
      <h1>Activity Log</h1>
      <DatePicker setDateArray={setDateArray} />
      <ShowTimeline dateArray={dateArray} />
    </div>
  )
}
