// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  baseUrl: 'http://localhost:4200',
  baseApiUrl: '',

  //routers
  appRoutes: {
    login: '',
    overview: 'overview',
    batches: 'batches',
    locations: 'locations',
    curricula: 'curricula',
    trainers: 'trainers',
    profile: 'profile',
    reports: 'reports',
    settings: 'settings'
  },

  apiUrls: {
    batchController: {
      baseUrl: 'api/batch',
      createBatch: '',
      deleteBatch: '/',
      updateBatch: '',
      findCommonLocations: '',
      getAllBatches: '',
      findAllBatchesByTrainer: '/',
      createWeek: '',
      getAllVpBatches: '',
      getAllCurrentBatches: ''
    },

    addressController: {
      baseUrl: 'api/location',
      createLocation: '',
      updateLocation: '',
      getAllLocations: '',
      removeLocation: '/',
      getLocation: '/',
      reactivateLocation: ''
    },

    buildingController: {
      baseUrl: 'api/building',
      createBuilding: '',
      retrieveBuilding: '/',
      updateBuilding: '',
      deleteBuilding: '/',
      retrieveAllBuildings: ''
    },

    locationController: {
      baseUrl: 'api/location',
      createLocation: '',
      retrieveLocation: '/',
      updateLocation: '',
      deleteLocation: '/',
      retrieveAllLocation: ''
    },

    curriculumController: {
      baseUrl: 'api/curriculum',
      createCurriculum: '',
      retrieveCurriculum: '/',
      updateCurriculum: '',
      deleteCurriculum: '/',
      retrieveAllCurricula: '',
      retrieveAllActiveCurricula: '',
      retrieveAllCore: '',
      retrieveAllActiveCore: '',
      retrieveAllFocus: '',
      retrieveAllActiveFocus: ''
    },

    settingController: {
      baseUrl: 'api/setting',
      createSetting: '',
      retrieveSetting: '/',
      getGlobalSetting: '',
      updateSetting: '',
      deleteSetting: '/'
    },

    skillController: {
      baseUrl: 'api/skill',
      findAllActive: '',
      findAll: '',
      findSkillById: '/',
      updateSkillCaliber: '',
      saveSkill: '',
      createSkill: '',
      retrieveSkill: '/',
      updateSkillMinerva: '',
      deleteSkill: '/',
      retrieveAllSkills: '',
      retrieveSkillsByIds: ''
    },

    trainerController: {
      baseUrl: 'api/trainer',
      createTrainer: '',
      updateTrainer: '',
      findTrainer: '/',
      makeInactive: '/',
      getAllTrainersTitles: '',
      getAllTrainers: ''
    },

    unavailableController: {
      baseUrl: 'api/unavailable',
      createUnavailability: '',
      retrieveUnavailability: '/',
      deleteUnavailability: '',
      retrieveAllUnavailabilities: ''
    }
  }
};
