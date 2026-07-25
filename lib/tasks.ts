import { supabase } from "@/lib/supabase";
import type { NewTask, Task } from "@/types/tasks";

export async function getTasks(): Promise<Task[]> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if(userError) {
        throw new Error(userError.message);
    }

    if (!user) {
        throw new Error("You must be logged in to view tasks.");
    }

    const { data, error } = await supabase.from("tasks").select("*").eq("user_id", user.id).order("due_date", { ascending: true }).order("created_at", { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return data as Task[] ?? [];
}

export async function createTask(newTask: NewTask): Promise<Task> {
    const { data: { user }, error: userError, } = await supabase.auth.getUser();

    if (userError) {
        throw userError;
    }

    if (!user) {
        throw new Error("You must be logged in to create a task.");
    }

    const { data, error } = await supabase.from("tasks").insert({
        user_id: user.id,
        subject: newTask.subject,
        title: newTask.title,
        description: newTask.description,
        due_date: newTask.due_date,
        priority: newTask.priority,
        difficulty: newTask.difficulty,
        completed: false,
        completed_date: null,
    }).select().single();

    if(error) {
        throw error;
    }

    return data as Task;
}

export async function updateTask(taskId: string, updatedTask: NewTask): Promise<Task> {
    const { data: { user }, error: userError, } = await supabase.auth.getUser();

    if (userError) {
        throw userError;
    }

    if (!user) {
        throw new Error("You must be logged in to update a task.");
    }

    const { data, error } = await supabase.from("tasks").update({
        subject: updatedTask.subject,
        title: updatedTask.title,
        description: updatedTask.description,
        due_date: updatedTask.due_date,
        priority: updatedTask.priority,
        difficulty: updatedTask.difficulty,
    }).eq("id", taskId).eq("user_id", user.id).select("*").single();

    if (error) {
        throw error;
    }

    return data as Task;
}

export async function deleteTask(taskId: string): Promise<void> {
    const { data: { user }, error: userError, } = await supabase.auth.getUser();

    if (userError) {
        throw userError;
    }

    if (!user) {
        throw new Error("You must be logged in to update a task.");
    }

    const { error } = await supabase.from("tasks").delete().eq("id", taskId).eq("user_id", user.id);

    if(error) {
        throw error;
    }
}

export async function setTaskCompleted(taskId: string, completed: boolean): Promise<Task> {
    const { data: { user }, error: userError, } = await supabase.auth.getUser();

    if (userError) {
        throw userError;
    }

    if (!user) {
        throw new Error("You must be logged in to update a task.");
    }

    const completedDate = completed ? new Date().toISOString() : null;
    const { data, error } = await supabase.from("tasks").update({
        completed,
        completed_date: completedDate,
    }).eq("id", taskId).eq("user_id", user.id).select("*").single();

    if(error) {
        throw error;
    }

    return data as Task;
}