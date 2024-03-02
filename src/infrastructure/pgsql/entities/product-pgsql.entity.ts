import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Product } from '../../../domain/entities/product.entity';

@Entity({
  name: 'product',
})
export class ProductPgsql implements Product {
  @PrimaryColumn('uuid') id: string;

  @Column({ name: 'name', type: 'varchar' }) name: string;

  @Column({ name: 'code', type: 'varchar' }) code: string;

  @Column({ name: 'last_modified', type: 'timestamp' }) lastModified: Date;
}
