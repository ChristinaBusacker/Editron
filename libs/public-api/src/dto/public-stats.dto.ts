export class HeatMapSeriesDatum {
  name!: string;
  value!: number;
}
export class HeatMapRow {
  name!: string;
  series!: HeatMapSeriesDatum[];
}

export class CountBucketDto {
  key!: string;
  count!: number;
}

export class MetricsDto {
  total!: number;
  ok!: number;
  error!: number;
  avgDurationMs!: number | null;
  p95DurationMs!: number | null;
  avgResponseBytes!: number | null;
}

export class PublicStatsResponseDto {
  heatmap!: HeatMapRow[];
  buckets!: {
    routes: CountBucketDto[];
    statuses: CountBucketDto[];
    origins: CountBucketDto[];
    methods: CountBucketDto[];
  };
  metrics!: MetricsDto;
  range!: { from: string; to: string };
}

export class ListStatsItemDto {
  id!: string;
  occurredAt!: string;
  method!: string;
  route!: string;
  path!: string;
  statusCode!: number;
  durationMs!: number;
  origin!: string | null;
  referer!: string | null;
  language!: string | null;
  apiTokenId!: string | null;
  projectId!: string | null;
  ip!: string | null;
  userAgent!: string | null;
  responseContentLength!: number | null;
  responseBytes!: number | null;
  contentEncoding!: string | null;
  cacheControl!: string | null;
  ok!: boolean;
  controller!: string | null;
  handler!: string | null;
  requestId!: string | null;
}

export class ListStatsResponseDto {
  items!: ListStatsItemDto[];
  page!: number;
  limit!: number;
  total!: number;
  range!: { from: string; to: string };
}
