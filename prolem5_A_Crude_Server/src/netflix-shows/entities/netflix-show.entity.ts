import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'netflix_shows' })
export class NetflixShow {
  @PrimaryColumn({ type: 'text' })
  show_id: string;

  @Column({ type: 'text', nullable: true })
  type?: string;

  @Column({ type: 'text', nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  director?: string;

  @Column({ type: 'text', nullable: true })
  cast_members?: string;

  @Column({ type: 'text', nullable: true })
  country?: string;

  @Column({ type: 'date', nullable: true })
  date_added?: Date;

  @Column({ type: 'int', nullable: true })
  release_year?: number;

  @Column({ type: 'text', nullable: true })
  rating?: string;

  @Column({ type: 'text', nullable: true })
  duration?: string;

  @Column({ type: 'text', nullable: true })
  listed_in?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;
}