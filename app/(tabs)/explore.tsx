import { CompletionMeter } from "@/components/swift-ui/completion-meter";
import { TaskEditModal } from "@/components/tasks/task-edit-modal";
import { TaskList } from "@/components/tasks/task-list";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTasks } from "@/hooks/use-tasks";
import { useThemeColor } from "@/hooks/use-theme-color";
import type { Task } from "@/types/task";
import { useMemo, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, View } from "react-native";

export default function SummaryScreen() {
  const { tasks, completedTasks, updateTask, deleteTask, clearCompleted } =
    useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const tintColor = useThemeColor({}, "tint");

  const totalTasks = tasks.length;
  const completionRate =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks.length / totalTasks) * 100);
  const latestCompleted = useMemo(() => {
    if (completedTasks.length === 0) return null;
    return [...completedTasks].sort((a, b) => {
      const aTime = a.completedAt ? Date.parse(a.completedAt) : 0;
      const bTime = b.completedAt ? Date.parse(b.completedAt) : 0;
      return bTime - aTime;
    })[0];
  }, [completedTasks]);

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <ThemedView style={styles.container}>
          <ThemedText type="title">Summary</ThemedText>
          <ThemedText style={styles.subtitle}>
            完了済みのタスクや進捗を振り返りましょう
          </ThemedText>

          <View style={styles.cards}>
            <InsightCard
              label="完了率"
              value={`${completionRate}%`}
              tintColor={tintColor}
              description="全タスクに対する完了割合"
            />
            <InsightCard
              label="完了済み"
              value={`${completedTasks.length}`}
              tintColor={tintColor}
              description="これまでに完了したタスク数"
            />
            <InsightCard
              label="最新の完了"
              value={latestCompleted ? latestCompleted.title : "—"}
              tintColor={tintColor}
              description={
                latestCompleted?.completedAt
                  ? new Date(latestCompleted.completedAt).toLocaleString()
                  : "まだ完了したタスクはありません"
              }
            />
          </View>

          <CompletionMeter completionRate={completionRate} />

          <View style={styles.listHeader}>
            <ThemedText type="subtitle">完了済みタスク</ThemedText>
            {completedTasks.length > 0 ? (
              <Pressable
                accessibilityRole="button"
                onPress={clearCompleted}
                style={styles.clearLinkButton}
              >
                <ThemedText style={styles.clearLink}>
                  完了済みをすべて削除
                </ThemedText>
              </Pressable>
            ) : null}
          </View>

          <View style={styles.listWrapper}>
            <TaskList
              tasks={completedTasks}
              emptyTitle="まだ完了したタスクはありません"
              emptySubtitle="タスクを完了するとここに表示されます。"
              onEditTask={(task) => setEditingTask(task)}
              onDeleteTask={(task) => deleteTask(task.id)}
            />
          </View>
        </ThemedView>
      </SafeAreaView>

      <TaskEditModal
        visible={Boolean(editingTask)}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={updateTask}
        onDelete={(taskId) => deleteTask(taskId)}
      />
    </ThemedView>
  );
}

type InsightCardProps = {
  label: string;
  value: string;
  description: string;
  tintColor: string;
};

const InsightCard = ({
  label,
  value,
  description,
  tintColor,
}: InsightCardProps) => (
  <View style={[styles.card, { borderColor: `${tintColor}33` }]}>
    <ThemedText style={styles.cardLabel}>{label}</ThemedText>
    <ThemedText style={[styles.cardValue, { color: tintColor }]}>
      {value}
    </ThemedText>
    <ThemedText style={styles.cardDescription}>{description}</ThemedText>
  </View>
);

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
  subtitle: {
    opacity: 0.7,
  },
  cards: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    flexBasis: "48%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  cardLabel: {
    fontSize: 13,
    opacity: 0.7,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  cardDescription: {
    fontSize: 12,
    opacity: 0.7,
    lineHeight: 16,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clearLinkButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearLink: {
    color: "#dc2626",
    fontSize: 13,
  },
  listWrapper: {
    flex: 1,
  },
});
