import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Farmer } from '../../../domain/entities/farmer.entity';

@Entity('farmer')
export class FarmerPgsql implements Farmer {
  @PrimaryColumn('uuid') id: string;

  @Column({ name: 'name', type: 'varchar' }) name: string;

  @Column({ name: 'id_card_number', type: 'varchar' }) idCardNumber: string;

  @Column({ name: 'birth_date', type: 'date' }) birthDate: Date;

  @Column({ name: 'created_at', type: 'timestamp' }) createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp' }) updatedAt: Date;
}
