const palette = {
  neutral100: "#fafafa", // zinc-50
  neutral200: "#f4f4f5", // zinc-100
  neutral300: "#e4e4e7", // zinc-200
  neutral400: "#d4d4d8", // zinc-300
  neutral500: "#a1a1aa", // zinc-400
  neutral600: "#71717a", // zinc-500
  neutral700: "#52525b", // zinc-600
  neutral800: "#27272a", // zinc-800
  neutral900: "#09090b", // zinc-950

  primary100: "#f4f4f5", // zinc-100
  primary200: "#e4e4e7", // zinc-200
  primary300: "#d4d4d8", // zinc-300
  primary400: "#a1a1aa", // zinc-400
  primary500: "#71717a", // zinc-500
  primary600: "#52525b", // zinc-600

  secondary100: "#f4f4f5", // zinc-100
  secondary200: "#e4e4e7", // zinc-200
  secondary300: "#d4d4d8", // zinc-300
  secondary400: "#a1a1aa", // zinc-400
  secondary500: "#71717a", // zinc-500

  accent100: "#f4f4f5", // zinc-100
  accent200: "#e4e4e7", // zinc-200
  accent300: "#d4d4d8", // zinc-300
  accent400: "#a1a1aa", // zinc-400
  accent500: "#71717a", // zinc-500

  angry100: "#e4e4e7", // zinc-200
  angry500: "#18181b", // zinc-900

  overlay20: "rgba(39, 39, 42, 0.2)", // zinc-800
  overlay50: "rgba(39, 39, 42, 0.5)", // zinc-800
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral800,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral200,
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * The inactive tinting color.
   */
  tintInactive: palette.neutral300,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   */
  errorBackground: palette.angry100,
} as const