import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";

import { TaskComposer } from "@/components/tasks/task-composer";
import { TaskEditModal } from "@/components/tasks/task-edit-modal";
import { TaskList } from "@/components/tasks/task-list";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTasks } from "@/hooks/use-tasks";
import { useThemeColor } from "@/hooks/use-theme-color";
import type { Task, TaskDraft } from "@/types/task";

export type TaskFilter = "all" | "active" | "completed";

const filterLabels: Record<TaskFilter, string> = {
  all: "すべて",
  active: "未完了",
  completed: "完了",
};

export default function TasksScreen() {
  const {
    tasks,
    activeTasks,
    completedTasks,
    addTask,
    updateTask,
    deleteTask,
    clearCompleted,
    isHydrated,
    isLoading,
  } = useTasks();
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const tintColor = useThemeColor({}, "tint");

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "active":
        return activeTasks;
      case "completed":
        return completedTasks;
      default:
        return tasks;
    }
  }, [filter, tasks, activeTasks, completedTasks]);

  const emptyState = useMemo(() => {
    if (!isHydrated || isLoading) {
      return {
        title: "タスクを読み込んでいます",
        subtitle: "まもなくリストが表示されます…",
      };
    }

    if (filter === "active") {
      return {
        title: "未完了のタスクはありません",
        subtitle: "新しいタスクを追加してみましょう。",
      };
    }

    if (filter === "completed") {
      return {
        title: "完了済みタスクはありません",
        subtitle: "タスクを完了するとこちらに表示されます。",
      };
    }

    return {
      title: "まだタスクがありません",
      subtitle: "今日のタスクを追加してスタートしましょう。",
    };
  }, [filter, isHydrated, isLoading]);

  const handleCreateTask = useCallback(
    (draft: TaskDraft) => {
      const created = addTask(draft);
      return Boolean(created);
    },
    [addTask],
  );

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
  }, []);

  const handleDeleteTask = useCallback(
    (task: Task) => {
      deleteTask(task.id);
    },
    [deleteTask],
  );

  const handleClearCompleted = useCallback(() => {
    clearCompleted();
  }, [clearCompleted]);

  const handleCloseModal = useCallback(() => {
    setEditingTask(null);
  }, []);

  const isComposerDisabled = !isHydrated || isLoading;

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <View>
              <ThemedText type="title">My Tasks</ThemedText>
              <ThemedText style={styles.subtitle}>
                今日もやりたいことを片付けましょう
              </ThemedText>
            </View>
            <View style={styles.counters}>
              <Counter
                label="未完了"
                value={activeTasks.length}
                tintColor={tintColor}
              />
              <Counter
                label="完了"
                value={completedTasks.length}
                tintColor={tintColor}
              />
            </View>
          </View>

          <TaskComposer
            onCreate={handleCreateTask}
            isDisabled={isComposerDisabled}
          />

          <View style={styles.filterRow}>
            <FilterChips current={filter} onChange={setFilter} />
            {completedTasks.length > 0 ? (
              <Pressable
                accessibilityRole="button"
                onPress={handleClearCompleted}
                style={styles.clearButton}
              >
                <ThemedText type="link">完了済みを削除</ThemedText>
              </Pressable>
            ) : null}
          </View>

          <View style={styles.listWrapper}>
            {isHydrated ? (
              <TaskList
                tasks={filteredTasks}
                emptyTitle={emptyState.title}
                emptySubtitle={emptyState.subtitle}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                isRefreshing={isLoading}
              />
            ) : (
              <View style={styles.loadingState}>
                <ActivityIndicator size="large" color={tintColor} />
                <ThemedText style={styles.loadingText}>
                  タスクを復元中…
                </ThemedText>
              </View>
            )}
          </View>
        </ThemedView>
      </SafeAreaView>

      <TaskEditModal
        visible={Boolean(editingTask)}
        task={editingTask}
        onClose={handleCloseModal}
        onSubmit={updateTask}
        onDelete={(taskId) => deleteTask(taskId)}
      />
    </ThemedView>
  );
}

type CounterProps = {
  label: string;
  value: number;
  tintColor: string;
};

const Counter = ({ label, value, tintColor }: CounterProps) => (
  <View style={[styles.counter, { borderColor: `${tintColor}40` }]}>
    <ThemedText style={styles.counterLabel}>{label}</ThemedText>
    <ThemedText style={[styles.counterValue, { color: tintColor }]}>
      {value}
    </ThemedText>
  </View>
);

type FilterChipsProps = {
  current: TaskFilter;
  onChange: (filter: TaskFilter) => void;
};

const FilterChips = ({ current, onChange }: FilterChipsProps) => {
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

  return (
    <View style={styles.filterChips}>
      {(Object.keys(filterLabels) as TaskFilter[]).map((value) => {
        const isActive = current === value;
        return (
          <Pressable
            key={value}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(value)}
            style={[
              styles.chip,
              isActive
                ? { backgroundColor: tintColor }
                : { borderColor: `${tintColor}40` },
            ]}
          >
            <ThemedText
              style={[
                styles.chipLabel,
                { color: isActive ? "#fff" : textColor },
              ]}
            >
              {filterLabels[value]}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 4,
  },
  counters: {
    flexDirection: "row",
    gap: 12,
  },
  counter: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    minWidth: 80,
  },
  counterLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  counterValue: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterChips: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  chipLabel: {
    fontWeight: "600",
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  listWrapper: {
    flex: 1,
  },
  loadingState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    opacity: 0.7,
  },
});
