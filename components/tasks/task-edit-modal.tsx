import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Task, TaskStatus, TaskUpdate } from '@/types/task';

type TaskEditModalProps = {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onSubmit: (id: string, updates: TaskUpdate) => boolean;
  onDelete: (id: string) => void;
};

export function TaskEditModal({ visible, task, onClose, onSubmit, onDelete }: TaskEditModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('active');

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const secondaryBackground = useThemeColor({ light: '#e5e7eb', dark: '#1f2937' }, 'background');

  useEffect(() => {
    if (!task) {
      setTitle('');
      setDescription('');
      setStatus('active');
      return;
    }

    setTitle(task.title);
    setDescription(task.description ?? '');
    setStatus(task.status);
  }, [task]);

  const handleSave = () => {
    if (!task) return;
    const didUpdate = onSubmit(task.id, {
      title,
      description,
      status,
    });

    if (didUpdate) {
      onClose();
    }
  };

  const handleDelete = () => {
    if (!task) return;
    onDelete(task.id);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      transparent={Platform.OS === 'ios'}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.flex, Platform.OS === 'ios' ? styles.overlay : null]}>
        <View style={styles.flex}>
          <ThemedView style={[styles.sheet, Platform.OS === 'ios' && styles.iosSheet]}>
            <View style={styles.dragHandleContainer}>
              <View style={styles.dragHandle} />
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.contentContainer}>
              <ThemedText type="title" style={styles.heading}>
                タスクを編集
              </ThemedText>

              <View style={styles.fieldGroup}>
                <ThemedText style={styles.label}>タイトル</ThemedText>
                <TextInput
                  accessibilityLabel="タイトル"
                  value={title}
                  onChangeText={setTitle}
                  placeholder="タスク名"
                  placeholderTextColor={textColor + '80'}
                  style={[styles.input, { backgroundColor, color: textColor }]}
                  multiline
                />
              </View>

              <View style={styles.fieldGroup}>
                <ThemedText style={styles.label}>詳細</ThemedText>
                <TextInput
                  accessibilityLabel="詳細"
                  value={description}
                  onChangeText={setDescription}
                  placeholder="メモやリンクなどを記録"
                  placeholderTextColor={textColor + '80'}
                  style={[styles.textArea, { backgroundColor, color: textColor }]}
                  multiline
                />
              </View>

              <View style={styles.switchRow}>
                <ThemedText style={styles.label}>完了済みにする</ThemedText>
                <Switch
                  accessibilityLabel="完了状態"
                  value={status === 'completed'}
                  onValueChange={(checked) => setStatus(checked ? 'completed' : 'active')}
                  thumbColor={Platform.OS === 'android' ? '#fff' : undefined}
                  trackColor={{ false: '#d1d5db', true: tintColor }}
                />
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Pressable accessibilityRole="button" onPress={handleDelete} style={styles.deleteButton}>
                <ThemedText style={styles.deleteLabel}>削除</ThemedText>
              </Pressable>
              <View style={styles.footerActions}>
                <Pressable
                  accessibilityRole="button"
                  onPress={onClose}
                  style={[styles.secondaryButton, { backgroundColor: secondaryBackground }]}>
                  <ThemedText>キャンセル</ThemedText>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={handleSave}
                  style={[styles.primaryButton, { backgroundColor: tintColor, opacity: title.trim() ? 1 : 0.4 }]}
                  disabled={!title.trim()}>
                  <ThemedText style={styles.primaryLabel}>保存</ThemedText>
                </Pressable>
              </View>
            </View>
          </ThemedView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    flex: 1,
  },
  iosSheet: {
    marginTop: 60,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  dragHandle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#d1d5db',
  },
  contentContainer: {
    padding: 24,
    gap: 20,
  },
  heading: {
    textAlign: 'left',
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 22,
  },
  textArea: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    lineHeight: 20,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  footer: {
    padding: 20,
    gap: 16,
  },
  deleteButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  deleteLabel: {
    color: '#dc2626',
    fontWeight: '600',
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
  },
  primaryButton: {
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  primaryLabel: {
    color: '#fff',
    fontWeight: '600',
  },
});
