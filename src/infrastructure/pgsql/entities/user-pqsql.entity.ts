import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../../domain/entities/user.entity';

@Entity('user')
export class UserPgsql implements User {
  @PrimaryColumn('uuid') id: string;

  @Column({ name: 'name', type: 'varchar' }) name: string;

  @Column({ name: 'otp', type: 'varchar' }) otp: string;

  @CreateDateColumn()
  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn()
  @Column({ name: 'modified_at', type: 'timestamp' })
  modifiedAt: Date;

  @Column({ name: 'last_otp_request_at', type: 'timestamp' }) lastOtpRequestAt: Date;

  @Column({ name: 'last_otp_validation_at', type: 'timestamp' }) lastOtpValidationAt: Date | null;
}
