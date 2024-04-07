import permute from "./permute"


onmessage = function(e) {
  const result = permute(e.data)
  postMessage(result)
}