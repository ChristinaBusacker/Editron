export class FetchModuleEntries {
  static readonly type = '[Content] Set Entries';
  constructor(
    public projectId: string,
    public module: string,
  ) {}
}

export class CreateEntry {
  static readonly type = '[Content] Create Entry';
  constructor(
    public projectId: string,
    public module: string,
  ) {}
}

/** Fetch all versions for a specific entry */
export class FetchEntryVersions {
  static readonly type = '[Content] Fetch Entry Versions';
  constructor(public entryId: string) {}
}

/** Publish a specific version of an entry */
export class PublishVersion {
  static readonly type = '[Content] Publish Version';
  /** entryId is passed so we can refresh details/versions */
  constructor(
    public versionId: string,
    public entryId: string,
  ) {}
}

/** Restore a specific version (creates a new draft) */
export class RestoreVersion {
  static readonly type = '[Content] Restore Version';
  /** entryId is passed so we can refresh details/versions */
  constructor(
    public versionId: string,
    public entryId: string,
  ) {}
}

/** Fetch entry details (including current published/draft meta) */
export class FetchEntryDetails {
  static readonly type = '[Content] Fetch Entry Details';
  constructor(public entryId: string) {}
}
