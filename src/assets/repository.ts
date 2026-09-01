import type { Asset, GenerationMetadata } from "../domain/index.js";

export interface AssetVersionInput {
  readonly asset: Omit<Asset, "metadata">;
  readonly metadata: GenerationMetadata;
}

export interface AssetRepository {
  get(assetId: string): Promise<Asset | undefined>;
  list(): Promise<readonly Asset[]>;
  addVersion(input: AssetVersionInput): Promise<Asset>;
}
