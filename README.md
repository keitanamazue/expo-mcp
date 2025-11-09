# expo-mcp

Expo Router + React Native で構築したフロントエンド完結の ToDo リストアプリです。SwiftUI/Native Tabs など Expo SDK 54 の最新機能を試しつつ、ローカルのみでタスク管理が完結します。

## 主な特徴
- **オフライン対応**: タスクはメモリ＋AsyncStorage に保存し、起動時に自動復元
- **Native Tabs**: `expo-router/unstable-native-tabs` を利用した Liquid Glass 風のタブバー
- **SwiftUI コンポーネント**: `@expo/ui` 実験的導入でネイティブ UI を一部描画
- **タスク操作**: 追加・編集・完了切替・削除、完了タスクの集計を提供

## セットアップ
```bash
npm install
```

## Development Build (必須)
Native Tabs と `@expo/ui` は Expo Go では動作しません。以下の手順で **prebuild → 開発ビルド** を行ってください。

```bash
# ネイティブプロジェクト生成 (初回のみ、設定変更時も再実行)
npx expo prebuild

# iOS シミュレータ (例: iPhone 17 Pro)
npx expo run:ios --device "iPhone 17 Pro"

# Android エミュレータ
npx expo run:android
```

> iOS 開発ビルド実行時は Xcode での初回署名設定が必要になる場合があります。

その後は Metro バンドルを起動してホットリロードできます。

```bash
npx expo start
```

## プロジェクト構成
- `app/` … Expo Router ルート。`(tabs)` 以下にタブ構成 (`index.tsx` / `explore.tsx` / `search.tsx`)
- `components/` … タスク UI や SwiftUI ブリッジ
- `context/` … `TasksProvider` (タスク状態・永続化)
- `storage/` … AsyncStorage ラッパー
- `types/` … タスクモデル定義

## タスクワークフロー
1. `TasksProvider` が起動時に AsyncStorage から同期
2. `TaskComposer` でタスク追加（必須: タイトル）
3. `TaskItem` で完了・編集・削除操作
4. `Summary` タブで統計・完了一覧を表示

## 開発メモ
- SwiftUI (`@expo/ui`) は β 版のため、重要操作は RN コンポーネントで実装
- Native Tabs の `role="search"` で iOS の検索アイコン位置調整
- 変更後は `npm run lint` で静的チェック

## リンク
- Expo Router Native Tabs: https://docs.expo.dev/router/advanced/native-tabs/
- Expo UI (SwiftUI): https://docs.expo.dev/guides/expo-ui-swift-ui/
- AsyncStorage: https://react-native-async-storage.github.io/async-storage/
