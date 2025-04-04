import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
  nome: string | undefined;

  @Column()
  email: string | undefined;
}
