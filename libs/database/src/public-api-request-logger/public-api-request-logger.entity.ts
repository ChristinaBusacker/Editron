import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('public_api_request_log')
@Index('ix_parl_ts', ['occurredAt'])
@Index('ix_parl_project_ts', ['projectId', 'occurredAt'])
@Index('ix_parl_token_ts', ['apiTokenId', 'occurredAt'])
@Index('ix_parl_route_ts', ['route', 'occurredAt'])
@Index('ix_parl_status_ts', ['statusCode', 'occurredAt'])
export class PublicApiRequestLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  occurredAt!: Date;

  @Column({ length: 8 })
  method!: string;

  /** Route template if available (e.g., '/public/list/:moduleSlug') */
  @Column({ type: 'text' })
  route!: string;

  /** Concrete path as called (e.g., '/public/list/pet?foo=bar') */
  @Column({ type: 'text' })
  path!: string;

  @Column({ type: 'int' })
  statusCode!: number;

  @Column({ type: 'int' })
  durationMs!: number;

  /** API token id (FK) if available */
  @Column({ type: 'uuid', nullable: true })
  apiTokenId!: string | null;

  /** Project id (FK) if available */
  @Column({ type: 'uuid', nullable: true })
  projectId!: string | null;

  /** IP address (best effort) */
  @Column({ type: 'text', nullable: true })
  ip!: string | null;

  /** User-Agent header (trimmed) */
  @Column({ type: 'text', nullable: true })
  userAgent!: string | null;

  /** Language header 'x-language' if provided */
  @Column({ type: 'text', nullable: true })
  language!: string | null;

  /** JSON query snapshot (redacted) */
  @Column({ type: 'jsonb', nullable: true })
  query!: Record<string, unknown> | null;

  /** --- New: response + request details --- */

  /** Content-Length response header (bytes), if present */
  @Column({ type: 'int', nullable: true })
  responseContentLength!: number | null;

  /** Approx bytes written on socket for this response (may include headers; best-effort) */
  @Column({ type: 'int', nullable: true })
  responseBytes!: number | null;

  /** 'Content-Encoding' response header (e.g., gzip/br) */
  @Column({ type: 'text', nullable: true })
  contentEncoding!: string | null;

  /** 'ETag' response header */
  @Column({ type: 'text', nullable: true })
  etag!: string | null;

  /** 'Cache-Control' response header */
  @Column({ type: 'text', nullable: true })
  cacheControl!: string | null;

  /** Request 'Content-Length' header (bytes), if present */
  @Column({ type: 'int', nullable: true })
  requestContentLength!: number | null;

  /** Referrer/Origin for context */
  @Column({ type: 'text', nullable: true })
  referer!: string | null;

  @Column({ type: 'text', nullable: true })
  origin!: string | null;

  /** Params snapshot */
  @Column({ type: 'jsonb', nullable: true })
  routeParams!: Record<string, unknown> | null;

  /** Controller/handler for quick drill-down */
  @Column({ type: 'text', nullable: true })
  controller!: string | null;

  @Column({ type: 'text', nullable: true })
  handler!: string | null;

  /** OK flag (statusCode < 400) */
  @Column({ type: 'boolean', default: true })
  ok!: boolean;

  /** Error classification (if any) */
  @Column({ type: 'text', nullable: true })
  errorName!: string | null;

  /** Short error message (truncated) */
  @Column({ type: 'text', nullable: true })
  errorMessage!: string | null;

  /** Correlation/Request ID if present (or injected) */
  @Column({ type: 'text', nullable: true })
  requestId!: string | null;
}
