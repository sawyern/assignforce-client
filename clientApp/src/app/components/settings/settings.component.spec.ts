import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { FormsModule } from '@angular/forms';
import {
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatGridListModule,
  MatSelectModule,
  MatProgressBarModule
} from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SettingControllerService } from '../../services/api/setting-controller/setting-controller.service';
import { AddressControllerService } from '../../services/api/address-controller/address-controller.service';
import { BuildingControllerService } from '../../services/api/building-controller/building-controller.service';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  let mockClient;
  let settingService;
  let addressService;
  let buildingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatExpansionModule,
        MatGridListModule,
        MatSelectModule,
        MatProgressBarModule
      ],
      declarations: [SettingsComponent],
      providers: [
        { provide: HttpClient, useValue: mockClient },
        { provide: SettingControllerService, useValue: settingService },
        { provide: AddressControllerService, useValue: addressService },
        { provide: BuildingControllerService, useValue: buildingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    mockClient = TestBed.get(HttpClient);
    settingService = TestBed.get(SettingControllerService);
    addressService = TestBed.get(AddressControllerService);
    buildingService = TestBed.get(BuildingControllerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
