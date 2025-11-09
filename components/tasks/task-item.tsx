import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Task } from '@/types/task';

type TaskItemProps = {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const tintColor = useThemeColor({}, 'tint');
  const mutedText = useThemeColor({ light: '#687076', dark: '#9BA1A6' }, 'icon');

  const isCompleted = task.status === 'completed';

  return (
    <ThemedView style={styles.container} testID={`task-item-${task.id}`}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isCompleted }}
        onPress={() => onToggle(task)}
        style={styles.toggle}
        hitSlop={12}>
        <IconSymbol
          name={isCompleted ? 'checkmark.circle.fill' : 'circle'}
          size={28}
          color={isCompleted ? tintColor : mutedText}
        />
      </Pressable>

      <Pressable
        style={styles.content}
        onPress={() => onToggle(task)}
        accessibilityRole="button"
        accessibilityHint={isCompleted ? 'タスクを未完了に戻す' : 'タスクを完了状態にする'}>
        <ThemedText
          style={[styles.title, isCompleted && styles.completedTitle]}
          numberOfLines={2}>
          {task.title}
        </ThemedText>
        {task.description ? (
          <ThemedText style={[styles.description, isCompleted && styles.completedDescription]} numberOfLines={3}>
            {task.description}
          </ThemedText>
        ) : null}
      </Pressable>

      <View style={styles.actions}>
        <Pressable
          accessibilityLabel="タスクを編集"
          onPress={() => onEdit(task)}
          style={styles.actionButton}
          hitSlop={12}>
          <IconSymbol name="square.and.pencil" size={22} color={mutedText} />
        </Pressable>
        <Pressable
          accessibilityLabel="タスクを削除"
          onPress={() => onDelete(task)}
          style={styles.actionButton}
          hitSlop={12}>
          <IconSymbol name="trash" size={22} color={mutedText} />
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  toggle: {
    paddingVertical: 6,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  completedDescription: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 8,
  },
  actionButton: {
    padding: 6,
  },
});
