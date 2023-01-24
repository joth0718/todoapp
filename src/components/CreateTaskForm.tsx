import React, { useState } from 'react'
import Constants from '../utilities/Constants'


export default function CreateTaskForm(props: any) {

    const initialFormData = Object.freeze({
        description: "Description for todo Item"
    });

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e: React.BaseSyntheticEvent) => {
        setFormData({
            ...formData,
            "description": e.target.value,
        });
    }

    const handleSubmit = (e: React.BaseSyntheticEvent) => {
        e.preventDefault();

        const taskToCreate = {
            todoItemId: 0,
            description: formData.description,
            todoStatus: 0
        };
        var bodyString = JSON.stringify(taskToCreate);
        const url = Constants.API_URL_CREATE_TASK;

        fetch(url, {
            method: 'POST',
            body: bodyString,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(responseFromServer => {
                console.log(responseFromServer);
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });

        props.onTaskCreated(taskToCreate);
    };

    return (
        <div>
            <form className='w-100 px-5'>
                <h1 className='mt-5'>Create new Todo</h1>
                <div className='mt-4'>
                    <label className='h3 form-label'>Task Description</label>
                    <input value={formData.description} name="description" type="text" className='form-control' onChange={handleChange} />
                </div>
                <button onClick={handleSubmit} className="btn btn-dark btn-lg w-100 mt-5">Submit</button>
                <button onClick={() => props.onTaskCreated(null)} className="btn btn-secondary btn-lg w-100 mt-3">Cancel</button>
            </form>
        </div>
    )
}
