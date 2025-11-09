import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Task } from "@/types/task";

const STORAGE_KEY = "@expo-mcp/tasks/v1";

type PersistedTask = Omit<Task, "status"> & { status: Task["status"] };

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null;

const coerceTask = (value: unknown): Task | null => {
	if (!isRecord(value)) return null;
	const { id, title, status, description, createdAt, updatedAt, completedAt } =
		value;
	if (
		typeof id !== "string" ||
		typeof title !== "string" ||
		typeof createdAt !== "string"
	) {
		return null;
	}

	if (status !== "active" && status !== "completed") {
		return null;
	}

	return {
		id,
		title,
		status,
		description:
			typeof description === "string" && description.length > 0
				? description
				: undefined,
		createdAt,
		updatedAt: typeof updatedAt === "string" ? updatedAt : undefined,
		completedAt: typeof completedAt === "string" ? completedAt : null,
	} satisfies Task;
};

export async function loadTasks(): Promise<Task[]> {
	try {
		const raw = await AsyncStorage.getItem(STORAGE_KEY);
		if (!raw) return [];

		const parsed = JSON.parse(raw) as unknown;
		if (!Array.isArray(parsed)) return [];

		const tasks: Task[] = [];
		for (const item of parsed) {
			const task = coerceTask(item);
			if (task) {
				tasks.push(task);
			}
		}

		return tasks;
	} catch (error) {
		console.warn("[tasks-storage] Failed to load tasks:", error);
		return [];
	}
}

export async function saveTasks(tasks: Task[]): Promise<void> {
	try {
		const payload: PersistedTask[] = tasks.map((task) => ({
			...task,
			description: task.description ?? undefined,
			updatedAt: task.updatedAt ?? undefined,
			completedAt: task.completedAt ?? null,
		}));

		await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
	} catch (error) {
		console.warn("[tasks-storage] Failed to save tasks:", error);
	}
}

export async function clearTasks(): Promise<void> {
	try {
		await AsyncStorage.removeItem(STORAGE_KEY);
	} catch (error) {
		console.warn("[tasks-storage] Failed to clear tasks:", error);
	}
}
