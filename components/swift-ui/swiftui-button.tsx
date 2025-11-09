import { Button, Host } from '@expo/ui/swift-ui';
import type { StyleProp, ViewStyle } from 'react-native';

type SwiftUIButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'bordered';
  style?: StyleProp<ViewStyle>;
  matchContents?: boolean;
};

export function SwiftUIButton({
  label,
  onPress,
  disabled = false,
  variant = 'default',
  style,
  matchContents = true,
}: SwiftUIButtonProps) {
  const handlePress = () => {
    if (disabled) return;
    onPress?.();
  };

  return (
    <Host matchContents={matchContents} style={[style, disabled ? { opacity: 0.5 } : null]}>
      <Button variant={variant} onPress={handlePress}>
        {label}
      </Button>
    </Host>
  );
}
