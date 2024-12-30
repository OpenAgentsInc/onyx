import "@/utils/crypto-polyfill"
import "text-encoding-polyfill"
import { Buffer } from "buffer"

global.Buffer = Buffer
