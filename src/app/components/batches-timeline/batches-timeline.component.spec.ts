import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchesTimelineComponent } from './batches-timeline.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppMaterialModule } from '../../material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BatchesTimelineFilterComponent } from '../batches-timeline-filter/batches-timeline-filter.component';
import { BatchControllerService } from '../../services/api/batch-controller/batch-controller.service';
import { HttpClient } from '@angular/common/http';
import { TrainerControllerService } from '../../services/api/trainer-controller/trainer-controller.service';
import { CurriculumControllerService } from '../../services/api/curriculum-controller/curriculum-controller.service';
import { Trainer } from '../../model/Trainer';
import { FocusControllerService } from '../../services/api/focus-controller/focus-controller.service';
import { AddressControllerService } from '../../services/api/address-controller/address-controller.service';
import { RoomControllerService } from '../../services/api/room-controller/room-controller.service';
import { BuildingControllerService } from '../../services/api/building-controller/building-controller.service';
import { SettingControllerService } from '../../services/api/setting-controller/setting-controller.service';

describe('BatchesTimelineComponent', () => {
  let component: BatchesTimelineComponent;
  let fixture: ComponentFixture<BatchesTimelineComponent>;
  let batchControllerService: BatchControllerService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          AppMaterialModule,
          ReactiveFormsModule,
          FormsModule,
          HttpClientTestingModule,
          BrowserAnimationsModule
        ],
        declarations: [BatchesTimelineComponent, BatchesTimelineFilterComponent],
        providers: [
          TrainerControllerService,
          BatchControllerService,
          SettingControllerService,
          CurriculumControllerService,
          FocusControllerService,
          AddressControllerService,
          RoomControllerService,
          BuildingControllerService
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchesTimelineComponent);
    component = fixture.componentInstance;
    batchControllerService = TestBed.get(BatchControllerService);
    // trainerControllerService = TestBed.get(trainerControllerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the today line', () => {
    component.updateTodayLine();
    expect(component.todayLine.x1).not.toBeNull();
    expect(component.todayLine.x2).not.toBeNull();
    expect(component.todayLine.y1).not.toBeNull();
    expect(component.todayLine.y2).not.toBeNull();
  });

  it('should return the rectangles for the batches', async done => {
    component.updateBatches();
    done();
    const rects = component.getBatchesRectangles();
    expect(rects.length).toEqual(component.batches.length);
  });

  it('should return the list of swimlane lines', () => {
    expect(component.getSwimlanes().length).toEqual(component.trainers.length + 1);
  });

  it('should set the list of trainers', () => {
    component.updateTrainers();
    expect(component.trainers).toBeTruthy();
  });

  it('should return the list of trainers with positions', async done => {
    component.updateBatches();
    done();
    const trainers = component.getTrainers();
    let expectedAmount = component.trainers.length;
    if (expectedAmount === 0) {
      expectedAmount = 1;
    }
    expect(trainers.length).toEqual(expectedAmount);
    expect(trainers[0].name).toBeTruthy();
    expect(trainers[0].left).toBeTruthy();
    expect(trainers[0].width).toBeTruthy();
  });

  it('should get a different color for each core curriculum', () => {
    const jcolor = component.getColorForcurriculum(13);
    const scolor = component.getColorForcurriculum(14);
    const dcolor = component.getColorForcurriculum(15);
    const ccolor = component.getColorForcurriculum(16);
    expect(jcolor).not.toEqual(scolor);
    expect(jcolor).not.toEqual(dcolor);
    expect(jcolor).not.toEqual(ccolor);
    expect(scolor).not.toEqual(dcolor);
    expect(scolor).not.toEqual(ccolor);
    expect(dcolor).not.toEqual(ccolor);
  });

  it('should return a list of months and their position', () => {
    const months = component.getTimescale();
    expect(months.length).toBeGreaterThan(1);
  });

  it('should zoom the page', () => {
    const prezoom = component.endDate.valueOf() - component.startDate.valueOf();
    const zoomFactor = 2;
    component.startZoom(100);
    component.zoomBy(zoomFactor);
    component.finishZoom();
    expect(component.endDate.valueOf() - component.startDate.valueOf()).toEqual(zoomFactor * prezoom);
  });

  it('should change the mode', () => {
    component.startSwimMode();
    expect(component.swimActive).toBeTruthy();
    expect(component.swimPoints).toEqual(0);
    expect(component.swimPos.x).toBeGreaterThan(0);
    component.finishSwimMode();
    expect(component.swimActive).toBeFalsy();
  });

  it('should set the tooltip', () => {
    component.updateTooltip(0, { x: 1, y: 1 });
    expect(component.tooltipRect.x).toEqual(0);
  });
  it('should interpolate', () => {
    expect(component.linearInterpolation(10, 20, 0.5)).toEqual(15);
    expect(component.linearInterpolation(10000, 2000, 0.75)).toEqual(4000);
    expect(component.linearInterpolation(-20, 0, 1)).toEqual(0);
  });
  it('should add a batch', () => {
    component.batches = [];
    component.trainers.push(new Trainer(4, null, null, null, null, null, null, null));
    component.addRandomBatch(10000);
    expect(component.batches.length).toBeGreaterThan(0);
  });
  it('should convert the date to a position', () => {
    const ypos = component.dateToYPos(Date.now() + 1000 * 60 * 60 * 24 * 7 * 3); // now + 3 weeks
    expect(ypos).toBeGreaterThan(0); // should return a positive value
  });
  it('should convert the date to a position', () => {
    const dateval = component.yPosToDate(20);
    expect(dateval).toBeLessThan(Date.now()); // should return a value before today
    expect(dateval).toBeGreaterThan(component.startValue); // and after graph start
  });
  it('should get the timescale', () => {
    const ts = component.getTimescale();
    expect(ts.length).toBeGreaterThan(0);
  });
  it('should get the line breaks', () => {
    const lb = component.getBreaks();
    expect(lb.length).toEqual(component.trainersOnThisPage);
  });
  it('should get the lines between batches', () => {
    const bl = component.getBatchLanes();
    expect(bl.length).toEqual(component.trainersOnThisPage);
  });
  it('should shift the graph', () => {
    const predate = component.startValue;
    component.shiftBy(50);
    expect(component.startValue).toBeGreaterThan(predate);
    component.shiftBy(-50);
    expect(component.startValue).toEqual(predate);
  });
});
