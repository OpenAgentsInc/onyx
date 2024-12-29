import React from "react"
import { Text, TextInput, View } from "react-native"
import { useStores } from "@/models"
import { colorsDark as colors } from "@/theme"
import { styles } from "./styles"

export const GithubTokenSection = () => {
  const { coderStore } = useStores()
  const [githubToken, setGithubToken] = React.useState(coderStore.githubToken)

  const handleGithubTokenSubmit = () => {
    coderStore.setGithubToken(githubToken)
  }

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, styles.text]}>GitHub Token</Text>
      <TextInput
        style={[styles.input, styles.text]}
        value={githubToken}
        onChangeText={setGithubToken}
        placeholder="Enter GitHub token"
        placeholderTextColor={colors.palette.neutral400}
        secureTextEntry={true}
        onBlur={handleGithubTokenSubmit}
      />
    </View>
  )
}