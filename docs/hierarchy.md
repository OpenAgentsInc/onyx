# Project Hierarchy

Generated on: 2025-02-13 23:47:20

### Structure

```
./
|-- app/
|   |-- agentgraph/
|   |   |-- AgentGraph.ts
|   |   |-- EdgeRenderer.ts
|   |   |-- NodeRenderer.ts
|   |   `-- types.ts
|   |-- canvas/
|   |   |-- Canvas.tsx
|   |   |-- index.ts
|   |   `-- types.ts
|   |-- chat/
|   |   |-- drawer/
|   |   |   |-- ChatDrawerLayout.tsx
|   |   |   |-- ChatList.tsx
|   |   |   |-- ChatPreview.ts
|   |   |   |-- NewChatButton.tsx
|   |   |   |-- ProfileButton.tsx
|   |   |   |-- README.md
|   |   |   |-- WalletButton.tsx
|   |   |   |-- index.tsx
|   |   |   `-- styles.ts
|   |   |-- markdown/
|   |   |   |-- MessageContent.tsx
|   |   |   |-- ToolInvocation.tsx
|   |   |   |-- index.ts
|   |   |   `-- styles.ts
|   |   |-- Chat.tsx
|   |   |-- ChatBar.tsx
|   |   |-- ChatOverlay.tsx
|   |   `-- styles.ts
|   |-- components/
|   |   |-- ui/
|   |   |   |-- button.tsx
|   |   |   |-- card.tsx
|   |   |   |-- context-menu.tsx
|   |   |   |-- dialog.tsx
|   |   |   |-- input.tsx
|   |   |   `-- text.tsx
|   |   |-- AutoImage.tsx
|   |   |-- Button.tsx
|   |   |-- Header.tsx
|   |   |-- Icon.tsx
|   |   |-- KeyboardDismisser.tsx
|   |   |-- Screen.tsx
|   |   |-- Text.tsx
|   |   |-- ThinkingAnimation.tsx
|   |   `-- index.ts
|   |-- config/
|   |   |-- config.base.ts
|   |   |-- config.dev.ts
|   |   |-- config.prod.ts
|   |   |-- env.ts
|   |   `-- index.ts
|   |-- contexts/
|   |   `-- AuthContext.tsx
|   |-- devtools/
|   |   |-- ReactotronClient.ts
|   |   |-- ReactotronClient.web.ts
|   |   `-- ReactotronConfig.ts
|   |-- hooks/
|   |   |-- useAutoUpdate.ts
|   |   |-- useChat.ts
|   |   |-- useHeader.tsx
|   |   |-- useKeyboard.ts
|   |   |-- useNotifications.ts
|   |   |-- useVoicePermissions.ts
|   |   `-- useVoiceRecording.ts
|   |-- hyperview/
|   |   |-- behaviors/
|   |   |   |-- AddStyles/
|   |   |   |   |-- AddStyles.tsx
|   |   |   |   `-- index.ts
|   |   |   |-- Auth/
|   |   |   |   `-- index.ts
|   |   |   |-- Fetch/
|   |   |   |   `-- index.ts
|   |   |   |-- Navigate/
|   |   |   |   `-- index.ts
|   |   |   |-- OpenUrl/
|   |   |   |   `-- index.ts
|   |   |   |-- SolveDemoRepo/
|   |   |   |   |-- index.ts
|   |   |   |   `-- websocket.ts
|   |   |   |-- WebSocket/
|   |   |   |   |-- events.ts
|   |   |   |   |-- index.ts
|   |   |   |   |-- parser.ts
|   |   |   |   `-- wrapper.ts
|   |   |   `-- index.ts
|   |   |-- components/
|   |   |   |-- LocalImage/
|   |   |   |   |-- LocalImage.tsx
|   |   |   |   `-- index.ts
|   |   |   |-- LocalSvg/
|   |   |   |   |-- LocalSvg.tsx
|   |   |   |   |-- index.ts
|   |   |   |   `-- svg-content.ts
|   |   |   `-- index.ts
|   |   |-- helpers/
|   |   |   |-- fetch.ts
|   |   |   |-- index.ts
|   |   |   `-- logger.ts
|   |   `-- index.ts
|   |-- i18n/
|   |   |-- ar.ts
|   |   |-- demo-ar.ts
|   |   |-- demo-en.ts
|   |   |-- demo-es.ts
|   |   |-- demo-fr.ts
|   |   |-- demo-hi.ts
|   |   |-- demo-ja.ts
|   |   |-- demo-ko.ts
|   |   |-- en.ts
|   |   |-- es.ts
|   |   |-- fr.ts
|   |   |-- hi.ts
|   |   |-- i18n.ts
|   |   |-- index.ts
|   |   |-- ja.ts
|   |   |-- ko.ts
|   |   `-- translate.ts
|   |-- lib/
|   |   |-- icons/
|   |   |   |-- Check.tsx
|   |   |   |-- ChevronDown.tsx
|   |   |   |-- ChevronRight.tsx
|   |   |   |-- ChevronUp.tsx
|   |   |   |-- X.tsx
|   |   |   `-- iconWithClassName.ts
|   |   |-- constants.ts
|   |   |-- useColorScheme.tsx
|   |   `-- utils.ts
|   |-- models/
|   |   |-- _helpers/
|   |   |   |-- getRootStore.ts
|   |   |   |-- setupRootStore.ts
|   |   |   |-- useStores.ts
|   |   |   `-- withSetPropAction.ts
|   |   |-- chat/
|   |   |   |-- ChatStorage.native.ts
|   |   |   |-- ChatStorage.ts
|   |   |   |-- ChatStorage.web.ts
|   |   |   |-- ChatStore.ts
|   |   |   `-- index.ts
|   |   |-- coder/
|   |   |   `-- CoderStore.ts
|   |   |-- types/
|   |   |   `-- repo.ts
|   |   |-- user/
|   |   |   `-- UserStore.ts
|   |   |-- wallet/
|   |   |   |-- actions/
|   |   |   |   |-- disconnect.ts
|   |   |   |   |-- fetchBalanceInfo.ts
|   |   |   |   |-- fetchTransactions.ts
|   |   |   |   |-- index.ts
|   |   |   |   |-- receivePayment.ts
|   |   |   |   |-- restoreWallet.ts
|   |   |   |   |-- sendPayment.ts
|   |   |   |   `-- setup.ts
|   |   |   |-- WalletStore.ts
|   |   |   |-- models.ts
|   |   |   |-- types.ts
|   |   |   `-- views.ts
|   |   |-- RootStore.ts
|   |   `-- index.ts
|   |-- osint/
|   |   |-- components/
|   |   |   |-- Inspector3D.tsx
|   |   |   `-- Message.tsx
|   |   |-- ChatDemo.tsx
|   |   |-- OSINTCard.tsx
|   |   |-- Test copy.tsx
|   |   |-- Test.tsx
|   |   |-- data.ts
|   |   |-- styles.ts
|   |   `-- types.ts
|   |-- screens/
|   |   |-- ChatScreen/
|   |   |   |-- ChatScreen.tsx
|   |   |   `-- index.ts
|   |   |-- ErrorScreen/
|   |   |   |-- ErrorBoundary.tsx
|   |   |   `-- ErrorDetails.tsx
|   |   |-- HyperviewScreen/
|   |   |   |-- HyperviewScreen.tsx
|   |   |   `-- index.ts
|   |   |-- ProfileScreen/
|   |   |   `-- KeyRow.tsx
|   |   |-- SettingsScreen/
|   |   |   |-- coder/
|   |   |   |   |-- GithubTokenSection.tsx
|   |   |   |   |-- RepoFormSection.tsx
|   |   |   |   |-- RepoListSection.tsx
|   |   |   |   |-- ToolsSection.tsx
|   |   |   |   |-- styles.ts
|   |   |   |   `-- types.ts
|   |   |   `-- styles.ts
|   |   |-- WalletScreen/
|   |   |   |-- BalanceHeader.tsx
|   |   |   |-- Money.tsx
|   |   |   |-- MoneySmall.tsx
|   |   |   `-- TransactionsList.tsx
|   |   `-- index.ts
|   |-- services/
|   |   |-- aiur/
|   |   |   |-- aiur.ts
|   |   |   |-- aiur.types.ts
|   |   |   `-- index.ts
|   |   |-- api/
|   |   |   |-- api.ts
|   |   |   |-- api.types.ts
|   |   |   |-- apiProblem.test.ts
|   |   |   |-- apiProblem.ts
|   |   |   `-- index.ts
|   |   |-- auth/
|   |   |   |-- githubAuth.ts
|   |   |   `-- index.ts
|   |   |-- breez/
|   |   |   |-- breezService.native.ts
|   |   |   |-- breezService.ts
|   |   |   |-- breezService.web.ts
|   |   |   |-- index.ts
|   |   |   `-- types.ts
|   |   |-- groq/
|   |   |   |-- groq-api.types.ts
|   |   |   |-- groq-chat.ts
|   |   |   `-- index.ts
|   |   |-- nostr/
|   |   |   |-- nostr.ts
|   |   |   `-- nostr.types.ts
|   |   |-- notifications/
|   |   |   `-- index.ts
|   |   |-- storage/
|   |   |   |-- secureStorage.native.ts
|   |   |   |-- secureStorage.ts
|   |   |   `-- secureStorage.web.ts
|   |   `-- events.ts
|   |-- theme/
|   |   |-- colors.ts
|   |   |-- colorsDark.ts
|   |   |-- images.ts
|   |   |-- index.ts
|   |   |-- onyx.ts
|   |   |-- spacing.ts
|   |   |-- spacingDark.ts
|   |   |-- styles.ts
|   |   |-- timing.ts
|   |   `-- typography.ts
|   |-- utils/
|   |   |-- storage/
|   |   |   |-- index.ts
|   |   |   |-- storage.test.ts
|   |   |   `-- storage.ts
|   |   |-- alert.ts
|   |   |-- clearStorage.ts
|   |   |-- crypto-polyfill.ts
|   |   |-- ignore-warnings.ts
|   |   |-- isEmulator.ts
|   |   |-- log.ts
|   |   |-- polyfills.ts
|   |   |-- useAppTheme.ts
|   |   |-- useIsFocused.ts
|   |   |-- useIsMounted.ts
|   |   `-- useSafeAreaInsetsStyle.ts
|   |-- app.tsx
|   |-- global.css
|   `-- nativewind-env.d.ts
|-- assets/
|   |-- icons/
|   |   |-- demo/
|   |   |   |-- clap.png
|   |   |   |-- clap@2x.png
|   |   |   |-- clap@3x.png
|   |   |   |-- community.png
|   |   |   |-- community@2x.png
|   |   |   |-- community@3x.png
|   |   |   |-- components.png
|   |   |   |-- components@2x.png
|   |   |   |-- components@3x.png
|   |   |   |-- debug.png
|   |   |   |-- debug@2x.png
|   |   |   |-- debug@3x.png
|   |   |   |-- github.png
|   |   |   |-- github@2x.png
|   |   |   |-- github@3x.png
|   |   |   |-- heart.png
|   |   |   |-- heart@2x.png
|   |   |   |-- heart@3x.png
|   |   |   |-- pin.png
|   |   |   |-- pin@2x.png
|   |   |   |-- pin@3x.png
|   |   |   |-- podcast.png
|   |   |   |-- podcast@2x.png
|   |   |   |-- podcast@3x.png
|   |   |   |-- slack.png
|   |   |   |-- slack@2x.png
|   |   |   `-- slack@3x.png
|   |   |-- back.png
|   |   |-- back@2x.png
|   |   |-- back@3x.png
|   |   |-- bell.png
|   |   |-- bell@2x.png
|   |   |-- bell@3x.png
|   |   |-- caretLeft.png
|   |   |-- caretLeft@2x.png
|   |   |-- caretLeft@3x.png
|   |   |-- caretRight.png
|   |   |-- caretRight@2x.png
|   |   |-- caretRight@3x.png
|   |   |-- check.png
|   |   |-- check@2x.png
|   |   |-- check@3x.png
|   |   |-- configure.png
|   |   |-- hidden.png
|   |   |-- hidden@2x.png
|   |   |-- hidden@3x.png
|   |   |-- ladybug.png
|   |   |-- ladybug@2x.png
|   |   |-- ladybug@3x.png
|   |   |-- lock.png
|   |   |-- lock@2x.png
|   |   |-- lock@3x.png
|   |   |-- menu.png
|   |   |-- menu@2x.png
|   |   |-- menu@3x.png
|   |   |-- more.png
|   |   |-- more@2x.png
|   |   |-- more@3x.png
|   |   |-- settings.png
|   |   |-- settings@2x.png
|   |   |-- settings@3x.png
|   |   |-- text.png
|   |   |-- view.png
|   |   |-- view@2x.png
|   |   |-- view@3x.png
|   |   |-- voice.png
|   |   |-- x.png
|   |   |-- x@2x.png
|   |   `-- x@3x.png
|   `-- images/
|       |-- design/
|       |   |-- Arrow-Left.svg
|       |   |-- Arrow-Right.svg
|       |   |-- Item.svg
|       |   |-- More.svg
|       |   |-- New.svg
|       |   |-- OA-Logomark-p-500.png
|       |   |-- OA-Logomark.png
|       |   |-- Onyx-Animation-Compressed.gif
|       |   |-- Profile.svg
|       |   |-- Send.svg
|       |   |-- Settings.svg
|       |   |-- Spacer.png
|       |   |-- Voice.svg
|       |   `-- Wallet.svg
|       |-- Thinking-Animation-Orig.gif
|       |-- Thinking-Animation.gif
|       |-- app-icon-all.png
|       |-- app-icon-old.png
|       |-- splash-old.png
|       `-- splash.png
|-- docs/
|   |-- agentgraph.md
|   |-- ai-design-language.md
|   |-- aiur.md
|   |-- chat-persistence.md
|   |-- chatbar.md
|   |-- coder-settings.md
|   |-- data-marketplace.md
|   |-- groq-voice.md
|   |-- hierarchy.md
|   |-- hyperview.md
|   |-- init.md
|   |-- markdown.md
|   |-- onboarding.md
|   |-- osint-chat.md
|   |-- osint-nostr.md
|   |-- permissions.md
|   |-- pro.md
|   |-- roadmap-brainstorming.md
|   |-- roadmap.md
|   |-- three-camera.md
|   `-- wallet-store.md
|-- scripts/
|   |-- deepseek_test_fixer.sh
|   |-- generate-hierarchy.js
|   `-- generate-svg-content.js
|-- LICENSE.md
|-- README-expo.md
|-- README.md
|-- app.config.ts
|-- app.json
|-- babel.config.js
|-- components.json
|-- eas.json
|-- metro.config.js
|-- nativewind-env.d.ts
|-- package.json
|-- tailwind.config.js
|-- tsconfig.json
`-- yarn.lock

66 directories, 337 files
```
