import { ApiProperty } from '@nestjs/swagger';
import { Course } from 'src/course/course.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';


@Entity()
export class Enrollment {
 
  @PrimaryGeneratedColumn()
  enrollmentId: number; 

  @ApiProperty({ description: 'UserCedula ' ,nullable: true})
  @Column()
	userCedula?: number;
 
  @ApiProperty()
  @Column({ type: 'timestamp' })
  enrollmentDate: Date; 

  @ApiProperty({ description: 'CourseId ' })
  @Column()
	courseCourseId: number;

 
    // Relación muchos a uno con Course
    @ManyToOne(() => Course, (course) => course.enrollments)
    @JoinColumn({ name: 'courseId' })  
    course: Course;
    
   // Relación muchos a uno con User
   @ManyToOne(() => User, (user) => user.enrollments, { nullable: true })
   @JoinColumn({ name: 'userCedula' })
   user: User;
}