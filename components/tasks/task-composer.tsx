import { useState } from 'react';
import { Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { TaskDraft } from '@/types/task';

type TaskComposerProps = {
  onCreate: (draft: TaskDraft) => boolean;
  isDisabled?: boolean;
};

export function TaskComposer({ onCreate, isDisabled = false }: TaskComposerProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(false);

  const inputBackground = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const resetComposer = () => {
    setTitle('');
    setDescription('');
    setShowDescription(false);
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    const didCreate = onCreate({ title, description });
    if (!didCreate) return;
    resetComposer();
    Keyboard.dismiss();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.row}>
        <TextInput
          accessibilityLabel="タスクのタイトル"
          autoCapitalize="sentences"
          autoCorrect
          editable={!isDisabled}
          multiline={false}
          onChangeText={setTitle}
          onSubmitEditing={handleSubmit}
          placeholder="新しいタスクを追加"
          placeholderTextColor={textColor + '80'}
          style={[styles.titleInput, { backgroundColor: inputBackground, color: textColor, opacity: isDisabled ? 0.6 : 1 }]}
          value={title}
          returnKeyType="done"
          blurOnSubmit
        />
      </View>

      {showDescription && (
        <TextInput
          accessibilityLabel="タスクの詳細"
          editable={!isDisabled}
          multiline
          onChangeText={setDescription}
          placeholder="メモや詳細を入力 (任意)"
          placeholderTextColor={textColor + '80'}
          style={[styles.descriptionInput, { backgroundColor: inputBackground, color: textColor, opacity: isDisabled ? 0.6 : 1 }]}
          value={description}
        />
      )}

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setShowDescription((prev) => !prev)}
          style={styles.linkButton}
          disabled={isDisabled}>
          <ThemedText type="link">{showDescription ? '詳細を閉じる' : '詳細を追加'}</ThemedText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={handleSubmit}
          style={[styles.primaryButton, { backgroundColor: tintColor, opacity: isDisabled || !title.trim() ? 0.4 : 1 }]}
          disabled={isDisabled || !title.trim()}>
          <ThemedText type="defaultSemiBold" style={styles.primaryButtonLabel}>
            追加
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleInput: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    lineHeight: 22,
  },
  descriptionInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    lineHeight: 20,
    minHeight: 72,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  primaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
  },
  primaryButtonLabel: {
    color: '#fff',
  },
});
