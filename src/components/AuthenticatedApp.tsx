import React, { useEffect, useState } from 'react'
import Constants from '../utilities/Constants';
import CreateTaskForm from "../components/CreateTaskForm";
import UpdateTaskForm from "../components/UpdateTaskForm";
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import 'bootstrap/dist/css/bootstrap.css'

export default function AuthenticatedApp() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [showingCreateNewTaskForm, setShowingCreateNewTaskForm] = useState(false);
    const [taskCurrentlyBeingUpdated, setTaskCurrentlyBeingUpdated] = useState(null);

    useEffect(() => {
        getTasks();
    }, [])

    return (
        <Container className="container">
            <div className="row min-vh-100">
                <div className="col d-flex flex-column justify-content-center align-items-center">
                    {(showingCreateNewTaskForm === false && taskCurrentlyBeingUpdated === null) && (
                        <div><h1>Simple Todo App</h1>
                            <div className="mt-5">
                                <Button onClick={() => setShowingCreateNewTaskForm(true)} className="btn btn-secondary btn-lg w-100 mt-4">Create new Todo</Button>
                            </div>
                        </div>)}

                    {(tasks.length > 0 && showingCreateNewTaskForm === false && taskCurrentlyBeingUpdated === null) && renderTasksTable()}
                    {showingCreateNewTaskForm && <CreateTaskForm onTaskCreated={onTaskCreated} />}
                    {taskCurrentlyBeingUpdated !== null && <UpdateTaskForm task={taskCurrentlyBeingUpdated} onTaskUpdated={onTaskUpdated} />}
                </div>
            </div>
        </Container>
    );

    function getTasks() {
        const url = Constants.API_URL_GET_ALL_TASKS;

        fetch(url, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(tasksFromServer => {
                console.log(tasksFromServer);
                setTasks(tasksFromServer);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function deleteTask(todoItemId: any) {
        const url = `${Constants.API_URL_DELETE_TASK_BY_ID}/${todoItemId}`;

        fetch(url, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(responseFromServer => {
                console.log(responseFromServer);
                onTaskDeleted(todoItemId);
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function renderTasksTable() {
        return (
            <div className="table-responsive mt-5">

                <table className="table table-bordered border-dark">
                    <thead>
                        <tr>
                            <th scope="col">Todo Item Id</th>
                            <th scope="col">Description</th>
                            <th scope="col">Status</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.todoItemId}>
                                <td>{task.todoItemId}</td>
                                <td>{task.description}</td>
                                <td>{task.todoStatus}</td>
                                <td>
                                    <button onClick={() => setTaskCurrentlyBeingUpdated(task)} className="btn btn-dark btn-lg mx-3 my-3">Update</button>
                                    <button onClick={() => { if (window.confirm(`Are you sure you want to delete "${task.description}"?`)) deleteTask(task.todoItemId) }} className="btn btn-secondary btn-lg">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    function onTaskCreated(createdTask: any) {
        setShowingCreateNewTaskForm(false);
        if (createdTask === null) {
            return;
        } 

        getTasks();
    }

    function onTaskUpdated(updatedTask: any) {
        setTaskCurrentlyBeingUpdated(null);
        if (updatedTask === null) {
            return;
        }

        let tasksCopy = [...tasks];

        const index = tasksCopy.findIndex((taskCopyTask: any, currentIndex: any) => {
            if (taskCopyTask.itemId === updatedTask.itemId) {
                return true;
            }
        });
        if (index !== -1) {
            tasksCopy[index] = updatedTask;
        }
        setTasks(tasksCopy);
    }
    function onTaskDeleted(deletedTaskId: number) {
        let tasksCopy = [...tasks];

        const index = tasksCopy.findIndex((taskCopyTask: any, currentIndex: any) => {
            if (taskCopyTask.itemId === deletedTaskId) {
                return true;
            }
        });
        if (index !== -1) {
            tasksCopy.splice(index, 1);
        }
        setTasks(tasksCopy);

    }
}
