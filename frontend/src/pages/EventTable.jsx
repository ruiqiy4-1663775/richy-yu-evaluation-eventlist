// src/components/EventTable.js

import React, { useState } from "react";
import { useEffect } from "react";
import { BACKEND_URL } from "../constants";
import axios from 'axios'
import EventRow from "./EventRow";

/* 
event = {
Adding
}

*/
const EventTable = () => {
    const [events, setEvents] = useState([]);
    const [refresh, setRefresh] = useState({})


    const [loading, setLoading] = useState(true)

    // const [editRowId, setEditRowId] = useState(null);
    // const [editFormData, setEditFormData] = useState({
    //     eventName: "",
    //     startDate: "",
    //     endDate: ""
    // });

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                console.log('Fetching...')
                let response = await axios.get(`${BACKEND_URL}/events`)
                console.log(response.data)
                setEvents(response.data)
                setLoading(false)
            } catch (err) {
            }
        }
        fetchData()
    }, [refresh])

    const handleAddClick = () => {
        // setEditRowId(null);
        setEvents([...events, { isAdding: true }])
        // setIsAdding([...isAdding, true]);
    };



    if (loading) {
        return (
            <div className="h-screen flex justify-between">loading....</div>
        )
    }

    return (
        <div className="w-full mx-auto mt-10 flex flex-col items-center">
            <button onClick={handleAddClick} className=" bg-cyan-600 text-white hover:brightness-110 font-light py-2 px-4 rounded mb-4">
                Add New Event
            </button>
            <div className="overflow-x-auto w-1/2 ">
                <div className="min-w-full bg-white border-4 border-[#e6e2d3] grid grid-cols-4 
                *:text-center px-5 ">
                    <div className="py-2 px-4  font-bold text-lg border-gray-200 text-left text-black">Event</div>
                    <div className="py-2 px-4 font-bold text-lg border-gray-200 text-left text-black">Start</div>
                    <div className="py-2 px-4 font-bold text-lg border-gray-200 text-left text-black">End</div>
                    <div className="py-2 px-4 font-bold text-lg border-gray-200 text-left text-black">Actions</div>
                    
                    {events.map((event) => (
                        <EventRow event={event} key={event.id} setRefresh={setRefresh} />
                    ))}
                    {/* {isAddingArr.map((isAdding, index) => 
                        <div className="font-normal text-base py-2 bg-white col-span-4 grid grid-cols-4 bg-[#e6e2d3]">
                        <div className="bg-[#e6e2d3] px-3 py-2">
                            <input
                                type="text"
                                required="required"
                                placeholder="Enter event name"
                                name="eventName"
                                value={editFormData.eventName}
                                onChange={handleEditFormChange}
                                className="py-2 px-4 bg-white outline-none rounded"
                            />
                        </div>
                        <div className="bg-[#e6e2d3] px-3 py-2">
                            <input
                                type="date"
                                required="required"
                                placeholder="Enter start date"
                                name="startDate"
                                value={editFormData.startDate}
                                onChange={handleEditFormChange}
                                className="py-2 px-4 bg-white rounded outline-none"
                            />
                        </div>
                        <div className="bg-[#e6e2d3] px-3 py-2">
                            <input
                                type="date"
                                required="required"
                                placeholder="Enter end date"
                                name="endDate"
                                value={editFormData.endDate}
                                onChange={handleEditFormChange}
                                className="py-2 px-4 bg-white rounded outline-none"
                            />
                        </div>
                        <div className="bg-[#e6e2d3] px-3 py-2">
                            <div className="py-2 px-4 bg-[#e6e2d3] flex justify-center space-x-1">
                                <button onClick={handleSaveClick} className="bg-[#008cba] py-1 px-2 rounded">
                                    <svg className="fill-white w-5 h-5" focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z" /></svg>
                                </button>
                                <button onClick={handleCancelClick} className="bg-[#c94c4c] py-1 px-2 rounded">
                                    <svg className="fill-white w-5 h-5" focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>)} */}

                </div>
            </div>
        </div >
    );
};

export default EventTable;
