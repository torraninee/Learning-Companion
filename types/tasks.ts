export type Task = {
    id: string;
    user_id: string;
    created_at: string;
    subject: string | null;
    title: string;
    description: string | null;
    due_date: string;
    priority: 1 | 2 | 3 | 4 | 5;
    difficulty: 1 | 2 | 3 | 4 | 5;
    completed: boolean;
    completed_date: string | null;
}

export type NewTask = {
    subject: string | null;
    title: string;
    description: string | null;
    due_date: string;
    priority: 1 | 2 | 3 | 4 | 5;
    difficulty: 1 | 2 | 3 | 4 | 5;
}