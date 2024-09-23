import { Course } from 'src/course/course.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';


@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number; 

 
  @Column({ type: 'timestamp' })
  enrollmentDate: Date; 

  @Column({ default: 'Active' })
  status: string;

  // Relación muchos a muchos con Course
  @ManyToMany(() => Course, (course) => course.enrollments)
  courses: Course[];

   // Relación muchos a uno con User
   @ManyToOne(() => User, (user) => user.enrollments)
   @JoinColumn({ name: 'userCedula' })
   user: User;
}