import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/access/auth.module';
import { ClientModule } from './modules/client/client.module';
import { OperatorModule } from './modules/operator/operator.module';
import { AdminModule } from './modules/admin/admin.module';
import { ConfigModule } from '@nestjs/config';

// Import modules
// import { DiagnosticsModule } from './modules/diagnostics/diagnostics.module';
// import { MaintenanceModule } from './modules/maintenance/maintenance.module';
// import { UsersModule } from './modules/users/users.module';
// import { VehiclesModule } from './modules/vehicles/vehicles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HealthModule,
    AuthModule,
    ClientModule,
    OperatorModule,
    AdminModule,
    // DiagnosticsModule,
    // MaintenanceModule,
    // UsersModule,
    // VehiclesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
