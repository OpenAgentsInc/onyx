import { ApiResponse, ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "../api/apiProblem"
import type { AiurConfig, ProStatus, ShareRequest, ShareResponse, SharesResponse, TrainingDataRequest } from "./aiur.types"

export const DEFAULT_AIUR_CONFIG: AiurConfig = {
  url: Config.AIUR_API_URL || (__DEV__ ? "http://localhost:8000" : "https://openagents.com"),
  timeout: 10000,
}

export class AiurApi {
  apisauce: ApisauceInstance
  config: AiurConfig

  constructor(config: AiurConfig = DEFAULT_AIUR_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  setNpub(npub: string) {
    this.apisauce.setHeader("X-Nostr-Pubkey", npub)
  }

  /**
   * Gets the pro status for the current user
   */
  async getProStatus(): Promise<{ kind: "ok"; status: ProStatus } | GeneralApiProblem> {
    const response: ApiResponse<ProStatus> = await this.apisauce.get("/api/v1/pro/status")

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const status = response.data
      return { kind: "ok", status }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Share a chat with another user or make it public
   */
  async shareChat(
    chatId: string,
    request: ShareRequest,
  ): Promise<{ kind: "ok"; share: ShareResponse } | GeneralApiProblem> {
    const response: ApiResponse<ShareResponse> = await this.apisauce.post(
      `/api/v1/chats/${chatId}/share`,
      request,
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const share = response.data
      return { kind: "ok", share }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Get all active shares for a chat
   */
  async getShares(chatId: string): Promise<{ kind: "ok"; shares: SharesResponse } | GeneralApiProblem> {
    const response: ApiResponse<SharesResponse> = await this.apisauce.get(
      `/api/v1/chats/${chatId}/shares`,
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const shares = response.data
      return { kind: "ok", shares }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Revoke a share
   */
  async revokeShare(
    chatId: string,
    shareId: string,
  ): Promise<{ kind: "ok" } | GeneralApiProblem> {
    const response: ApiResponse<void> = await this.apisauce.delete(
      `/api/v1/chats/${chatId}/shares/${shareId}`,
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    return { kind: "ok" }
  }

  /**
   * Manage training data opt-in for messages
   */
  async manageTrainingData(
    chatId: string,
    request: TrainingDataRequest,
  ): Promise<{ kind: "ok" } | GeneralApiProblem> {
    const response: ApiResponse<void> = await this.apisauce.post(
      `/api/v1/chats/${chatId}/training`,
      request,
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    return { kind: "ok" }
  }
}

// Singleton instance of the API for convenience
export const aiurApi = new AiurApi()