import { Component, OnInit } from '@angular/core';
import { SettingControllerService } from '../../services/api/setting-controller/setting-controller.service';
import { Setting } from '../../model/setting';
import { AddressControllerService } from '../../services/api/address-controller/address-controller.service';
import { Location } from '../../model/Location';
import { Building } from '../../model/Building';
import { BuildingControllerService } from '../../services/api/building-controller/building-controller.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  constructor(
    private settingService: SettingControllerService,
    private addressService: AddressControllerService,
    private buildingService: BuildingControllerService
  ) {}

  setting: Setting = new Setting(0, '', 0, 0, 0, 0, 0, 0, 0, 0, 0, '');

  defaultLocation: Location;
  defaultBuilding: Building;

  locations: Location[];
  buildings: Building[];

  isLoading = false;

  ngOnInit() {
    this.loadLocations();
    this.loadBuildings();
    this.getSettingsInfo();
  }

  private loadLocations() {
    this.addressService
      .getAllLocations()
      .toPromise()
      .then(locations => {
        this.locations = locations;
      })
      .catch(err => {
        console.log(err);
      });
  }

  private loadBuildings() {
    this.buildingService
      .retrieveAllBuildings()
      .toPromise()
      .then(buildings => {
        this.buildings = buildings;
      })
      .catch(err => {
        console.log(err);
      });
  }

  // grabs settings information
  getSettingsInfo() {
    console.log('loading setting data from service...');
    this.isLoading = true;
    this.settingService
      .retrieveSetting(1)
      .toPromise()
      .then(setting => {
        console.log('retrieved setting data!');
        console.log(setting);

        this.setting = setting;

        this.addressService
          .getLocation(this.setting.defaultLocation)
          .toPromise()
          .then(location => {
            this.defaultLocation = location;
          })
          .catch(err => {
            console.log(err);
          });

        this.buildingService
          .retrieveBuilding(this.setting.defaultBuilding)
          .toPromise()
          .then(building => {
            this.defaultBuilding = building;
          })
          .catch(err => {
            console.log(err);
          });
        this.isLoading = false;
      })
      .catch(err => {
        console.log('error retrieving setting data.');
        console.log(err);
      });
  }

  // saves the settings information
  save() {
    console.log('saving settings...');
    this.isLoading = true;
    this.settingService
      .updateSetting(this.setting)
      .toPromise()
      .then(setting => {
        console.log('save success');
        this.isLoading = false;
      })
      .catch(err => {
        console.log(err);
      });
  }

  // resets the settings information
  reset(evt) {
    console.log('resetting settings');
    this.getSettingsInfo();
    evt.preventDefault();
  }
}
