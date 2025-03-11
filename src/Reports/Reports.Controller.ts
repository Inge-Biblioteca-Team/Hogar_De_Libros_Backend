/* eslint-disable prettier/prettier */

import { Body, Controller, Post, Res } from '@nestjs/common';
import { ReportService } from './Reports.Service';
import { ReportDto } from './DTO';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Reportes')
@Controller('reports')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Post('download-WS-report')
  async downloadLoanReport(@Body() params: ReportDto, @Res() res: Response) {
    const pdfBuffer = await this.reportService.generateWSLoans(params);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Reporte_uso_computadores_${params.startDate}_${params.endDate}.pdf"`,
    });
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    res.send(pdfBuffer);
  }

  @Post('download-BL-report')
  async downloadBookLoanReport(
    @Body() params: ReportDto,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.reportService.generateBLoans(params);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Reporte_Prestamos_${params.startDate}_${params.endDate}.pdf"`,
    });
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    res.send(pdfBuffer);
  }

  @Post('download-CO-report')
  async downloadCoursesReport(@Body() params: ReportDto, @Res() res: Response) {
    const pdfBuffer = await this.reportService.generateCOReport(params);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Reporte_Cursos_${params.startDate}_${params.endDate}.pdf"`,
    });
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    res.send(pdfBuffer);
  }

  @Post('download-EV-report')
  async downloadEventsReport(@Body() params: ReportDto, @Res() res: Response) {
    const pdfBuffer = await this.reportService.generateEVReport(params);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Reporte_Eventos_${params.startDate}_${params.endDate}.pdf"`,
    });
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    res.send(pdfBuffer);
  }

  @Post('download-AS-report')
  async downloadAttendanceReport(@Body() params: ReportDto, @Res() res: Response) {
    const pdfBuffer = await this.reportService.generateATTReport(params);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Reporte_Asistencia_${params.startDate}_${params.endDate}.pdf"`,
    });
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    res.send(pdfBuffer);
  }
}
