/// A chain's trigger is an exclusive arc: exactly one kind, never both. Adding a
/// third kind here is the extension point the model was chosen for.
export type ChainTrigger =
  | { type: "board"; uuid: string }
  | { type: "phrase"; uuid: string };

/// The same arc once the uuid has been resolved to an internal id.
export type TriggerRef = { type: ChainTrigger["type"]; id: number };

export type InteractionChainInput = {
  trigger: ChainTrigger;
  responseBoardUuid: string;
  rank?: number;
  label?: string | null;
};

export type InteractionChainUpdateInput = {
  trigger?: ChainTrigger | undefined;
  responseBoardUuid?: string | undefined;
  rank?: number | undefined;
  label?: string | null | undefined;
};

export type InteractionChainRepositoryInput = {
  trigger: TriggerRef;
  responseBoardId: number;
  rank?: number | undefined;
  label?: string | null;
};

export type InteractionChainRepositoryUpdateInput = {
  trigger: TriggerRef | undefined;
  responseBoardId: number | undefined;
  rank: number | undefined;
  label: string | null | undefined;
};

export type InteractionChainOutput = {
  id: number;
  uuid: string;
  trigger: ChainTrigger;
  // Flattened from whichever trigger is set, so the authorization guards read
  // the same fields whatever the arc points at.
  triggerAuthorUuid: string | null;
  triggerPublishedAt: Date | null;
  responseBoardUuid: string;
  rank: number;
  label: string | null;
  createdAt: Date;
  updatedAt: Date;
};
