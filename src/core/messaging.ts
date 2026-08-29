export type Message = {
  type: string
  payload?: unknown
}

export const sendMessage = (msg: Message) => {
  return chrome.runtime.sendMessage(msg)
}

export const onMessage = (handler: (msg: Message, sender: chrome.runtime.MessageSender, sendResponse: (response?: unknown) => void) => void) => {
  chrome.runtime.onMessage.addListener(handler)
}
