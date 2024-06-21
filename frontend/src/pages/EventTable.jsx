// src/components/EventTable.js

import React, { useState } from "react";
import { useEffect } from "react";
import { BACKEND_URL } from "../constants";
import axios from 'axios'
const EventTable = () => {
    const [events, setEvents] = useState([
        { id: 1, eventName: "Music Festival", startDate: "2023-01-20", endDate: "2023-01-21" },
        { id: 2, eventName: "Food Festival", startDate: "2023-02-01", endDate: "2023-02-02" },
        { id: 3, eventName: "Holiday Party", startDate: "2023-01-20", endDate: "2023-01-21" },
    ]);
    const [refresh, setRefresh] = useState({})
    const [isAdding, setIsAdding] = useState(false);

    const [editRowId, setEditRowId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        eventName: "",
        startDate: "",
        endDate: ""
    });

    const generateRandomId = () => {
        return Math.floor(Math.random() * 1000000);
    };

    const handleAddClick = () => {
        setEditFormData({
            eventName: "",
            startDate: "",
            endDate: "",
        });
        setEditRowId(null);
        setIsAdding(true);
    };

    const handleEditClick = ({ eventData }) => {
        setEditRowId(eventData.id);
        const formValues = {
            eventName: eventData.eventName,
            startDate: eventData.startDate,
            endDate: eventData.endDate
        };
        setEditFormData(formValues);
        setIsAdding(false)
    };

    const handleEditFormChange = (event) => {
        const { name, value } = event.target;

        const newFormData = { ...editFormData };
        newFormData[name] = value;

        setEditFormData(newFormData);
        console.log(newFormData)
    };

    async function handleSaveClick() {
        console.log(editFormData)
        const validation = inputValidation(editFormData);
        if (!validation.isValid) {
            alert(validation.message);
            return;
        }
        if (isAdding) {
            let newEvent = {
                id: generateRandomId(),
                ...editFormData
            };

            let response = await axios.post(`${BACKEND_URL}/events`, newEvent);
        } else {
            let response = await axios.put(`${BACKEND_URL}/events/${editRowId}`, editFormData);
        }
        setRefresh({});
        setEditRowId(null);
        setIsAdding(false);
    }

    const handleCancelClick = () => {
        setEditRowId(null);
        setIsAdding(false);
    };

    function inputValidation(formData) {
        const { eventName, startDate, endDate } = formData;
        if (!eventName || eventName.trim() === "") {
            return { isValid: false, message: "Event name cannot be empty." };
        }
        if (!startDate || isNaN(Date.parse(startDate))) {
            return { isValid: false, message: "Start date is not valid." };
        }
        if (!endDate || isNaN(Date.parse(endDate))) {
            return { isValid: false, message: "End date is not valid." };
        }
        if (new Date(startDate) > new Date(endDate)) {
            return { isValid: false, message: "Start date cannot be after end date." };
        }
        return { isValid: true, message: "" };
    }

    useEffect(() => {
        async function fetchData() {
            console.log('Fetching...')
            let response = await axios.get(`${BACKEND_URL}/events`)
            console.log(response.data)
            setEvents(response.data)
        }
        fetchData()
    }, [refresh])

    async function deleteEvent({ id }) {
        let response = await axios.delete(`${BACKEND_URL}/events/${id}`)
        console.log(response)
    }

    async function deleteHandler({ id }) {
        await deleteEvent({ id })
        setRefresh({})
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
                    {events.map((event, index) => (
                        <div key={event.id} className="font-normal text-base py-2 bg-white col-span-4 grid grid-cols-4 bg-[#e6e2d3]">
                            {editRowId === event.id ? (
                                <>
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
                                </>
                            ) : (
                                <>
                                    <div className="py-2 px-4 bg-[#e6e2d3]">{event.eventName}</div>
                                    <div className="py-2 px-4 bg-[#e6e2d3]">{event.startDate}</div>
                                    <div className="py-2 px-4 bg-[#e6e2d3]">{event.endDate}</div>
                                    <div className="py-2 px-4 bg-[#e6e2d3] flex justify-center space-x-1">
                                        <button
                                            onClick={(e) => handleEditClick({ eventData: event })}
                                            className="bg-[#008cba] py-1 px-2 rounded"
                                        >
                                            <svg className="fill-white w-5 h-5" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                                        </button>
                                        <button onClick={() => deleteHandler({ id: event.id })} className="bg-[#c94c4c] py-1 px-2 rounded">
                                            <svg className="fill-white w-5 h-5" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                    {isAdding && (
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
                        </div>
                    )}

                </div>
            </div>
        </div >
    );
};

export default EventTable;
