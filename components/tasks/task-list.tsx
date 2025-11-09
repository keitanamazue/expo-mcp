import { FlatList, ListRenderItemInfo, RefreshControl, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTasks } from '@/hooks/use-tasks';
import type { Task } from '@/types/task';

import { TaskItem } from './task-item';

type TaskListProps = {
  tasks: Task[];
  emptyTitle: string;
  emptySubtitle?: string;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
};

export function TaskList({
  tasks,
  emptyTitle,
  emptySubtitle,
  onEditTask,
  onDeleteTask,
  onRefresh,
  isRefreshing = false,
}: TaskListProps) {
  const { toggleTask } = useTasks();

  const renderItem = ({ item }: ListRenderItemInfo<Task>) => (
    <TaskItem task={item} onToggle={toggleTask} onEdit={onEditTask} onDelete={onDeleteTask} />
  );

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={renderItem}
      ListEmptyComponent={<EmptyState title={emptyTitle} subtitle={emptySubtitle} />}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh
          ? (
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
              />
            )
          : undefined
      }
    />
  );
}

const ItemSeparator = () => <ThemedView style={styles.separator} />;

type EmptyStateProps = {
  title: string;
  subtitle?: string;
};

const EmptyState = ({ title, subtitle }: EmptyStateProps) => (
  <ThemedView style={styles.emptyContainer}>
    <ThemedText style={styles.emptyTitle}>{title}</ThemedText>
    {subtitle ? <ThemedText style={styles.emptySubtitle}>{subtitle}</ThemedText> : null}
  </ThemedView>
);

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 12,
    paddingBottom: 120,
  },
  separator: {
    height: 12,
    backgroundColor: 'transparent',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 20,
  },
});
