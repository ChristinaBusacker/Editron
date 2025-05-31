export class FetchCMSModules {
  static readonly type = '[CMSModules] Get';
  constructor() {}
}

export class FetchModuleSchema {
  static readonly type = '[CMSModules] Get Schema';
  constructor(public module: string) {}
}
