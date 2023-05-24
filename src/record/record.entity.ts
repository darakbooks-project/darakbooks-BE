import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { CreateRecordDTO } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { isArray, isObject } from 'class-validator';
import { User } from 'src/user/user.entity';

@Entity()
export class Record {
    
    @PrimaryGeneratedColumn({name:'record_id'})
    recordId:number;
    @Column({name:'book_isbn'})
    bookIsbn: string;
    @Column()
    text: string;
    @Column({name:'record_img'})
    recordImg: string;
    @Column({name:'record_img_url'})
    recordImgUrl: string;
    @Column({ type: 'json', nullable: true })
    tags: { id: number, data: string }[] ;
    @ManyToOne(() => User, user => user.records)
    @Column({name:'user_id'})
    userId: string;
    @Column({name:'created_at', type: 'datetime'})
    createdAt:Date;
    @Column({nullable:true, name:'updated_at', type: 'datetime'})
    updatedAt:Date;
    @Column({ name:'read_at', type: 'datetime'})
    readAt:Date;
    
    @BeforeInsert()
    @BeforeUpdate()
    private convertDate(){
        if(typeof this.readAt === 'string'){
            this.readAt = new Date(this.readAt);
        }
    }

    @BeforeInsert()
    private addcreateAt(){
        this.createdAt = new Date();
    }

    @BeforeUpdate()
    private addupateAt(){
        this.updatedAt = new Date();
    }

    set update(dto: UpdateRecordDto){
        Object.assign(this,dto);
    }


}
