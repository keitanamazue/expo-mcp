export type TaskStatus = "active" | "completed";

export interface Task {
	id: string;
	title: string;
	description?: string;
	status: TaskStatus;
	createdAt: string;
	updatedAt?: string;
	completedAt?: string | null;
}

export interface TaskDraft {
	title: string;
	description?: string;
}

export type TaskUpdate = Partial<Omit<Task, "id" | "createdAt">>;
