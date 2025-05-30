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
