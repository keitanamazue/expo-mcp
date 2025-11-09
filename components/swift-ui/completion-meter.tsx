import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { CircularProgress, Host, Text, VStack } from '@expo/ui/swift-ui';

type CompletionMeterProps = {
  completionRate: number;
};

export function CompletionMeter({ completionRate }: CompletionMeterProps) {
  const clampedRate = Math.max(0, Math.min(100, Math.round(completionRate)));
  const progress = clampedRate / 100;
  const tintColor = useThemeColor({}, 'tint');

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.heading}>
        SwiftUI 完了率メーター
      </ThemedText>
      <ThemedText style={styles.caption}>@expo/ui/swift-ui でネイティブ UI を描画しています</ThemedText>
      <Host matchContents style={styles.host}>
        <VStack spacing={12}>
          <CircularProgress progress={progress} color={tintColor} />
          <Text>{`完了率 ${clampedRate}%`}</Text>
        </VStack>
      </Host>
      <ThemedText style={styles.note}>
        Development Build が必要です。Expo Go ではこの表示は利用できません。
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#d1d5db40',
  },
  heading: {
    marginBottom: 4,
  },
  caption: {
    fontSize: 13,
    opacity: 0.7,
  },
  host: {
    marginTop: 12,
    alignSelf: 'center',
  },
  note: {
    fontSize: 12,
    marginTop: 12,
    opacity: 0.7,
  },
});
