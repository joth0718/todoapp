import React, { useState } from 'react'
import Constants from '../utilities/Constants'


export default function UpdateTaskForm(props: any) {

    const initialFormData = Object.freeze({
        description: props.task.description,
        status: props.task.currentStatus
    });

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e: React.BaseSyntheticEvent) => {
        setFormData({
            ...formData,
            "description": e.target.value
        });
    }

    const handleSubmit = (e: React.BaseSyntheticEvent) => {
        e.preventDefault();

        const taskToUpdate = {
            TodoItemId: props.task.todoItemId,
            description: formData.description,
            TodoStatus: 0
        };

        const url = Constants.API_URL_UPDATE_TASK;

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskToUpdate)
        })
            .then(response => response.json())
            .then(responseFromServer => {
                console.log(responseFromServer);
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });

        props.onTaskUpdated(taskToUpdate);
    }

    return (
        <div>
            <form className='w-100 px-5'>
                <h1 className='mt-5'>Update Todo "{props.task.description}".</h1>
                <div className='mt-5'>
                    <label className='h3 form-label'>Todo description</label>
                    <input value={formData.description} name="description" type="text" className='form-control' onChange={handleChange} />
                </div>
                <button onClick={handleSubmit} className="btn btn-dark btn-lg w-100 mt-5">Submit</button>
                <button onClick={() => props.onTaskUpdated(null)} className="btn btn-secondary btn-lg w-100 mt-3">Cancel</button>
            </form>
        </div>
    )
}
