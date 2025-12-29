const DEFAULT_API_HOST = "https://api.zeldhash.com/";
const MAX_LIMIT = 500;

export type RewardEntry = {
  block_index: number;
  reward: number;
  txid: string;
  vout: number;
  zero_count: number;
};

function normalizeHost(host: string) {
  return host.endsWith("/") ? host : `${host}/`;
}

function getApiBaseUrl() {
  return normalizeHost(process.env.ZELDHASH_API_HOST || DEFAULT_API_HOST);
}

function isRewardEntry(entry: unknown): entry is RewardEntry {
  if (!entry || typeof entry !== "object") return false;
  const candidate = entry as Record<string, unknown>;

  return (
    typeof candidate.block_index === "number" &&
    typeof candidate.reward === "number" &&
    typeof candidate.txid === "string" &&
    typeof candidate.vout === "number" &&
    typeof candidate.zero_count === "number"
  );
}

export type AddressUtxo = {
  balance: number;
  txid: string;
  vout: number;
};

function isAddressUtxo(entry: unknown): entry is AddressUtxo {
  if (!entry || typeof entry !== "object") return false;
  const candidate = entry as Record<string, unknown>;

  return (
    typeof candidate.balance === "number" &&
    typeof candidate.txid === "string" &&
    typeof candidate.vout === "number"
  );
}

export async function fetchAddressUtxos(address: string): Promise<AddressUtxo[]> {
  const baseUrl = getApiBaseUrl();
  const url = new URL(`addresses/${encodeURIComponent(address)}/utxos`, baseUrl);

  const response = await fetch(url.toString(), {
    next: {revalidate: 60},
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status === 400) {
    throw new Error("Too many UTXOs for this address (max 500)");
  }

  if (!response.ok) {
    throw new Error(`ZeldHash API returned ${response.status} for ${url.pathname}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Unexpected ZeldHash address UTXOs payload");
  }

  return data.filter(isAddressUtxo);
}

export type BlockStats = {
  block_index: number;
  max_zero_count: number;
  new_utxo_count: number;
  nicest_txid: string;
  reward_count: number;
  total_reward: number;
  utxo_spent_count: number;
};

export type CumulStats = BlockStats & {
  block_count: number;
};

export type BlockReward = {
  reward: number;
  txid: string;
  vout: number;
  zero_count: number;
};

export type BlockDetails = {
  block_index: number;
  block_stats: BlockStats;
  cumul_stats: CumulStats;
  rewards: BlockReward[];
};

function isBlockDetails(data: unknown): data is BlockDetails {
  if (!data || typeof data !== "object") return false;
  const candidate = data as Record<string, unknown>;

  return (
    typeof candidate.block_index === "number" &&
    candidate.block_stats !== null &&
    typeof candidate.block_stats === "object" &&
    candidate.cumul_stats !== null &&
    typeof candidate.cumul_stats === "object" &&
    Array.isArray(candidate.rewards)
  );
}

export async function fetchBlockDetails(blockIndex: number): Promise<BlockDetails> {
  const baseUrl = getApiBaseUrl();
  const url = new URL(`blocks/${blockIndex}`, baseUrl);

  const response = await fetch(url.toString(), {
    next: {revalidate: 300},
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status === 404) {
    throw new Error("Block not found");
  }

  if (response.status === 400) {
    throw new Error("Invalid block index");
  }

  if (!response.ok) {
    throw new Error(`ZeldHash API returned ${response.status} for ${url.pathname}`);
  }

  const data = await response.json();
  if (!isBlockDetails(data)) {
    throw new Error("Unexpected ZeldHash block details payload");
  }

  return data;
}

export async function fetchLatestRewards(limit = 5, offset = 0): Promise<RewardEntry[]> {
  const baseUrl = getApiBaseUrl();
  const url = new URL("rewards", baseUrl);

  const safeLimit = Math.min(Math.max(limit, 1), MAX_LIMIT);
  const safeOffset = Math.max(offset, 0);

  url.searchParams.set("limit", String(safeLimit));
  if (safeOffset > 0) url.searchParams.set("offset", String(safeOffset));

  const response = await fetch(url.toString(), {
    next: {revalidate: 300},
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`ZeldHash API returned ${response.status} for ${url.pathname}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Unexpected ZeldHash rewards payload");
  }

  return data.filter(isRewardEntry);
}

