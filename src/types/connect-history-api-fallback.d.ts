declare module "connect-history-api-fallback" {
  import { NextHandleFunction } from "connect";
  function historyFallback(options?: any): NextHandleFunction;
  export default historyFallback;
}