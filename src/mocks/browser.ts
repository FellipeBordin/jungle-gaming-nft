import { setupWorker } from "msw/browser";

import { nftHandlers } from "./handlers/nfts";
import { orderHandlers } from "./handlers/orders";
import { authHandlers } from "./handlers/auth";

export const worker = setupWorker(
  ...nftHandlers,
  ...orderHandlers,
  ...authHandlers,
);
