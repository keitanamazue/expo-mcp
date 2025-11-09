import { loadTasks, saveTasks } from "@/storage/tasks-storage";
import type { Task, TaskDraft, TaskStatus, TaskUpdate } from "@/types/task";
import { nanoid } from "nanoid/non-secure";
import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
} from "react";

type TasksState = {
    tasks: Task[];
    isHydrated: boolean;
    isLoading: boolean;
};

type TasksAction =
    | { type: "HYDRATE"; payload: Task[] }
    | { type: "ADD"; payload: Task }
    | { type: "UPDATE"; payload: { id: string; updates: TaskUpdate } }
    | { type: "DELETE"; payload: { id: string } }
    | { type: "TOGGLE"; payload: { id: string } }
    | { type: "CLEAR_COMPLETED" };

const initialState: TasksState = {
    tasks: [],
    isHydrated: false,
    isLoading: true,
};

const applyStatusMutation = (
    task: Task,
    status: TaskStatus,
    timestamp: string,
): Task => {
    if (status === "completed") {
        return {
            ...task,
            status,
            updatedAt: timestamp,
            completedAt: timestamp,
        };
    }

    return {
        ...task,
        status,
        updatedAt: timestamp,
        completedAt: null,
    };
};

const tasksReducer = (state: TasksState, action: TasksAction): TasksState => {
    switch (action.type) {
        case "HYDRATE":
            return {
                tasks: action.payload,
                isHydrated: true,
                isLoading: false,
            };
        case "ADD":
            return {
                ...state,
                tasks: [action.payload, ...state.tasks],
            };
        case "UPDATE": {
            const timestamp = new Date().toISOString();
            return {
                ...state,
                tasks: state.tasks.map((task) => {
                    if (task.id !== action.payload.id) return task;

                    const { updates } = action.payload;
                    let nextTask: Task = {
                        ...task,
                        updatedAt: timestamp,
                    };

                    if (updates.status && updates.status !== task.status) {
                        nextTask = applyStatusMutation(nextTask, updates.status, timestamp);
                    }

                    if (updates.title !== undefined) {
                        nextTask = {
                            ...nextTask,
                            title: updates.title,
                        };
                    }

                    if (updates.description !== undefined) {
                        nextTask = {
                            ...nextTask,
                            description: updates.description,
                        };
                    }

                    return nextTask;
                }),
            };
        }
        case "DELETE":
            return {
                ...state,
                tasks: state.tasks.filter((task) => task.id !== action.payload.id),
            };
        case "TOGGLE": {
            const timestamp = new Date().toISOString();
            return {
                ...state,
                tasks: state.tasks.map((task) => {
                    if (task.id !== action.payload.id) return task;
                    const nextStatus: TaskStatus =
                        task.status === "completed" ? "active" : "completed";
                    return applyStatusMutation(task, nextStatus, timestamp);
                }),
            };
        }
        case "CLEAR_COMPLETED":
            return {
                ...state,
                tasks: state.tasks.filter((task) => task.status !== "completed"),
            };
        default:
            return state;
    }
};

type TasksContextValue = {
    tasks: Task[];
    activeTasks: Task[];
    completedTasks: Task[];
    isHydrated: boolean;
    isLoading: boolean;
    addTask: (draft: TaskDraft) => Task | null;
    updateTask: (id: string, updates: TaskUpdate) => boolean;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;
    clearCompleted: () => void;
};

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

const sanitizeDraft = (draft: TaskDraft): TaskDraft | null => {
    const title = draft.title?.trim() ?? "";
    if (!title) return null;

    const description = draft.description?.trim();

    return {
        title,
        description: description ? description : undefined,
    };
};

const sanitizeUpdates = (updates: TaskUpdate): TaskUpdate => {
    const sanitized: TaskUpdate = {};

    if (updates.title !== undefined) {
        const nextTitle = updates.title.trim();
        if (nextTitle.length > 0) {
            sanitized.title = nextTitle;
        }
    }

    if (updates.description !== undefined) {
        const nextDescription = updates.description.trim();
        sanitized.description =
            nextDescription.length > 0 ? nextDescription : undefined;
    }

    if (updates.status) {
        sanitized.status = updates.status;
    }

    return sanitized;
};

export function TasksProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(tasksReducer, initialState);

    useEffect(() => {
        let isMounted = true;

        (async () => {
            const tasks = await loadTasks();
            if (!isMounted) return;
            dispatch({ type: "HYDRATE", payload: tasks });
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!state.isHydrated) return;
        void saveTasks(state.tasks);
    }, [state.tasks, state.isHydrated]);

    const addTask = useCallback((draft: TaskDraft) => {
        const sanitizedDraft = sanitizeDraft(draft);
        if (!sanitizedDraft) return null;

        const timestamp = new Date().toISOString();
        const task: Task = {
            id: nanoid(),
            title: sanitizedDraft.title,
            description: sanitizedDraft.description,
            status: "active",
            createdAt: timestamp,
            updatedAt: timestamp,
            completedAt: null,
        };

        dispatch({ type: "ADD", payload: task });
        return task;
    }, []);

    const updateTask = useCallback((id: string, updates: TaskUpdate) => {
        const sanitized = sanitizeUpdates(updates);
        if (Object.keys(sanitized).length === 0) {
            return false;
        }

        dispatch({ type: "UPDATE", payload: { id, updates: sanitized } });
        return true;
    }, []);

    const toggleTask = useCallback((id: string) => {
        dispatch({ type: "TOGGLE", payload: { id } });
    }, []);

    const deleteTask = useCallback((id: string) => {
        dispatch({ type: "DELETE", payload: { id } });
    }, []);

    const clearCompleted = useCallback(() => {
        dispatch({ type: "CLEAR_COMPLETED" });
    }, []);

    const value = useMemo<TasksContextValue>(() => {
        const activeTasks = state.tasks.filter((task) => task.status === "active");
        const completedTasks = state.tasks.filter(
            (task) => task.status === "completed",
        );

        return {
            tasks: state.tasks,
            activeTasks,
            completedTasks,
            isHydrated: state.isHydrated,
            isLoading: state.isLoading,
            addTask,
            updateTask,
            toggleTask,
            deleteTask,
            clearCompleted,
        };
    }, [state, addTask, updateTask, toggleTask, deleteTask, clearCompleted]);

    return (
        <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
    );
}

export const useTasksContext = () => {
    const context = useContext(TasksContext);
    if (!context) {
        throw new Error("useTasksContext must be used within a TasksProvider");
    }

    return context;
};
