import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { Batch } from '../../model/Batch';
import { BatchControllerService } from '../../services/api/batch-controller/batch-controller.service';
import { MatSelectChange, MatCheckboxChange, MatOption } from '@angular/material';
import { TrainerControllerService } from '../../services/api/trainer-controller/trainer-controller.service';
import { Trainer } from '../../model/Trainer';
import { Curriculum } from '../../model/Curriculum';
import { Address } from '../../model/Address';
import { Building } from '../../model/Building';
import { Room } from '../../model/Room';
import { SettingControllerService } from '../../services/api/setting-controller/setting-controller.service';

@Component({
  selector: 'app-batches-timeline',
  templateUrl: './batches-timeline.component.html',
  styleUrls: ['./batches-timeline.component.css']
})
export class BatchesTimelineComponent implements OnInit, AfterViewInit {
  // root element of the timeline. used for getting the relative mouse position
  @ViewChild('timelineroot') timelineRootElement: ElementRef;
  // trainer name. used to set the width
  @ViewChild('trainernames') trainernamesElement: ElementRef;
  // trainer name. used to set the width
  @ViewChildren('tooltiptext') tooltipTexts;

  // dynamic values for formatting
  width = 1536;
  swimlaneXOfs = 100;
  columnWidth = 50;
  loading = false;
  // static values for formatting
  height = 2067;
  minColumnWidth = 26;
  maxColumnWidth = 100;
  minWidth = 400;
  swimlaneYOfs = 20;
  timescaleXOfs = 80;
  DEFAULT_PRECEEDING_MONTHS = 3;
  DEFAULT_PROCEEDING_MONTHS = 6;
  ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

  // editable data
  startDate: Date;
  endDate: Date;
  curriculumFilter = 'Any';
  focusFilter = 'Any';
  locationFilter = 'Any';
  buildingFilter = 'Any';
  hideBatchlessTrainers = false;
  hideConcludedBatches = false;
  hideInactiveTrainers = false;
  trainersPerPage = 0;
  actualTrainersPerPage = 0;
  currentPage = 0;
  maxPages = 1;
  trainersOnThisPage = 0;

  startValue: number;
  endValue: number;
  todayLine = { x1: 0, x2: 0, y1: 0, y2: 0 };

  // months and day of weeks
  fullMonthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  dayOfWeekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
  timescaleEnabled = true;

  // zooming
  zoomingEnabled = true;
  zooming = false;
  minZoom = 1000 * 60 * 60 * 12; // 1/2 a day
  maxZoom = 1000 * 60 * 60 * 24 * 365 * 2000; // 2000 years
  zoomingFrom: number;
  zoomingFromDate: number;
  zoomingLine = { x1: 0, x2: 0, y1: 0, y2: 0 };
  preZoomBeforeDuration: number;
  preZoomAfterDuration: number;
  zoomScale = 0.01; // px to zoom scale
  shifting = false;

  // useful keycodes
  keycodes = {
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    space: 32,
    primary: 66,
    secondary: 65,
    z: 90,
    tilde: 192,
    p: 80,
    enter: 13,
    tab: 9,
    plus: 187,
    minus: 189,
    esc: 27
  };
  keyBoardScrollEnabled = true;
  keyScrollSpeed = 0.01;

  // swimmer
  swimActive = false;
  swimPos = { x: 0, y: 0, color: '#000000', r: 0, points: { x: 0, y: 0 }, highpoints: { x: 0, y: 0 } };
  swimGauge = { value: 0, y1: 0, y2: 0, bgy1: 0, bgy2: 0, x1: 0, x2: 0, bgx1: 0, bgx2: 0, w: 0 };
  swimDots = [];
  swimLane = 0;
  swimStartProgress = 0;
  swimDown = false;
  swimPoints = 0;
  swimHigh = 0;
  swimPaused = false;

  // random mode
  randomModeActive = false;

  // tooltip
  tooltipActive = false;
  tooltipRect = { x: 0, y: 0, w: 0, h: 0, linespacing: 15, color: '#000000cc', triangle: '0,0 0,0 0,0' };
  tooltipData = [];
  tooltipLastBatch = null;
  tooltipTimeoutDur = 120;
  tooltipTimeoutTimer = null;
  tooltipSetThisFrame = false;
  tooltipDefaultColor = '#ffffff';
  tooltipTitleColor = '#FFA500';
  tooltipMidSectionColor = '#FFD700';
  tooltipNoneColor = '#FF6347';

  // cached data
  batches: Batch[] = [];
  trainers: Trainer[] = [];

  constructor(
    private batchController: BatchControllerService,
    private trainerController: TrainerControllerService,
    private settingControllerService: SettingControllerService
  ) {}

  // initialize data
  ngOnInit() {
    this.loadInitialDates();
    this.currentPage = 0;
    this.updateSettings();
    this.updateBatches();
    this.updateTrainers();
  }

  // set initial values for start and end dates
  loadInitialDates() {
    // start date
    const preceedingDate = new Date();
    preceedingDate.setMonth(preceedingDate.getMonth() - this.DEFAULT_PRECEEDING_MONTHS);
    this.startValue = preceedingDate.valueOf();
    // console.log(this.startDate);
    // end date
    const proceedingDate = new Date();
    proceedingDate.setMonth(proceedingDate.getMonth() + this.DEFAULT_PROCEEDING_MONTHS);
    this.endValue = proceedingDate.valueOf();
    // console.log(this.endDate);
    this.updateDateFilters();
  }

  // setup page size
  ngAfterViewInit() {
    // causes exception if done without a delay
    setTimeout(() => {
      this.updateSize();
    }, 0);
  }

  // this is called when any of the filters are changed
  onFilterChange(event) {
    // get id and value from the event
    let id = '';
    let value;
    if (event instanceof MatSelectChange) {
      id = event.source.id;
      const matopt = event.source.selected;
      if (matopt instanceof MatOption) {
        value = matopt.viewValue;
      }
    } else if (event instanceof MatCheckboxChange) {
      id = event.source.id;
      value = event.checked;
    } else if (event instanceof MatCheckboxChange) {
      id = event.source.id;
      value = event.checked;
    } else if (event.targetElement != null) {
      // mat input date event
      id = event.targetElement.id;
      value = event.value;
    } else if (event.target != null) {
      id = event.target.id;
      if (event.value != null) {
        value = event.value;
      } else {
        value = event.target.value;
      }
    }
    // console.log('update filter ' + id + ': ' + value);
    // handle the event with the specified id
    const filterIds = {
      startDate: 'startDate',
      endDate: 'endDate',
      curriculum: 'curriculum',
      focus: 'focus',
      location: 'location',
      building: 'building',
      hideConcluded: 'hideconcluded',
      hideBatchless: 'hidebatchless',
      hideInactiveTrainers: 'hideinactive',
      trainersPerPage: 'trainersperpage',
      currentPage: 'currentpage',
      firstPage: 'firstpage',
      lastPage: 'lastpage',
      prevPage: 'previouspage',
      nextPage: 'nextpage'
    };
    if (id === filterIds.startDate) {
      // date filters
      this.startValue = value;
      this.updateTodayLine();
    } else if (id === filterIds.endDate) {
      this.endValue = value;
      this.updateTodayLine();
    } else if (id === filterIds.curriculum) {
      // batch type filters
      this.curriculumFilter = value;
      this.updateBatches();
    } else if (id === filterIds.focus) {
      this.focusFilter = value;
      this.updateBatches();
    } else if (id === filterIds.location) {
      this.locationFilter = value;
      this.updateBatches();
    } else if (id === filterIds.building) {
      this.buildingFilter = value;
      this.updateBatches();
    } else if (id === filterIds.hideConcluded) {
      // hide filters
      this.hideConcludedBatches = value;
      this.updateBatches();
      this.updateTrainers();
    } else if (id === filterIds.hideBatchless) {
      this.hideBatchlessTrainers = value;
      this.updateTrainers();
    } else if (id === filterIds.hideInactiveTrainers) {
      this.hideInactiveTrainers = value;
      this.updateTrainers();
    } else if (id === filterIds.trainersPerPage) {
      // page filters
      this.trainersPerPage = Math.max(0, Number.parseInt(value));
      this.updatePage();
    } else if (id === filterIds.currentPage) {
      this.currentPage = Math.max(0, value);
      this.updatePage();
    } else if (id === filterIds.firstPage) {
      this.currentPage = 0;
      this.updatePage();
    } else if (id === filterIds.lastPage) {
      this.currentPage = this.maxPages;
      this.updatePage();
    } else if (id === filterIds.prevPage) {
      this.currentPage = Math.max(0, this.currentPage - 1);
      this.updatePage();
    } else if (id === filterIds.nextPage) {
      this.currentPage = this.currentPage + 1;
      this.updatePage();
    } else {
      // unknown event!
      console.log('unknown event filter triggered! ' + event + '\n' + event.target);
    }
  }

  // updates the max pages
  updatePage() {
    if (this.trainersPerPage > this.trainers.length) {
      this.actualTrainersPerPage = this.trainers.length;
    }
    if (this.trainersPerPage === 0) {
      this.actualTrainersPerPage = this.trainers.length;
      this.maxPages = 0;
      this.currentPage = 0;
    } else {
      this.actualTrainersPerPage = this.trainersPerPage;
      // update max page value
      this.maxPages = Math.floor((this.trainers.length - 0.5) / this.actualTrainersPerPage);
      this.currentPage = Math.min(this.currentPage, this.maxPages);
    }

    // find the number of trainers on the current page
    this.trainersOnThisPage = Math.min(
      this.trainers.length - this.currentPage * this.actualTrainersPerPage,
      this.actualTrainersPerPage
    );
    this.updateSize();
  }

  // gets an updated list of batches
  updateBatches() {
    // console.log('updating batches...');
    this.loading = true;
    this.batchController.findAll().subscribe(
      result => {
        this.batches = [];
        if (result.length === 0) {
          console.log('no batches loaded!');
          return;
        }
        for (let i = 0; i < result.length; i++) {
          const batch = result[i];
          // filter concluded batches
          if (this.hideConcludedBatches) {
            if (batch.endDate < Date.now()) {
              continue;
            }
          }
          // filter by type
          if (this.curriculumFilter !== 'Any') {
            if (batch.curriculum.name !== this.curriculumFilter) {
              continue;
            }
          }
          if (this.focusFilter !== 'Any') {
            if (batch.focus != null && batch.focus.name !== this.focusFilter) {
              continue;
            }
          }
          if (this.locationFilter !== 'Any') {
            if (batch.address.name !== this.locationFilter) {
              continue;
            }
          }
          if (this.buildingFilter !== 'Any') {
            if (batch.building.name !== this.buildingFilter) {
              continue;
            }
          }
          // add it
          if (typeof batch.startDate !== 'number') {
            batch.startDate = new Date(batch.startDate).valueOf();
            batch.endDate = new Date(batch.endDate).valueOf();
          }
          this.batches.push(batch);
        }
        this.loading = false;
      },
      err => {
        console.log('failed to load batches ', err);
      }
    );
  }

  // gets the list of trainers
  updateTrainers() {
    // console.log('updating trainers...');
    this.loading = true;
    this.trainerController.findAll().subscribe(
      result => {
        this.trainers = [];
        if (result.length === 0) {
          console.log('no trainers loaded!');
          this.updatePage();
          return;
        }
        for (let i = 0; i < result.length; i++) {
          const trainer = result[i];
          // filter batchless trainers
          if (this.hideBatchlessTrainers) {
            let hasBatch = false;
            for (const batch of this.batches) {
              if (batch.trainer.id === trainer.id) {
                hasBatch = true;
                break;
              }
            }
            if (!hasBatch) {
              continue;
            }
          }
          // filter inactive trainers
          if (this.hideInactiveTrainers) {
            if (!trainer.active) {
              continue;
            }
          }
          this.trainers.push(trainer);
        }
        this.updatePage();
        this.loading = false;
      },
      err => {
        console.log('failed to load trainers ', err);
      }
    );
  }

  updateSettings() {
    this.settingControllerService.find().subscribe(result => {
      const setting = result[0];
      this.trainersPerPage = setting.trainersPerPage;
      this.updatePage();
    });
  }

  // updates the start and end date filters
  updateDateFilters() {
    this.startDate = new Date(this.startValue);
    this.endDate = new Date(this.endValue);
  }

  // sets size of the svg graphic to fit the screen
  updateSize() {
    // set width to be the same size as the trainernames div, as it scales with the page
    this.width = this.trainernamesElement.nativeElement.getBoundingClientRect().width;
    this.width = Math.max(this.minWidth, this.width);
    this.height = this.width * 2;
    this.swimlaneXOfs = this.width * 0.5 - this.trainersOnThisPage * 0.5 * this.columnWidth;
    this.swimlaneXOfs = Math.max(this.timescaleXOfs + 10, this.swimlaneXOfs);

    // update column width
    const col_wid = (this.width - this.timescaleXOfs) / this.trainersOnThisPage - 5;
    this.columnWidth = Math.min(this.maxColumnWidth, Math.max(this.minColumnWidth, col_wid));

    // console.log(this.width + ' ' + this.height);
    this.finishSwimMode();
    this.updateTodayLine();
  }

  // updates the line for today
  updateTodayLine() {
    // calculate position of today_line
    this.updateDateFilters();
    const y = this.dateToYPos(Date.now());
    this.todayLine = { x1: this.timescaleXOfs, x2: this.width, y1: y, y2: y };
  }

  // makes a simple object for a tooltip line for reuseablility
  getTooltipExists(text: String, value: String) {
    return [
      { text: text + ': ', color: this.tooltipDefaultColor },
      { text: value, color: this.tooltipMidSectionColor }
    ];
  }
  getTooltipNone(text: String) {
    return [
      { text: 'No ' + text.toLowerCase() + ' ', color: this.tooltipNoneColor },
      { text: 'for this batch.', color: this.tooltipDefaultColor }
    ];
  }

  // sets the tooltip rect and tooltip data
  updateTooltip(batchid, mousepos) {
    // hide tooltip if zooming or mouse is out of range
    if (this.zooming || mousepos.y < 0) {
      this.tooltipActive = false;
      return;
    }

    // get batch from id
    batchid = batchid.toString().split('-')[1];
    let batch: Batch = null;
    for (let i = 0; i < this.batches.length; i++) {
      const b = this.batches[i];
      if (b.id.toString() === batchid) {
        batch = b;
        break;
      }
    }
    if (batch == null) {
      // console.log('no batch with id ' + batchid);
      this.tooltipActive = false;
      return;
    }

    // only need to do setup once
    if (this.tooltipLastBatch !== batch) {
      this.tooltipLastBatch = batch;

      // create text that goes on the tooltip
      const lines = [];
      if (batch.curriculum != null) {
        lines.push([
          { text: batch.curriculum.name, color: this.tooltipTitleColor },
          { text: ' Batch', color: this.tooltipDefaultColor }
        ]);
      } else {
        lines.push(this.getTooltipNone('core curriculum'));
      }
      if (batch.focus != null) {
        lines.push([
          { text: 'w/ focus on ', color: this.tooltipDefaultColor },
          { text: batch.focus.name, color: this.tooltipTitleColor }
        ]);
      } else {
        lines.push([
          { text: 'w/', color: this.tooltipDefaultColor },
          { text: 'no focus.', color: this.tooltipNoneColor }
        ]);
      }

      lines.push([{ text: '----------', color: this.tooltipDefaultColor }]);

      if (batch.trainer != null) {
        lines.push(this.getTooltipExists('Trainer', batch.trainer.firstName + ' ' + batch.trainer.lastName));
      } else {
        lines.push(this.getTooltipNone('Trainer'));
      }
      if (batch.cotrainer != null) {
        lines.push(this.getTooltipExists('Cotrainer', batch.cotrainer.firstName + ' ' + batch.cotrainer.lastName));
      } else {
        lines.push(this.getTooltipNone('Cotrainer'));
      }
      if (batch.startDate != null) {
        lines.push(this.getTooltipExists('Start Date', new Date(batch.startDate).toDateString()));
      } else {
        lines.push(this.getTooltipNone('Start Date'));
      }
      if (batch.endDate != null) {
        lines.push(this.getTooltipExists('End Date', new Date(batch.endDate).toDateString()));
      } else {
        lines.push(this.getTooltipNone('End Date'));
      }

      lines.push([{ text: '----------', color: this.tooltipDefaultColor }]);

      if (batch.address != null) {
        lines.push(this.getTooltipExists('Location', batch.address.name));
      } else {
        lines.push(this.getTooltipNone('Location'));
      }
      if (batch.building != null) {
        lines.push(this.getTooltipExists('Building', batch.building.name));
      } else {
        lines.push(this.getTooltipNone('Building'));
      }
      if (batch.room != null) {
        lines.push(this.getTooltipExists('Room', batch.room.roomName));
      } else {
        lines.push(this.getTooltipNone('Room'));
      }

      // dynamic width
      let rectw = 250;
      // after lines have been set,
      setTimeout(() => {
        // find the longest line
        rectw = 0;
        const texts = this.tooltipTexts.toArray();
        for (let i = 0; i < texts.length; i++) {
          const ttwidth = texts[i].nativeElement.getBoundingClientRect().width;
          // console.log(texts[i].nativeElement);
          if (ttwidth > rectw) {
            rectw = ttwidth;
          }
        }
        if (rectw < 100) {
          // text wasnt loaded!
          // console.log('tooltip text hasnt loaded in time for dynamic width');
          return;
        }
        rectw += 6;
        this.tooltipRect.w = rectw;
      }, 0);

      // get positioning of the tooltip rect
      const recth = this.tooltipRect.linespacing * lines.length + 5;

      // update values
      this.tooltipData = lines;
      this.tooltipRect.w = rectw;
      this.tooltipRect.h = recth;
    }

    // set every time
    this.tooltipActive = true;
    const rectx = mousepos.x - this.tooltipRect.w / 2;
    let recty = mousepos.y - this.tooltipRect.h - 12;
    let tricentery = mousepos.y - 2;
    let tridir = -10;

    // flip tooltip if too high
    // get the rect top relative to the screen and trainernames sticky
    const screen_mouse_pos_y =
      mousepos.y +
      this.timelineRootElement.nativeElement.getBoundingClientRect().top -
      this.trainernamesElement.nativeElement.getBoundingClientRect().height;
    const screen_rel_rect_y = screen_mouse_pos_y - this.tooltipRect.h - 12;
    if (recty < 0 || screen_rel_rect_y < 0) {
      recty = mousepos.y + 15;
      tricentery = mousepos.y + 5;
      tridir = 10;
    }
    const triangle_points =
      mousepos.x -
      5 +
      ',' +
      (tricentery + tridir) +
      ' ' +
      mousepos.x +
      ',' +
      tricentery +
      ' ' +
      (mousepos.x + 5) +
      ',' +
      (tricentery + tridir);

    this.tooltipRect.x = rectx;
    this.tooltipRect.y = recty;
    this.tooltipRect.triangle = triangle_points;

    // clear timeout
    if (this.tooltipTimeoutTimer != null) {
      // console.log("clearing timeout");
      clearTimeout(this.tooltipTimeoutTimer);
      this.tooltipTimeoutTimer = null;
    }
    this.tooltipSetThisFrame = true;
  }

  // called when mouse moves, and it may not be over a batch
  updateTooltipVisibility() {
    // if tooltip was not just set
    if (!this.tooltipSetThisFrame) {
      // and the tooltip is active, and the timer is not already set
      if (this.tooltipActive && this.tooltipTimeoutTimer == null) {
        // start timeout
        // console.log("starting tooltip timeout timer");
        this.tooltipTimeoutTimer = setTimeout(() => {
          // hide the tooltip
          // console.log("tooltip time out");
          this.tooltipActive = false;
          this.tooltipTimeoutTimer = null;
        }, this.tooltipTimeoutDur);
      }
    }
    this.tooltipSetThisFrame = false;
  }

  // returns the appropriate color for the core curriculum type
  getColorForcurriculum(currId: number) {
    let color = '';
    switch (currId) {
      case 13:
        color = '#1c77b4'; // java
        break;
      case 14:
        color = '#ff7f0e'; // .net
        break;
      case 15:
        color = '#aec7e8'; // sdet
        break;
      case 16:
        color = '#D5F5E3'; // uh
        break;
      case 17:
        color = '#ffbb78'; // custom
        break;
      default:
        color = '#dddddd'; // other
        break;
    }
    return color;
  }

  // returns the list of rectangles that represent each batch
  getBatchesRectangles() {
    const rects = [];
    // no batches
    if (this.batches.length === 0) {
      return rects;
    }
    const full_duration = this.endValue - this.startValue;

    // text mode to use by pixel height
    const txtlongpx = 105;
    const txtshortpx = 30;
    const txtnumpx = 0;
    // make a rectangle for each batch
    for (let i = 0; i < this.batches.length; i++) {
      const batch: Batch = this.batches[i];
      // valueOf gives us ms, convert to weeks to get the duration this event takes
      let duration = batch.endDate - batch.startDate;
      duration = Math.floor(duration / this.ONE_WEEK);

      // get the correct color
      const color = this.getColorForcurriculum(batch.curriculum.id);

      // get the column this batch will be in
      let trainer_index = this.trainers.findIndex(t => t.id === batch.trainer.id);
      if (trainer_index < 0) {
        // this batch has no trainer, it may have been filtered
        continue;
      }
      // only show batches on this page
      trainer_index -= this.currentPage * this.actualTrainersPerPage;
      if (trainer_index < 0 || trainer_index >= this.trainersOnThisPage) {
        continue;
      }

      // todo set width dynamically ?
      const w = 25;

      // get the top left position of the rectangle
      const x = this.swimlaneXOfs + trainer_index * this.columnWidth + (this.columnWidth - w) * 0.5;
      const y = this.dateToYPos(batch.startDate);
      // calculate height from the top and bottom of the rectangle
      const endy = this.dateToYPos(batch.endDate);
      const h = endy - y;

      // change label based on height of rectangle
      const labelx = x + w * 0.25;
      let labely = y + 20;
      let labeltext = '';
      if (h > txtlongpx) {
        // spell out weeks
        labeltext = 'WEEKS';
        labely = y + 25;
      } else if (h > txtshortpx) {
        // only have number and w
        labeltext = 'W';
        labely = y + 15;
      } else if (h >= txtnumpx) {
        // only number
        labeltext = '';
        labely = y - 2;
      } else {
        // console.warn('batch rectangle height is negative!' + y + ' ' + endy);
        continue;
      }
      // get the text that will be put into the rectangle
      const label = duration
        .toString()
        .split(' ')
        .concat(labeltext.split(''));

      //console.log('batch ' + batch.name + '\n rect: ' + ' x:' + x + ' y:' + y + ' h:' + h);
      rects.push({
        x: x,
        y: y,
        w: w,
        h: h,
        id: 'batch-' + batch.id,
        label: label,
        labelx: labelx,
        labely: labely,
        color: color
      });
    }
    return rects;
  }

  // returns a list of the lines that seperate columns
  getSwimlanes() {
    const lines = [];
    // make 1 more swimlane than the amount of trainers
    for (let i = 0; i < this.trainersOnThisPage + 1; i++) {
      const xpos = this.swimlaneXOfs + i * this.columnWidth;
      lines.push({ x1: xpos, y1: this.swimlaneYOfs, x2: xpos, y2: this.height - this.swimlaneYOfs });
    }
    return lines;
  }

  // get lines that run between the batches
  getBatchLanes() {
    const lines = [];
    for (let i = 0; i < this.trainersOnThisPage; i++) {
      const xpos = this.swimlaneXOfs + (i + 0.5) * this.columnWidth;
      lines.push({ x1: xpos, y1: this.swimlaneYOfs, x2: xpos, y2: this.height });
    }
    return lines;
  }

  // get durations between batches and their positions
  getBreaks() {
    // batches seperated by trainer
    const trainerBatches = [];
    for (let i = 0; i < this.trainers.length; i++) {
      const batchSet = [];
      for (let j = 0; j < this.batches.length; j++) {
        if (this.batches[j].trainer.id === this.trainers[i].id) {
          batchSet.push(this.batches[j]);
        }
      }
      trainerBatches.push(batchSet);
    }
    // reorder them by increasing start date
    for (let k = 0; k < trainerBatches.length; k++) {
      trainerBatches[k].sort(function(a, b) {
        return a.startDate - b.startDate;
      });
    }
    const midPoints = [];
    for (let l = 0; l < trainerBatches.length; l++) {
      const xindex = l - this.actualTrainersPerPage * this.currentPage;
      if (xindex < 0 || xindex >= this.trainersOnThisPage) {
        continue;
      }
      const xpos = this.swimlaneXOfs + (xindex + 0.5) * this.columnWidth + 5;
      if (trainerBatches[l].length > 1) {
        for (let m = 0; m < trainerBatches[l].length - 1; m++) {
          const gap = trainerBatches[l][m + 1].startDate - trainerBatches[l][m].endDate;
          const duration = Math.floor(gap / this.ONE_WEEK);
          const midDate = trainerBatches[l][m].endDate + gap / 2;
          const y = this.dateToYPos(midDate);
          midPoints.push({ duration: duration, xPos: xpos, midDatePos: y });
        }
      }
    }
    return midPoints;
  }

  // returns the list of trainers with their positions
  getTrainers() {
    const spacing = 2;
    const width = this.columnWidth - spacing;

    // if there are no trainers, show it
    if (this.trainers.length === 0) {
      return [{ name: 'No trainers', left: spacing, width: this.minWidth }];
    }

    // add each trainer and position to array
    const trainerspos = [];
    for (let i = 0; i < this.trainersOnThisPage; i++) {
      const trainer = this.trainers[this.actualTrainersPerPage * this.currentPage + i];

      // get trainer name
      const name = trainer.firstName + ' ' + trainer.lastName;
      // get left offset of this trainer
      let left = spacing;
      if (i === 0) {
        left += this.swimlaneXOfs;
      }
      trainerspos.push({ name: name, left: left, width: width });
    }

    return trainerspos;
  }

  // start alternate control mode
  startSwimMode() {
    // setup variables that are reset at start of swim mode
    this.swimActive = true;
    this.zoomingEnabled = false;
    this.randomModeActive = false;
    this.batches = [];
    this.todayLine.x1 = this.todayLine.x2 = -10;
    this.swimPoints = 0;
    this.swimDown = false;
    this.swimDots = [];

    // setup posiitons
    const defDur = 1000 * 60 * 60 * 24 * 0.71 * this.height; // 0.7 days per pixel
    this.endValue = this.startValue + defDur;
    const swimposy = this.dateToYPos(this.startValue + defDur / 8);
    const pointsRect = { x: this.width, y: swimposy };
    const highpointsRect = { x: this.width, y: swimposy + 50 };
    const leftlanex = this.swimlaneXOfs + 0 * this.columnWidth + this.columnWidth * 0.5;
    const swimColor = '#122555';
    this.swimPos = {
      x: leftlanex,
      y: swimposy,
      color: swimColor + 'ff',
      r: 15,
      points: pointsRect,
      highpoints: highpointsRect
    };

    // setup gauge position
    const gaugex = leftlanex - this.columnWidth;
    const gaugeh = this.swimPos.r * 4;
    const gaugey = swimposy - gaugeh / 2;
    const gaugey2 = swimposy + gaugeh / 2;
    const gaugew = 8;
    this.swimGauge = {
      value: 0,
      y1: gaugey,
      y2: gaugey2,
      bgy1: gaugey,
      bgy2: gaugey2,
      x1: gaugex,
      x2: gaugex,
      bgx1: gaugex,
      bgx2: gaugex,
      w: gaugew
    };

    // setup local variables for loop
    const gaugeMax = 1;
    const gaugeDepleteRate = 0.02;
    const gaugeFillRate = 0.05;

    const numFrames = 15;

    const startMoveSpeed = defDur / 8 / numFrames;
    const maxMoveSpeed = defDur / numFrames;
    const maxMoveMaxScore = 10000;
    let moveSpeed = startMoveSpeed;

    const addBuffer = defDur / 6;
    let addBatchTimer = 0;
    const addBatchRate = 1000;
    const minAddBatchRate = 80;
    const minBatchAddMaxScore = 7500;
    let addDotTimer = 0;
    const addDotRate = 1000;

    let gotHit = false;
    let restartPauseTimer = 3000;
    const intervalRate = 1000 / numFrames;
    let time = 0;
    const startIn = 1000;
    // start
    setTimeout(() => {
      const loop = setInterval(() => {
        // stop
        if (!this.swimActive) {
          clearInterval(loop);
          return;
        }

        // wait until not paused
        if (this.swimPaused) {
          return;
        }

        // check finished
        if (gotHit) {
          if (restartPauseTimer > 0) {
            restartPauseTimer -= intervalRate;
          } else {
            // console.log('completed with ' + this.swimPoints + '!');
            if (this.swimPoints > this.swimHigh) {
              this.swimHigh = this.swimPoints;
            }
            // console.log('restarting...');
            clearInterval(loop);
            this.startSwimMode();
          }
          return;
        }
        time += intervalRate;

        // update lane
        this.swimPos.x = leftlanex + this.columnWidth * this.swimLane;

        // update gauge
        if (this.swimDown) {
          if (this.swimGauge.value > 0) {
            this.swimGauge.value -= gaugeDepleteRate;
          } else {
            this.swimGauge.value = 0;
            this.swimDown = false;
          }
          // transparent
          this.swimPos.color = swimColor + '99';
        }
        if (!this.swimDown) {
          if (this.swimGauge.value < gaugeMax) {
            this.swimGauge.value += gaugeFillRate;
          } else {
            this.swimGauge.value = gaugeMax;
          }
          // solid
          this.swimPos.color = swimColor + 'ff';
        }
        this.swimGauge.y1 = gaugey2 - gaugeh * (gaugeMax - (1 - this.swimGauge.value));

        // check collision
        if (!this.swimDown) {
          for (let i = 0; i < this.batches.length; i++) {
            const batch = this.batches[i];
            // remove old ones
            if (batch.endDate < this.startValue - 1000 - moveSpeed) {
              // console.log('removing batch ' + i + ' '+ batch.endDate + ' ' + this.startValue);
              this.batches.splice(i, 1);
              i--;
              continue;
            }
            // check overlap
            const py = this.yPosToDate(this.swimPos.y);
            if (py > batch.startDate.valueOf() && py < batch.endDate.valueOf()) {
              const batchlane = this.trainers.findIndex(t => t.id === batch.trainer.id);
              if (this.swimLane === batchlane) {
                // console.log('hit!');
                gotHit = true;
                return;
              }
            }
          }
        }

        // add batches
        addBatchTimer -= intervalRate;
        if (addBatchTimer <= 0) {
          const randy = Math.random() * this.ONE_WEEK * 4;
          this.addRandomBatch(this.endValue + addBuffer + randy);
          addBatchTimer = this.linearInterpolation(
            addBatchRate,
            minAddBatchRate,
            Math.min(1, this.swimPoints / minBatchAddMaxScore)
          );
        }

        // add dots
        addDotTimer -= intervalRate;
        if (addDotTimer <= 0) {
          const randX = leftlanex + this.columnWidth * Math.floor(Math.random() * this.trainersOnThisPage);
          const randy = Math.random() * this.ONE_WEEK * 5;
          const y = this.dateToYPos(this.endValue + addBuffer - randy);
          // console.log('making dot ' + this.swimDots.length + ' at ' + randX + ' ' + y);
          this.swimDots.push({ x: randX, y: y, r: this.swimPos.r / 2, color: '#eedd20ee' });
          addDotTimer = addDotRate;
        }
        for (let i = 0; i < this.swimDots.length; i++) {
          if (this.swimDots[i].y <= -50) {
            // console.log('removing dot '+i);
            this.swimDots.splice(i, 1);
            i--;
            continue;
          }
          // check collision
          if (
            this.swimPos.y - this.swimPos.r - this.swimDots[i].r < this.swimDots[i].y &&
            this.swimPos.y + this.swimPos.r > this.swimDots[i].y
          ) {
            if (
              this.swimPos.x > this.swimDots[i].x - this.swimDots[i].r &&
              this.swimPos.x < this.swimDots[i].x + this.swimDots[i].r
            ) {
              this.swimPoints += 100;
              console.log('+100');
              this.swimDots.splice(i, 1);
              i--;
              continue;
            }
          }
          this.swimDots[i].y = this.dateToYPos(this.yPosToDate(this.swimDots[i].y) - moveSpeed);
        }

        // update pos
        this.startValue = this.startValue + moveSpeed;
        this.endValue = this.endValue + moveSpeed;

        // increase speed
        moveSpeed = this.linearInterpolation(
          startMoveSpeed,
          maxMoveSpeed,
          Math.min(1, this.swimPoints / maxMoveMaxScore)
        );

        this.swimPoints += 1;
        // console.log(this.swimPoints);
      }, intervalRate);
    }, startIn);
  }

  // interpolates over from-to by d
  linearInterpolation(from, to, d) {
    return d * (to - from) + from;
  }

  // reset to normal mode
  finishSwimMode() {
    if (!this.swimActive) return;
    if (this.swimPoints > this.swimHigh) {
      this.swimHigh = this.swimPoints;
    }
    this.swimActive = false;
    this.swimStartProgress = 0;
    this.zoomingEnabled = true;
    this.loadInitialDates();
    this.updateBatches();
    this.updateTodayLine();
  }

  // generate random batches
  startRandomMode(forceRegenTrainers = false) {
    this.randomModeActive = true;
    this.batches = [];
    this.loading = false;
    if (forceRegenTrainers || this.trainers.length === 0) {
      // make random trainers
      this.trainers = [];
      let trainers_to_make = this.trainersPerPage;
      if (trainers_to_make === 0) {
        trainers_to_make = Math.floor(Math.random() * 10 + 5); // 5 to 15
      }
      console.log('creating ' + trainers_to_make + ' random trainers');
      const random_names = [
        'Wei',
        'Whitesell',
        'Clotilde',
        'Chiles',
        'Mose',
        'Malan',
        'Alejandro',
        'Alonso',
        'Carolina',
        'Calcagni',
        'Billi',
        'Bury',
        'Sheldon',
        'Sealey',
        'Bryan',
        'Broderick',
        'Rocco',
        'Reding',
        'Latashia',
        'Lehman',
        'Loralee',
        'Lobaugh',
        'Hunter',
        'Hausmann',
        'Vivienne',
        'Villacorta',
        'Saul',
        'Schatz',
        'Meghann',
        'Mendivil',
        'Rubye',
        'Rousseau',
        'Charles',
        'Crampton',
        'Mabelle',
        'Mcquire',
        'Laurie',
        'Lohr',
        'Bailey',
        'Boll',
        'Roni',
        'Gimenez',
        'Chantay',
        'Crosby',
        'Paula',
        'Denis',
        'Liana',
        'Fahey',
        'Blossom',
        'Millwood',
        'Millard',
        'John',
        'Almeda',
        'Mccarroll',
        'Graciela',
        'Robbs',
        'Tora',
        'Remer',
        'Karl',
        'Fern',
        'Jenni',
        'Heldt',
        'Fe',
        'Mcraney',
        'Shenna',
        'Jung',
        'Noma',
        'Shuster',
        'Elvera',
        'Dombrosky',
        'Jinny',
        'Engel',
        'Harriet',
        'Moffat',
        'Zonia',
        'Rodreguez',
        'Terina',
        'Rideaux',
        'Waltraud',
        'Hansard'
      ];
      for (let i = 0; i < trainers_to_make; i++) {
        const randFName = random_names[Math.floor(Math.random() * random_names.length)];
        const randLName = random_names[Math.floor(Math.random() * random_names.length)];
        this.trainers.push(
          new Trainer(
            Math.floor(Math.random() * 10000),
            randFName,
            randLName,
            [],
            null,
            Math.random() >= 0.5,
            null,
            null
          )
        );
      }
      this.updatePage();
    }
    const duration = Math.max(this.endValue - this.startValue, this.ONE_WEEK * 1); // min 1 week
    const batches_per_teacher_to_make = Math.floor(duration / (this.ONE_WEEK * 15));
    console.log('making ' + batches_per_teacher_to_make + ' batches');
    const max_random_start = this.ONE_WEEK * 20; // 20 weeks
    // const max_random = this.ONE_WEEK * 10; // 10 weeks
    for (let i = 0; i < this.trainers.length; i++) {
      let random_start_week = this.startValue + (Math.random() - 0.8) * 2 * max_random_start; // +/- randweeks
      for (let j = 0; j < batches_per_teacher_to_make; j++) {
        // const random_week = Math.random() * 2 * max_random; // +/- rand weeks
        // console.log("rw: " + random_week);
        const interval = Math.floor(Math.random() * (this.ONE_WEEK * 20) + this.ONE_WEEK * 8); // 1 every 8-28 weeks
        const bstart = random_start_week + interval;
        const rend = this.addRandomBatch(bstart, true, i);
        random_start_week = rend;
      }
    }
  }
  // clear random batches and reset
  finishRandomMode() {
    this.randomModeActive = false;
    this.updateTrainers();
    this.updateBatches();
    this.updateTodayLine();
  }

  // adds a random batch that starts at the specified date
  addRandomBatch(batchstartdate: number, detailed = false, row = -1) {
    const baseDur = this.ONE_WEEK * 2; // 2 weeks
    const maxDur = this.ONE_WEEK * 16; // 16 weeks
    const ranEndDate = batchstartdate + Math.random() * maxDur + baseDur;
    if (row < 0) {
      row = Math.floor(Math.random() * this.trainersOnThisPage);
    }
    const currId = Math.floor(Math.random() * 4);
    let bid = -1;
    let bname = 'randomly generated';
    let cur = new Curriculum(currId, null, true, [], []);
    let cotrainer = null;
    let bskills = null;
    let bstatus = 'gen';
    let baddr = null;
    let bbuil = null;
    let broom = null;

    if (detailed) {
      bid = Math.random() * 10000;
      const batch_start_date_date = new Date(batchstartdate);
      bname =
        '' +
        this.shortMonthNames[batch_start_date_date.getMonth()] +
        '' +
        batch_start_date_date.getDate() +
        Math.floor(Math.random() * 10000);
      cur = new Curriculum(currId, null, true, [], []);
      cotrainer = this.trainers[Math.floor(Math.random() * (this.trainers.length - 1))];
      bskills = null;
      const bstati = [];
      bstatus = bstati[Math.floor(Math.random() * bstati.length)];
      if (Math.random() > 0.3) {
        const randAddrs = ['LA', 'New York', 'Florida', 'Canada', 'Nowhere'];
        baddr = new Address(-1, randAddrs[Math.floor(Math.random() * randAddrs.length)], '', '');
      }
      if (Math.random() > 0.6) {
        const randBuilds = ['HQ', 'Fake Buidling', 'Building id ' + Math.floor(Math.random() * 1000)];
        bbuil = new Building(true, -1, baddr, randBuilds[Math.floor(Math.random() * randBuilds.length)], []);
      }
      if (Math.random() > 0.9) {
        const randRooms = ['Room ' + Math.floor(Math.random() * 100), 'Back room'];
        broom = new Room(-1, true, randRooms[Math.floor(Math.random() * randRooms.length)], bbuil, []);
      }
    }
    this.batches.push(
      new Batch(
        bid,
        bname,
        batchstartdate,
        ranEndDate,
        cur,
        bskills,
        this.trainers[row],
        cotrainer,
        [],
        bstatus,
        baddr,
        bbuil,
        broom
      )
    );
    return ranEndDate;
  }

  // returns the list of months to display and their position
  getTimescale() {
    if (!this.timescaleEnabled) {
      return [];
    }
    // cache some common values
    const full_duration = this.endValue - this.startValue;
    const start_month = this.startDate.getMonth();
    const start_year = this.startDate.getFullYear();

    // get distance between months (px) to determine which scale to use
    const ys0 = this.dateToYPos(new Date(start_year, start_month).valueOf());
    const ys1 = this.dateToYPos(new Date(start_year, start_month + 1).valueOf());
    const dist_between_months = ys1 - ys0;

    // the maximum number of dates to be shown on the screen
    const max_dates = 40;

    // min value for dist_between_months to be for that scale
    // numbers magically determined from trial and error
    const pxdays = 1900;
    const px2days = 800;
    const pxweeks = 300;
    const pxmonths = 100;
    const pxquarters = 30;
    const pxyears = 6;
    const px2years = 2;
    const px5years = 1;
    const px10years = 0;

    // create an array of all the dates to be shown and determine the naming style
    const dates: Date[] = [];
    let namestyle = 'month';
    // dates.push(this.startDate);
    // dates.push(this.endDate);
    if (dist_between_months > pxdays) {
      // show in days
      namestyle = 'day';
      for (let i = 0; i < max_dates; i++) {
        dates.push(new Date(start_year, start_month, this.startDate.getDate() + i));
      }
      // console.log('day');
    } else if (dist_between_months > px2days) {
      // show in 2 days
      namestyle = 'day';
      const aligned_start_date_2 = this.startDate.getDate() - this.startDate.getDate() % 2;
      for (let i = 0; i < max_dates; i++) {
        dates.push(new Date(start_year, start_month, aligned_start_date_2 + i * 2));
      }
      // console.log('2day');
    } else if (dist_between_months > pxweeks) {
      // show in weeks
      namestyle = 'month';
      // todo always show month day 0 and year month 0
      const aligned_start_date = this.startDate.getDate() - this.startDate.getDate() % 7;
      for (let i = 0; i < max_dates; i++) {
        dates.push(new Date(start_year, start_month, i * 7));
      }
      // console.log('week');
    } else if (dist_between_months > pxmonths) {
      // show in months
      namestyle = 'month';
      for (let i = 0; i < max_dates; i++) {
        dates.push(new Date(start_year, start_month + i));
      }
      // console.log('mnth');
    } else if (dist_between_months > pxquarters) {
      // show in quarters
      namestyle = 'month';
      for (let i = 0; i < max_dates; i++) {
        dates.push(new Date(start_year, i * 3));
      }
      // console.log('qtr');
    } else if (dist_between_months > pxyears) {
      // show in years
      namestyle = 'year';
      for (let i = 0; i < max_dates; i++) {
        dates.push(new Date(start_year + i, 0));
      }
      // console.log('yr');
    } else if (dist_between_months > px2years) {
      // show in 2 years
      namestyle = 'year';
      const aligned_start_year = start_year - start_year % 2;
      for (let i = 0; i < max_dates; i++) {
        dates.push(new Date(aligned_start_year + i * 2, 0));
      }
      // console.log('2yr');
    } else if (dist_between_months > px5years) {
      // show in 5 years
      namestyle = 'year';
      const aligned_start_year = start_year - start_year % 5;
      for (let i = 0; i < max_dates; i++) {
        dates.push(new Date(aligned_start_year + i * 5, 0));
      }
      // console.log('5yr');
    } else if (dist_between_months > px10years) {
      // show in 10 years
      namestyle = 'year';
      const aligned_start_year = start_year - start_year % 10;
      for (let i = 0; i < max_dates; i++) {
        dates.push(new Date(aligned_start_year + i * 10, 0));
      }
      // console.log('10yr');
    } else {
      // console.log('getTimescale failed to determine scale');
      return null;
    }

    // go through all the dates that were just created to apply the naming style and calculate the position
    const timescale = [];
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      // apply naming style - day, month, or year
      let name = 'name ' + i;
      switch (namestyle) {
        case 'day':
          if (date.getDate() === 1) {
            name = this.fullMonthNames[date.getMonth()];
          } else {
            name = this.dayOfWeekNames[date.getDay()];
            name += ' ' + date.getDate();
          }
          break;
        case 'month':
          if (date.getDate() === 1) {
            name = this.fullMonthNames[date.getMonth()];
          } else {
            name = this.shortMonthNames[date.getMonth()];
            name += ' ' + date.getDate();
          }
          break;
        case 'year':
          name = '' + date.getFullYear();
          break;
      }
      // replace jan 0 with the year
      if (date.getMonth() === 0 && date.getDate() === 1) {
        name = '' + date.getFullYear();
      }
      // calculate the position of the text
      const y = this.swimlaneYOfs + this.dateToYPos(date.valueOf());
      if (y < this.swimlaneYOfs) {
        continue;
      } else if (y > this.height - this.swimlaneYOfs) {
        break;
      }
      const x = this.timescaleXOfs - 5;
      timescale.push({ name: name, x: x, y: y });
    }
    return timescale;
  }

  // returns the pixel value on the vertical axis this date would appear on the timeline
  dateToYPos(dateValue: number) {
    return (dateValue - this.startValue) / (this.endValue - this.startValue) * this.height;
  }

  // returns the date value from the vertical axis position on the timeline
  yPosToDate(ypos: number) {
    return ypos * (this.endValue - this.startValue) / this.height + this.startValue;
  }

  startZoom(mouseposy: number) {
    // calculate values needed for zooming from the mousepos
    this.zoomingFrom = mouseposy;
    this.zoomingLine = { x1: this.timescaleXOfs, x2: this.width, y1: mouseposy, y2: mouseposy };
    // position (px) to date
    this.zoomingFromDate = this.yPosToDate(mouseposy);
    // get duration before and after zoom line
    // console.log(new Date(this.zoomingFromDate));
    this.preZoomBeforeDuration = this.zoomingFromDate - this.startValue;
    this.preZoomAfterDuration = this.endValue - this.zoomingFromDate;
    this.zooming = true;

    // hide tooltip
    this.tooltipActive = false;
  }

  zoomBy(amount: number) {
    // must be zooming to zoom
    if (!this.zooming) {
      return;
    }
    // scale the durations before and after the zoom line
    const newBeforeDuration = this.preZoomBeforeDuration * amount;
    let newStart = this.zoomingFromDate - newBeforeDuration;
    const newAfterDuration = this.preZoomAfterDuration * amount;
    let newEnd = this.zoomingFromDate + newAfterDuration;
    // console.log(new Date(newStart) + ', ' + new Date(this.endDate));
    if (newEnd - newStart < this.minZoom || newEnd - newStart > this.maxZoom) {
      newStart = this.startValue;
      newEnd = this.endValue;
    }
    if (newStart >= newEnd) {
      // console.log('start date is after end date!');
      return;
    }
    // set start and end dates
    this.startValue = newStart;
    this.endValue = newEnd;
    this.updateTodayLine();
  }

  finishZoom() {
    // todo undo support?
    this.zooming = false;
  }

  shiftBy(amount: number) {
    const dur = this.endValue - this.startValue;
    const shiftBy = amount * dur;
    this.startValue = this.startValue + shiftBy;
    this.endValue = this.endValue + shiftBy;
    this.updateTodayLine();
  }

  // start zoom at mouse pos on mousedown
  bgmousedown(event: MouseEvent) {
    if (this.zoomingEnabled) {
      const mx = event.clientX - this.timelineRootElement.nativeElement.getBoundingClientRect().left;
      const my = event.clientY - this.timelineRootElement.nativeElement.getBoundingClientRect().top;
      if (mx <= this.timescaleXOfs) {
        this.shifting = true;
      } else {
        this.startZoom(my);
      }
    }
  }
  // finish zoom on mouseup
  bgmouseup(event: MouseEvent) {
    this.finishZoom();
    this.shifting = false;
  }
  // hide popup and update zoom by delta on mouse move
  bgmousemove(event: MouseEvent) {
    const my = event.clientY - this.timelineRootElement.nativeElement.getBoundingClientRect().top;
    const mx = event.clientX - this.timelineRootElement.nativeElement.getBoundingClientRect().left;
    const mdy = event.movementY;
    if (this.shifting) {
      event.preventDefault();
      // stop shifting if mouse is up (happens when mouse is released outside of the timeline and returns)
      if (event.buttons !== 1) {
        this.shifting = false;
      }
      // get the factor to zoom by from the relative mouse position
      const shiftFactor = -mdy / this.height;
      this.shiftBy(shiftFactor);
    }
    if (this.zooming) {
      event.preventDefault();
      // stop zooming if mouse is up (happens when mouse is released outside of the timeline and returns)
      if (event.buttons !== 1) {
        this.finishZoom();
      }
      // get the factor to zoom by from the relative mouse position
      const dy = my - this.zoomingFrom;
      let zoomFactor = dy * this.zoomScale;
      zoomFactor = Math.pow(2, zoomFactor);
      // console.log('zf ' + zoomFactor);
      this.zoomBy(zoomFactor);
    }
    this.updateTooltipVisibility();
    if (this.width !== this.trainernamesElement.nativeElement.getBoundingClientRect().width) {
      this.updateSize();
    }
  }

  keydown(event: KeyboardEvent) {
    // console.log(event.keyCode + ' pressed');

    if (event.keyCode === this.keycodes.esc) {
      // escape pressed
      this.randomModeActive = false;
    }
    if (this.swimActive) {
      // keyboard codes for alternate control mode
      if (
        event.keyCode === this.keycodes.tab ||
        event.keyCode === this.keycodes.enter ||
        event.keyCode === this.keycodes.esc
      ) {
        this.finishSwimMode();
      }
      if (
        event.keyCode === this.keycodes.primary ||
        event.keyCode === this.keycodes.secondary ||
        event.keyCode === this.keycodes.z ||
        event.keyCode === this.keycodes.space ||
        event.keyCode === this.keycodes.down ||
        event.keyCode === this.keycodes.up
      ) {
        if (this.swimGauge.value >= 0.6) {
          event.preventDefault();
          this.swimDown = true;
        }
      }
      if (!this.swimPaused && !this.swimDown) {
        if (event.keyCode === this.keycodes.left) {
          this.swimLane = Math.max(0, this.swimLane - 1);
        }
        if (event.keyCode === this.keycodes.right) {
          this.swimLane = Math.min(this.trainersOnThisPage - 1, this.swimLane + 1);
        }
      }
      if (event.keyCode === this.keycodes.p) {
        this.swimPaused = !this.swimPaused;
        event.preventDefault();
      }
    } else {
      switch (event.keyCode) {
        case this.keycodes.plus:
          this.startZoom((this.dateToYPos(this.endValue) - this.dateToYPos(this.startValue)) / 2);
          this.zoomBy(0.75);
          this.finishZoom();
          break;
        case this.keycodes.minus:
          this.startZoom((this.dateToYPos(this.endValue) - this.dateToYPos(this.startValue)) / 2);
          this.zoomBy(1.5);
          this.finishZoom();
          break;
        case this.keycodes.up:
          if (event.shiftKey && this.keyBoardScrollEnabled) {
            // scroll up
            event.preventDefault();
            this.shiftBy(this.keyScrollSpeed);
          }
          if (this.swimStartProgress === 0 || this.swimStartProgress === 1) {
            this.swimStartProgress += 1;
          } else {
            this.swimStartProgress = 0;
          }
          break;
        case this.keycodes.down:
          if (event.shiftKey && this.keyBoardScrollEnabled) {
            // scroll down
            event.preventDefault();
            this.shiftBy(-this.keyScrollSpeed);
          }
          if (this.swimStartProgress === 2 || this.swimStartProgress === 3) {
            this.swimStartProgress += 1;
          } else {
            this.swimStartProgress = 0;
          }
          break;
        case this.keycodes.tilde:
          if (!this.randomModeActive) {
            this.startRandomMode(event.ctrlKey);
          } else {
            this.finishRandomMode();
          }
          console.log('random mode ' + (this.randomModeActive ? '' : 'de') + 'activated');
          break;
        case this.keycodes.left:
          if (this.swimStartProgress === 4 || this.swimStartProgress === 6) {
            this.swimStartProgress += 1;
          } else {
            this.swimStartProgress = 0;
          }
          break;
        case this.keycodes.right:
          if (this.swimStartProgress === 5 || this.swimStartProgress === 7) {
            this.swimStartProgress += 1;
          } else {
            this.swimStartProgress = 0;
          }
          break;
        case this.keycodes.primary:
          if (this.swimStartProgress === 8) {
            this.swimStartProgress += 1;
          } else {
            this.swimStartProgress = 0;
          }
          break;
        case this.keycodes.secondary:
          if (this.swimStartProgress === 9) {
            this.swimStartProgress += 1;
          } else {
            this.swimStartProgress = 0;
          }
          break;
        case this.keycodes.enter:
          if (this.swimStartProgress === 10) {
            event.preventDefault();
            this.swimStartProgress += 1;
            this.startSwimMode();
          } else {
            this.swimStartProgress = 0;
          }
          break;
      }
    }
  }

  keyup(event: KeyboardEvent) {
    if (this.swimActive) {
      if (
        event.keyCode === this.keycodes.primary ||
        event.keyCode === this.keycodes.secondary ||
        event.keyCode === this.keycodes.z ||
        event.keyCode === this.keycodes.space ||
        event.keyCode === this.keycodes.down ||
        event.keyCode === this.keycodes.up
      ) {
        event.preventDefault();
        this.swimDown = false;
      }
    }
  }

  // show tooltip at mouse on mouse move on batch
  batchmousemove(event) {
    // console.log(event.target);
    const x = event.clientX - this.timelineRootElement.nativeElement.getBoundingClientRect().left;
    const y = event.clientY - this.timelineRootElement.nativeElement.getBoundingClientRect().top;
    this.updateTooltip(event.target.id, { x: x, y: y });
  }

  // window has been resized, update timeline
  windowResize(event) {
    this.updateSize();
  }
}
