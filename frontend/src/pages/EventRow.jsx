import { useState } from "react"
import axios from 'axios'
// import { BACKEND_URL } from "../constants"
export default function EventRow({ event, setRefresh }) {
    let BACKEND_URL = import.meta.env.VITE_BACKEND_URL
    console.log(BACKEND_URL)
    let { isAdding } = event
    const [isEditing, setIsEditing] = useState(isAdding)
    const [editFormData, setEditFormData] = useState({
        eventName: "",
        startDate: "",
        endDate: ""
    });

    const handleEditClick = ({ eventData }) => {
        // setEditRowId(eventData.id);
        const formValues = {
            eventName: eventData.eventName,
            startDate: eventData.startDate,
            endDate: eventData.endDate
        };
        setEditFormData(formValues);
        setIsEditing(true)
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
        if (isEditing && isAdding) {
            let newEvent = {
                ...editFormData
            };
            let response = await axios.post(`${BACKEND_URL}/events`, newEvent);
            console.log(response)
        } else {
            let response = await axios.put(`${BACKEND_URL}/events/${event.id}`, editFormData);
            console.log(response)
        }
        setRefresh({});
        setIsEditing(false);
    }

    const handleCancelClick = () => {
        // setEditRowId(null);
        setIsEditing(false);
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

    async function deleteEvent({ id }) {
        let response = await axios.delete(`${BACKEND_URL}/events/${id}`)
        console.log(response)
    }

    async function deleteHandler({ id }) {
        await deleteEvent({ id })
        setRefresh({})
    }

    if (!event) {
        return <div>Something wrong</div>
    }
    return (
        <div key={event.id} className="font-normal text-base py-2 bg-white col-span-4 grid grid-cols-4 bg-[#e6e2d3]">
            {isEditing ? (
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
    )
}