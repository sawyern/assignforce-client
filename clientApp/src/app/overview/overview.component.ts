import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Angular2Csv } from 'angular2-csv/Angular2-csv';
import {BatchService} from '../services/batch.service';
import {Batch} from '../domain/batch';
import {NotificationService} from '../services/notification.service';
import {SkillService} from '../services/skill.service';
import {CurriculaService} from '../services/curricula.service';
import {Curriculum} from '../domain/curriculum';
import {TrainerService} from '../services/trainer.service';
import {RoomService} from '../services/room.service';
import {BuildingService} from '../services/building.service';
import {LocationService} from '../services/location.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OverviewComponent implements OnInit, AfterViewInit {
  BatchData: Batch[];
  batchData = new MatTableDataSource(this.BatchData);
  filteredData: Batch[];
  batchValues = ['name', 'curriculumName', 'trainerName', 'location', 'building', 'room', 'startDate', 'endDate', 'progress'];

  color = 'warn';
  mode = 'determinate';
  bufferValue = 100;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private batchService: BatchService,
                private curriculaService: CurriculaService,
                private trainerService: TrainerService,
                private locationService: LocationService,
                private buildingService: BuildingService,
                private roomService: RoomService,
                private notificationService: NotificationService) {
    }

    ngOnInit() {
      this.getAll();
    }
  ngAfterViewInit() {
    this.batchData.sort = this.sort;
    this.batchData.paginator = this.paginator;
    this.batchData = new MatTableDataSource(this.BatchData);
  }

  exportToCSV(evt) {
    evt.stopPropagation();
   // this.csvService.download(this.dataSource, 'Batches');
    new Angular2Csv(this.BatchData, 'batches');
  }

  openMenu(evt) {
    evt.stopPropagation();
  }

  // error messages
  showToast(msg) {
    this.notificationService.openSnackBar(msg);
  }

  getAll() {
    this.batchService.getAll().subscribe(data => {
      this.BatchData = data;
      this.batchData = new MatTableDataSource(this.BatchData);
      const currentDate = new  Date();
      for (const entry of this.BatchData) {

        entry.progress = (currentDate.valueOf() - entry.startDate.valueOf()) / (entry.endDate.valueOf() - entry.startDate.valueOf()) * 100;
        this.curriculaService.getById(entry.curriculum)
          .subscribe(curriculumData => {
            entry.curriculumName = curriculumData.name;
          }, error => {
            this.showToast('Failed to fetch Curricula');
          });
        this.trainerService.getById(entry.trainer)
          .subscribe(trainerData => {
            entry.trainerName = trainerData.firstName + ' ' + trainerData.lastName;
          }, error => {
            this.showToast('Failed to fetch Trainers');
          });
        this.trainerService.getById(entry.cotrainer)
          .subscribe(cotrainerData => {
            entry.cotrainerName = cotrainerData.firstName + ' ' + cotrainerData.lastName;
          }, error => {
            this.showToast('Failed to fetch Trainers');
          });

        this.locationService.getById(entry.batchLocation.locationId)
          .subscribe(locationData => {
            entry.batchLocation.locationId = locationData.id;
            entry.batchLocation.locationName = locationData.name;
          }, error => {
            this.showToast('Failed to fetch Locations');
          });

        this.buildingService.getById(entry.batchLocation.buildingId)
          .subscribe(buildingData => {
            entry.batchLocation.buildingId = buildingData.id;
            entry.batchLocation.buildingName = buildingData.name;
          }, error => {
            this.showToast('Failed to fetch Buildings');
          });

        this.roomService.getById(entry.batchLocation.roomId)
          .subscribe(roomData => {
            entry.batchLocation.roomId = roomData.roomID;
            entry.batchLocation.roomName = roomData.roomName;
          }, error => {
            this.showToast('Failed to fetch Rooms');
          });
      }
      this.batchData = new MatTableDataSource(this.BatchData);
      this.batchData.sort = this.sort;
      this.batchData.paginator = this.paginator;
    }, error => {
        this.showToast('Failed to fetch Batches');
      }
    );
  }

  filterByProgress() {
      this.filteredData = this.BatchData.filter(
        batch => batch.progress > 0 && batch.progress < 100
      );
      this.batchData = new MatTableDataSource(this.filteredData);
      this.batchData.sort = this.sort;
      this.batchData.paginator = this.paginator;
  }

  filterByNone() {
      this.batchData = new MatTableDataSource(this.BatchData);
      this.batchData.sort = this.sort;
      this.batchData.paginator = this.paginator;
  }

  filterByTwoWeeksAhead() {
    let days = 14 * 1000 * 3600 * 24;

    this.filteredData = this.BatchData.filter(
      batch => ((batch.startDate.valueOf() - new Date().valueOf()) >= 0) &&
                        ((batch.startDate.valueOf() - new Date().valueOf()) <= days)
    );
    this.batchData = new MatTableDataSource(this.filteredData);
    this.batchData.sort = this.sort;
    this.batchData.paginator = this.paginator;
  }
}