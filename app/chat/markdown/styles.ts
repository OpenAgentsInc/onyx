import { StyleSheet } from "react-native"
import { colorsDark as colors, typography } from "@/theme"

export const markdownStyles = StyleSheet.create({
  body: {
    color: colors.text,
    fontSize: 14,
    fontFamily: typography.primary.normal,
  },
  code_inline: {
    backgroundColor: colors.background,
    color: colors.text,
    padding: 4,
    borderRadius: 4,
    fontFamily: typography.primary.normal,
  },
  code_block: {
    backgroundColor: colors.background,
    padding: 8,
    borderRadius: 4,
    marginVertical: 8,
    fontFamily: typography.primary.normal,
  },
  fence: {
    backgroundColor: colors.background,
    padding: 8,
    borderRadius: 4,
    marginVertical: 8,
    fontFamily: typography.primary.normal,
  },
  link: {
    color: colors.text, // Changed from #0366d6 to use theme text color
    fontFamily: typography.primary.normal,
    textDecorationLine: "underline", // Added underline to distinguish links
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: colors.border,
    paddingLeft: 8,
    opacity: 0.8,
    fontFamily: typography.primary.normal,
  },
  list_item: {
    marginVertical: 4,
    fontFamily: typography.primary.normal,
  },
  bullet_list: {
    marginVertical: 8,
    fontFamily: typography.primary.normal,
  },
  ordered_list: {
    marginVertical: 8,
    fontFamily: typography.primary.normal,
  },
  heading1: {
    fontSize: 24,
    fontFamily: typography.primary.bold,
    marginVertical: 8,
  },
  heading2: {
    fontSize: 20,
    fontFamily: typography.primary.bold,
    marginVertical: 8,
  },
  heading3: {
    fontSize: 18,
    fontFamily: typography.primary.bold,
    marginVertical: 8,
  },
  em: {
    fontFamily: typography.primary.light,
    fontStyle: "italic",
  },
  strong: {
    fontFamily: typography.primary.bold,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 8,
  },
  thead: {
    backgroundColor: colors.background,
    fontFamily: typography.primary.semiBold,
  },
  tr: {
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  th: {
    padding: 6,
    fontFamily: typography.primary.semiBold,
  },
  td: {
    padding: 6,
    fontFamily: typography.primary.normal,
  },
  text: {
    fontFamily: typography.primary.normal,
  },
  textgroup: {
    fontFamily: typography.primary.normal,
  },
  paragraph: {
    fontFamily: typography.primary.normal,
    marginVertical: 4,
  },
})
