import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  Param,
  Request,
  Query,
  Patch,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AppointmentsService } from './appointments.service';
import { AppointmentDTO } from './dto/appointment.dto';
import { UserService } from 'src/user/user.service';
import { IWorkhour } from 'src/core/types/workhours';
import { getAvailableTimes } from './utlis';
import { SlotAppointmentDTO } from './dto/slot.dto';
import { AuthService } from 'src/auth/auth.service';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from 'src/mailer/mailer.service';
import { formatDate } from 'src/utils/format-date';
import { AppointmentsGateway } from './appointment.gateway';
import { CourtService } from 'src/court/court.service';
@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly appointmentService: AppointmentsService,
    private readonly courtService: CourtService,
    private authService: AuthService,
    private mailerSerivce: MailerService,
    private readonly appointmentsGateway: AppointmentsGateway,
  ) {}
  async getSlotsByDate(courtId: string, date: string, duration: number) {
    try {
      const court = await this.courtService.getById(courtId);
      if (!court) {
        throw new UnauthorizedException('La cancha ingresada no existe!.');
      }
      const appointmentsByCourt =
        await this.appointmentService.getByCourt(courtId);
      const selectedDate = new Date(date).getDay();
      const availableTimes = getAvailableTimes(
        court.workhours,
        selectedDate,
        duration,
        appointmentsByCourt.filter((appointment) => appointment.date === date),
      );

      const isAvaialable = (hs: string) => {
        if (appointmentsByCourt.filter((app) => app.time === hs).length === 0)
          return true;

        return !appointmentsByCourt
          .filter((app) => app.time === hs)
          .filter((app) => app.date === date)
          .some((app) => !app.canceled);
      };
      const res = availableTimes.map((hs) => ({
        hs,
        available: isAvaialable(hs),
      }));

      return {
        availableTimes: res,
        court,
      };
    } catch (error) {
      throw error;
    }
  }
  async validateAppointmentData(
    data: AppointmentDTO,
    workhours: IWorkhour[],
    duration: number,
  ) {
    try {
      const selectedWorkhours = workhours.find(
        (wh) => wh.day === new Date(data.date).getDay(),
      );
      if (!selectedWorkhours) {
        throw new UnauthorizedException('This day is not work day.');
      }
      for (const segment of selectedWorkhours.segments) {
        if (data.time >= segment.startime && data.time <= segment.endTime) {
          const { availableTimes } = await this.getSlotsByDate(
            data.CourtId,
            data.date,
            duration,
          );

          if (availableTimes.some((slot) => slot.hs === data.time)) {
            return true;
          }
        }
      }

      throw new UnauthorizedException('This time is not avaialble.');
    } catch (error) {
      throw error;
    }
  }
  @Get()
  async getAll() {
    try {
      return await this.appointmentService.getAll();
    } catch (error) {
      throw error;
    }
  }
  @Post('get-by-courts')
  async getByCourt(
    @Body()
    { courtId }: { courtId: string },
  ) {
    try {
      return await this.appointmentService.getByCourt(courtId);
    } catch (error) {
      throw error;
    }
  }
  @Post('court-slots')
  async memberSlots(
    @Body()
    { courtId, date, duration }: SlotAppointmentDTO,
  ) {
    try {
      return await this.getSlotsByDate(courtId, date, duration);
    } catch (error) {
      throw error;
    }
  }
  @Post()
  async create(@Body() data: AppointmentDTO) {
    try {
      const court = await this.courtService.getById(data.CourtId);
      if (!court) {
        throw new UnauthorizedException('Court not found.');
      }
      await this.validateAppointmentData(data, court.workhours, data.duration);
      //EN ESTE PUNTO LOS DATOS INGRESADOS PARA EL USUARIO, SERVICIO Y HORARIO, SON VALIDOS.

      // Ahora tenemos que validar que no haya un turno con esa misma data!
      const appointment = await this.appointmentService.findByAppointmentInfo({
        date: data.date,
        CourtId: data.CourtId,
        time: data.time,
      });
      if (appointment && !appointment.canceled) {
        throw new UnauthorizedException(
          'This appointment slot is not available.',
        );
      }

      //EN ESTE PUNTO: Los datos estan OK y se puede sacar el turno.
      const cancelationToken = uuidv4();
      const newAppointment = await this.appointmentService.create({
        ...data,
        duration: data.duration,
        canceled: false,
        CourtId: court.id,
        cancelationToken,
        confirmed: false,
        price: data.price,
      });
      // //   await this.mailerSerivce.sendAppointmentdata(data.email, {
      // //     cancelationToken,
      // //     day: formatDate(data.date.toString()),
      // //     name: `${customerData.firstName}, ${customerData.lastName}`,
      // //     service: service.title,
      // //     serviceProvision: service.provision,
      // //     time: data.time,
      // //     userName: `${user.name}, ${user.lastName}`,
      // //   });
      return newAppointment;

      // return 'Turno agendado';
    } catch (error) {
      throw error;
    }
  }
  @Post('cancel')
  async cancelAppointment(
    @Body()
    { appointmemntId }: { appointmemntId: string },
  ) {
    try {
      const appointment = await this.appointmentService.getById(appointmemntId);
      if (!appointment) {
        throw new UnauthorizedException('Appointment not found.');
      }

      await this.appointmentService.cancelAppointment(appointment);
      //   await this.mailerSerivce.sendCancelationOK(appointment.email, {
      //     day: formatDate(appointment.date.toString()),
      //     name: `${appointment.name}, ${appointment.lastName}`,
      //     service: service.title,
      //     serviceProvision: service.provision,
      //     time: appointment.time,
      //     userName: `${user.name}, ${user.lastName}`,
      //   });
      return 'Appointment cancelled succesfully!';
    } catch (error) {
      throw error;
    }
  }
  @Patch(':id')
  async update(@Body() data: Partial<AppointmentDTO>, @Param('id') id: string) {
    try {
      const appointment = await this.appointmentService.getById(id);
      if (!appointment) {
        throw new UnauthorizedException('Appointment not found.');
      }

      await this.appointmentService.update(appointment.id, data);
    } catch (error) {
      throw error;
    }
  }
}
