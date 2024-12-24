import { StyleSheet } from "react-native"
import { colors } from "@/theme"

export const markdownStyles = StyleSheet.create({
  body: {
    color: colors.text,
    fontSize: 16,
  },
  code_inline: {
    backgroundColor: colors.background,
    color: colors.text,
    padding: 4,
    borderRadius: 4,
    fontFamily: "monospace",
  },
  code_block: {
    backgroundColor: colors.background,
    padding: 8,
    borderRadius: 4,
    marginVertical: 8,
    fontFamily: "monospace",
  },
  fence: {
    backgroundColor: colors.background,
    padding: 8,
    borderRadius: 4,
    marginVertical: 8,
    fontFamily: "monospace",
  },
  link: {
    color: "#0366d6", // GitHub-style link color
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: colors.border,
    paddingLeft: 8,
    opacity: 0.8,
  },
  list_item: {
    marginVertical: 4,
  },
  bullet_list: {
    marginVertical: 8,
  },
  ordered_list: {
    marginVertical: 8,
  },
  heading1: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
  },
  heading2: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 8,
  },
  heading3: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  em: {
    fontStyle: "italic",
  },
  strong: {
    fontWeight: "bold",
  },
  table: {
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 8,
  },
  thead: {
    backgroundColor: colors.background,
  },
  tr: {
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  th: {
    padding: 6,
  },
  td: {
    padding: 6,
  },
})