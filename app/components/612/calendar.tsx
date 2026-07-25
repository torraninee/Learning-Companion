"use client"

import { useEffect, useState } from "react";
import styles from "./calendar.module.css";
import type { Task, NewTask } from "@/types/tasks"
import {getTasks, createTask, updateTask, deleteTask, setTaskCompleted} from "@/lib/tasks"
import TaskPopup from "./task-popup"

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [tasks, setTasks] = useState<Task[]>([])
    const [showTaskPopup, setShowTaskPopup] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const year = currentDate.getFullYear();
    const monthIndex = currentDate.getMonth();
    const monthTitle = currentDate.toLocaleString("default", {month: "long", year: "numeric",})
    const firstDay = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const totalUsedCells = firstDay + daysInMonth;
    const trailingEmptyDays = (7-(totalUsedCells % 7)) % 7;

    useEffect(() => {
        async function loadTasks() {
            try {
                const fetchedTasks = await getTasks();
                setTasks(fetchedTasks);
            } catch (error) {
                console.error("Could not load tasks:", error)
            }
        }
        
        loadTasks();
    }, [])

    async function handleCreateTask(newTask: NewTask) {
        const createdTask = await createTask(newTask);

        setTasks((currentTasks) => [
            ...currentTasks, createdTask,
        ]);
    }

    async function handleUpdateTask(taskId: string, updatedTask: NewTask) {
        const savedTask = await updateTask(taskId, updatedTask);
        
        setTasks((previousTasks) => previousTasks.map((task) => 
        task.id === taskId? savedTask : task));
    }

    async function handleDeleteTask(taskId: string) {
        await deleteTask(taskId);

        setTasks((previousTasks) => previousTasks.filter((task) => task.id !== taskId));
    }

    async function handleSetTaskCompleted(taskId: string, completed: boolean) {
        const updatedTask = await setTaskCompleted(taskId, completed);
        setTasks((previousTasks) => previousTasks.map((task) => task.id === taskId ? updatedTask : task));
    }

    function showPreviousMonth() {
        setCurrentDate(new Date(year, monthIndex-1, 1));
    }

    function showNextMonth() {
        setCurrentDate(new Date(year, monthIndex+1, 1));
    }

    function openTaskPopup(clickedDate: string) {
        setSelectedDate(clickedDate);
        setSelectedTask(null);
        setShowTaskPopup(true);
    }

    function openExistingTask(task: Task) {
        setSelectedTask(task);
        setSelectedDate(task.due_date);
        setShowTaskPopup(true);
    }

    function handleClosePopup() {
        setShowTaskPopup(false);
        setSelectedTask(null);
        setSelectedDate("");
    }

    return(
        <section className={styles.calendar}>
            
            <h1>Calendar</h1>

            <div className={styles.calendarheader}>
                <button type="button" onClick={showPreviousMonth}>←</button>
                <h2>{monthTitle}</h2>
                <button type="button" onClick={showNextMonth}>→</button>
            </div>

            <div className={styles.weekdays}>
                {weekdays.map((weekday) => (
                    <div key={weekday}>{weekday}</div>
                ))}
            </div>

            <div className={styles.calendardays}>
                {Array.from({ length: firstDay }).map((_, index) => (
                    <div key={`empty-${index}`} className={styles.emptyday}/>
                ))}

                {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1;
                    const formattedDate = [year, String(monthIndex + 1).padStart(2, "0"), String(day).padStart(2, "0"),].join("-");
                    const tasksForDay = tasks.filter((task) => {
                        const taskDueDate = task.due_date.split("T")[0];
                        return taskDueDate === formattedDate;
                    })
                    return (
                        <div key={day} className={styles.calendarday} onClick={() => openTaskPopup(formattedDate)} role="button" tabIndex={0}>
                            
                            <span className={styles.daynumber}>{day}</span>

                            <div className={styles.daytasks}>
                                {tasksForDay.map((task) => (
                                    <button key={task.id} type="button" className={styles.calendartask} onClick={(event) => {event.stopPropagation(); openExistingTask(task);}}>
                                        {task.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )
                })}
                {Array.from({ length: trailingEmptyDays }).map((_, index) => (
                    <div key={`trailing-empty-${index}`} className={styles.emptyday}/>
                ))}
            </div>

            {showTaskPopup && (
                <TaskPopup selectedDate={selectedDate} selectedTask={selectedTask} onClose={handleClosePopup} onCreateTask={handleCreateTask} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} onSetTaskCompleted={handleSetTaskCompleted}/>
            )}
        </section>
    )
}