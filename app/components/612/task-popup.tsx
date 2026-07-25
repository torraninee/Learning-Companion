"use client";

import { useEffect, useState } from "react";
import type { NewTask, Task } from "@/types/tasks"

type TaskPopupProps = {
    selectedDate: string;
    selectedTask: Task | null;
    onClose: () => void;
    onCreateTask: (newTask: NewTask) => Promise<void>
    onUpdateTask: (taskId: string, updatedTask: NewTask) => Promise<void>
    onDeleteTask: (taskId: string) => Promise<void>;
    onSetTaskCompleted: (taskId: string, completed: boolean) => Promise<void>
}
export default function TaskPopup({
    selectedDate,
    selectedTask,
    onClose,
    onCreateTask,
    onUpdateTask,
    onDeleteTask,
    onSetTaskCompleted,
}: TaskPopupProps) {
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<NewTask["priority"]>(3);
    const [difficulty, setDifficulty] = useState<NewTask["difficulty"]>(3);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const isEditing = selectedTask !== null;

    useEffect(() => {
        if (selectedTask) {
        setTitle(selectedTask.title);
        setSubject(selectedTask.subject ?? "");
        setDescription(selectedTask.description ?? "");
        setPriority(selectedTask.priority);
        setDifficulty(selectedTask.difficulty);
        } else {
            setTitle("");
            setSubject("");
            setDescription("");
            setPriority(3);
            setDifficulty(3);
        }

        setErrorMessage("");
    }, [selectedTask, selectedDate]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmedTitle = title.trim();
        const trimmedSubject = subject.trim();
        const trimmedDescription = description.trim();

        if(!trimmedTitle) {
            setErrorMessage("Please enter a task title.");
            return;
        }

        const taskData: NewTask = {
            title: trimmedTitle,
            subject: trimmedSubject,
            description: trimmedDescription || null,
            due_date: selectedDate,
            priority,
            difficulty,
        };

        setErrorMessage("");
        setIsSubmitting(true);

        try {
            if (selectedTask) {
                await onUpdateTask(selectedTask.id, taskData);
            } else {
                await onCreateTask(taskData);
            }

            onClose();
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("The task could not be saved.");
                console.error(error)
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete() {
        if (!selectedTask) {
            return;
        }

        setErrorMessage("");
        setIsDeleting(true);

        try {
            await onDeleteTask(selectedTask.id);
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("The task could not be deleted.")
            }
        } finally {
            setIsDeleting(false);
        } 
    }

    async function handleCompletedChange() {
        if(!selectedTask) {
            return;
        }

        setErrorMessage("");

        try {
            await onSetTaskCompleted(selectedTask.id, !selectedTask.completed)
            onClose()
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("The task status could not be changed.");
            }
        }
    }

    return (
        <div className="task-popup-background" onClick={onClose}>
            <div className="task-popup" onClick={(event) => event.stopPropagation()}>
                <button type="button" className="close-pop-up-button" onClick={onClose} aria-label="Close Task">x</button>
                <h2> {isEditing ? "View or Edit Task" : "Add Task"}</h2>

                <p className="selected-date"> Due date: {selectedDate}</p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="task-title">Task Title</label>
                    <input id="task-title" type="text" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="ie. Biology Presentation"/>

                    <label htmlFor="task-subject">Subject</label>
                    <input id="task-subject" type="text" value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="ie. AP Calculus BC"/>
                    
                    <label htmlFor="task-description">Description</label>
                    <textarea id="text-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add Instructions or Notes"/>
                    
                    <label htmlFor="task-priority">Priority</label>
                    <select id="task-priority" value={priority} onChange={(event) => setPriority(Number(event.target.value) as NewTask["priority"])}>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                    </select>

                    <label htmlFor="task-difficulty">Difficulty</label>
                    <select id="task-difficulty" value={difficulty} onChange={(event) => setDifficulty(Number(event.target.value) as NewTask["difficulty"])}>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                    </select>

                    {errorMessage && (
                        <p className="task-error">{errorMessage}</p>
                    )}

                    <div className="task-popup-actions">
                        <button type="submit" disabled={isSubmitting || isDeleting}>{isSubmitting ? "Saving..." : isEditing ? "Update Task" : "Add Task" }</button>
                        {selectedTask && (
                            <>
                                <button type="button" className="complete-task-button" onClick={handleCompletedChange} disabled={isSubmitting || isDeleting}>{selectedTask.completed ? "Mark Incomplete" : "Mark Complete" }</button>
                                <button type="button" className="delete-task-button" onClick={handleDelete} disabled={isSubmitting || isDeleting}>{isDeleting ? "Deleting..." : "Delete Task"}</button>















































                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}