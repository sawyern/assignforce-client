import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SpringXsrfInterceptor } from './interceptors/springXsrfInterceptor';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { OverviewComponent } from './components/overview/overview.component';
import { BatchesComponent } from './components/batches/batches.component';
import {
  // LocationAddBuildingDialogComponent,
  LocationAddLocationDialogComponent,
  LocationAddRoomDialogComponent,
  LocationDeleteBuildingDialogComponent,
  LocationDeleteLocationDialogComponent,
  LocationDeleteRoomDialogComponent,
  LocationEditBuildingDialogComponent,
  LocationEditLocationDialogComponent,
  LocationEditRoomDialogComponent,
  LocationsComponent
} from './components/locations/locations.component';
import { LocationAddDialogComponent } from './components/locations/add-dialog/location-add-dialog.component';
import { CurriculaComponent } from './components/curricula/curricula.component';
import { TrainersComponent } from './components/trainers/trainers.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AppRouting } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TrainerService } from './services/trainer/trainer.service';
import { SkillService } from './services/skill/skill.service';
import { S3CredentialService } from './services/s3-credential/s3-credential.service';
import { UrlService } from './services/url/url.service';

import { LoginComponent } from './components/login/login.component';
import { AppMaterialModule } from './material.module';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemDbService } from './mockdb/in-mem-db.service';

import { TrainersAddComponent } from './components/trainers/trainers-add/trainers-add.component';
import { TrainerItemComponent } from './components/trainers/trainer-item/trainer-item.component';
import { BatchControllerService } from './services/api/batch-controller/batch-controller.service';
import { AddressControllerService } from './services/api/address-controller/address-controller.service';
import { BuildingControllerService } from './services/api/building-controller/building-controller.service';
import { LocationControllerService } from './services/api/location-controller/location-controller.service';
import { CurriculumControllerService } from './services/api/curriculum-controller/curriculum-controller.service';
import { SettingControllerService } from './services/api/setting-controller/setting-controller.service';
import { SkillControllerService } from './services/api/skill-controller/skill-controller.service';
import { TrainerControllerService } from './services/api/trainer-controller/trainer-controller.service';
import { UnavailableControllerService } from './services/api/unavailable-controller/unavailable-controller.service';

@NgModule({
  declarations: [
    AppComponent,
    MenuBarComponent,
    OverviewComponent,
    BatchesComponent,
    LocationsComponent,
    CurriculaComponent,
    TrainersComponent,
    ProfileComponent,
    ReportsComponent,
    SettingsComponent,
    LocationAddLocationDialogComponent,
    LocationDeleteLocationDialogComponent,
    LocationEditLocationDialogComponent,
    LocationAddDialogComponent, // LocationAddBuildingDialogComponent,
    LocationDeleteBuildingDialogComponent,
    LocationEditBuildingDialogComponent,
    LocationAddRoomDialogComponent,
    LocationDeleteRoomDialogComponent,
    LocationEditRoomDialogComponent,
    LoginComponent,
    TrainersAddComponent,
    TrainerItemComponent
  ],

  imports: [
    HttpClientModule,
    FormsModule,
    BrowserModule,
    AppRouting,
    BrowserAnimationsModule,
    AppMaterialModule,
    InMemoryWebApiModule.forRoot(InMemDbService)
  ],

  providers: [
    TrainerService,
    SkillService,
    S3CredentialService,
    HttpClient,
    UrlService,
    BatchControllerService,
    AddressControllerService,
    BuildingControllerService,
    LocationControllerService,
    CurriculumControllerService,
    SettingControllerService,
    SkillControllerService,
    TrainerControllerService,
    UnavailableControllerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpringXsrfInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    LocationAddLocationDialogComponent,
    LocationDeleteLocationDialogComponent,
    LocationEditLocationDialogComponent,
    LocationAddDialogComponent, // LocationAddBuildingDialogComponent,
    LocationDeleteBuildingDialogComponent,
    LocationEditBuildingDialogComponent,
    LocationAddRoomDialogComponent,
    LocationDeleteRoomDialogComponent,
    LocationEditRoomDialogComponent,
    TrainersAddComponent
  ]
})
export class AppModule {}
