import { Injectable, OnModuleInit } from '@nestjs/common';
 import { CronJob } from 'cron';
 import { Cron, SchedulerRegistry } from '@nestjs/schedule';
 import { EventsService } from './events.service'; 
import { events } from './events.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
 
 @Injectable()
 export class EventsCronService implements OnModuleInit {
    constructor(
      private readonly schedulerRegistry: SchedulerRegistry,
      @InjectRepository(events)
      private readonly eventsRepository: Repository<events>,
    ) {}
  
    async onModuleInit() {
      
      const updateJob = new CronJob('0 */12 * * *', async () => {
        await this.checkAndUpdateEventStatus();
      });
  
      this.schedulerRegistry.addCronJob('updateEventStatusJob', updateJob);
  
    
      updateJob.start();
    }
  
  
    async checkAndUpdateEventStatus() {
      const currentDate = new Date();
      
      
      const ongoingEvents = await this.eventsRepository.find({
        where: { Status: 'Pendiente' }, 
      });
  
      for (const event of ongoingEvents) {
        const eventDate = new Date(event.Date);
  
        
        if (eventDate <= currentDate) {
          if (event.Status === 'Pendiente') { 
            event.Status = 'Finalizado';
            await this.eventsRepository.save(event);
          }
        }
      }
  
      console.log('Verificación de estado de eventos completada');
    
    }}