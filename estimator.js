const calculator = (number, multiplyBy) => parseInt(number, 10) * multiplyBy;

const result = (duration, durationType) => {
  if (durationType === 'weeks') {
    return Math.trunc((parseInt(duration, 10) * 7) / 3);
  }
  if (durationType === 'months') {
    return Math.trunc((parseInt(duration, 10) * 30) / 3);
  }

  return Math.trunc(parseInt(duration, 10) / 3);
};

function calculateLostMoney(infectedPeople, population, income, duration) {
  return Math.trunc((infectedPeople * population * income) / duration);
}

const ventilatorCases = (number) => Math.trunc((2 / 100) * number);

const calculateICUCareNeeded = (number) => Math.trunc((5 / 100) * number);

const hospitalized = (number) => Math.trunc((15 / 100) * number);

function availableHospitalBeds(totalBeds, patients) {
  const beds = (35 / 100) * totalBeds;

  return Math.trunc(beds - patients);
}

function returnFunction(
  firstField,
  impactFirstField,
  impactSecondField,
  impactThirdField,
  impactFourthField,
  impactFifthField,
  impactSixthField,
  impactSeventhField,
  severeFirstField,
  severeSecondField,
  severeThirdField,
  severeFourthField,
  severeFifthField,
  severeSixthField,
  severeSeventhField
) {
  return {
    input: firstField,
    impact: {
      currentlyInfected: impactFirstField,
      infectionsByRequestedTime: impactSecondField,
      severeCasesByRequestedTime: impactThirdField,
      hospitalBedsByRequestedTime: impactFourthField,
      casesForICUByRequestedTime: impactFifthField,
      casesForVentilatorsByRequestedTime: impactSixthField,
      dollarsInFlight: impactSeventhField
    },
    severeImpact: {
      currentlyInfected: severeFirstField,
      infectionsByRequestedTime: severeSecondField,
      severeCasesByRequestedTime: severeThirdField,
      hospitalBedsByRequestedTime: severeFourthField,
      casesForICUByRequestedTime: severeFifthField,
      casesForVentilatorsByRequestedTime: severeSixthField,
      dollarsInFlight: severeSeventhField
    }
  };
}

const covid19ImpactEstimator = (data) => {
  const input = data;
  const { reportedCases, periodType, timeToElapse } = input;
  const { totalHospitalBeds } = input;
  const { avgDailyIncomePopulation, avgDailyIncomeInUSD } = input.region;

  const resultIndays = result(timeToElapse);
  const resultInWeeks = result(timeToElapse, 'weeks');
  const resultInMonths = result(timeToElapse, 'months');

  const currentlyInfected = calculator(reportedCases, 10);
  const severeCurrentlyInfected = calculator(reportedCases, 50);
  const infectionsByRequestedTime = calculator(
    currentlyInfected,
    2 ** resultIndays
  );
  const severeIRT = calculator(severeCurrentlyInfected, 2 ** resultIndays);
  let toBeHospitalized = hospitalized(infectionsByRequestedTime);
  let toBeHospitalizedSevere = hospitalized(severeIRT);
  let hospitalBeds = availableHospitalBeds(totalHospitalBeds, toBeHospitalized);
  let hospitalBedsSevere = availableHospitalBeds(
    totalHospitalBeds,
    toBeHospitalizedSevere
  );
  let IcuCareNeeded = calculateICUCareNeeded(infectionsByRequestedTime);
  let IcuCareNeededSevere = calculateICUCareNeeded(severeIRT);
  let ventilatorsNeeded = ventilatorCases(infectionsByRequestedTime);
  let ventilatorsNeededSevere = ventilatorCases(severeIRT);
  let lostMoney = calculateLostMoney(
    infectionsByRequestedTime,
    avgDailyIncomePopulation,
    avgDailyIncomeInUSD,
    timeToElapse
  );
  let lostMoneySevere = calculateLostMoney(
    severeIRT,
    avgDailyIncomePopulation,
    avgDailyIncomeInUSD,
    timeToElapse
  );

  if (periodType === 'weeks') {
    const infectionsByWeeks = calculator(currentlyInfected, 2 ** resultInWeeks);
    const severeIRTWeeks = calculator(
      severeCurrentlyInfected,
      2 ** resultInWeeks
    );
    toBeHospitalized = hospitalized(infectionsByWeeks);
    toBeHospitalizedSevere = hospitalized(severeIRTWeeks);
    hospitalBeds = availableHospitalBeds(totalHospitalBeds, toBeHospitalized);
    hospitalBedsSevere = availableHospitalBeds(
      totalHospitalBeds,
      toBeHospitalizedSevere
    );
    IcuCareNeeded = calculateICUCareNeeded(infectionsByWeeks);
    IcuCareNeededSevere = calculateICUCareNeeded(severeIRTWeeks);
    ventilatorsNeeded = ventilatorCases(infectionsByWeeks);
    ventilatorsNeededSevere = ventilatorCases(severeIRTWeeks);
    const time = timeToElapse * 7;
    lostMoney = calculateLostMoney(
      infectionsByWeeks,
      avgDailyIncomePopulation,
      avgDailyIncomeInUSD,
      time
    );
    lostMoneySevere = calculateLostMoney(
      severeIRTWeeks,
      avgDailyIncomePopulation,
      avgDailyIncomeInUSD,
      time
    );

    return returnFunction(
      input,
      currentlyInfected,
      infectionsByWeeks,
      toBeHospitalized,
      hospitalBeds,
      IcuCareNeeded,
      ventilatorsNeeded,
      lostMoney,
      severeCurrentlyInfected,
      severeIRTWeeks,
      toBeHospitalizedSevere,
      hospitalBedsSevere,
      IcuCareNeededSevere,
      ventilatorsNeededSevere,
      lostMoneySevere
    );
  }
  if (periodType === 'months') {
    const infectionsByMonths = calculator(
      currentlyInfected,
      2 ** resultInMonths
    );
    const severeIRTMonths = calculator(
      severeCurrentlyInfected,
      2 ** resultInMonths
    );
    toBeHospitalized = hospitalized(infectionsByMonths);
    toBeHospitalizedSevere = hospitalized(severeIRTMonths);
    hospitalBeds = availableHospitalBeds(totalHospitalBeds, toBeHospitalized);
    hospitalBedsSevere = availableHospitalBeds(
      totalHospitalBeds,
      toBeHospitalizedSevere
    );
    IcuCareNeeded = calculateICUCareNeeded(infectionsByMonths);
    IcuCareNeededSevere = calculateICUCareNeeded(severeIRTMonths);
    ventilatorsNeeded = ventilatorCases(infectionsByMonths);
    ventilatorsNeededSevere = ventilatorCases(severeIRTMonths);
    const time = timeToElapse * 30;
    lostMoney = calculateLostMoney(
      infectionsByMonths,
      avgDailyIncomePopulation,
      avgDailyIncomeInUSD,
      time
    );
    lostMoneySevere = calculateLostMoney(
      severeIRTMonths,
      avgDailyIncomePopulation,
      avgDailyIncomeInUSD,
      time
    );

    return returnFunction(
      input,
      currentlyInfected,
      infectionsByMonths,
      toBeHospitalized,
      hospitalBeds,
      IcuCareNeeded,
      ventilatorsNeeded,
      lostMoney,
      severeCurrentlyInfected,
      severeIRTMonths,
      toBeHospitalizedSevere,
      hospitalBedsSevere,
      IcuCareNeededSevere,
      ventilatorsNeededSevere,
      lostMoneySevere
    );
  }

  return returnFunction(
    input,
    currentlyInfected,
    infectionsByRequestedTime,
    toBeHospitalized,
    hospitalBeds,
    IcuCareNeeded,
    ventilatorsNeeded,
    lostMoney,
    severeCurrentlyInfected,
    severeIRT,
    toBeHospitalizedSevere,
    hospitalBedsSevere,
    IcuCareNeededSevere,
    ventilatorsNeededSevere,
    lostMoneySevere
  );
};

function fillData(calculatedData, timeToElapse, periodType) {
  const cInfected = document.querySelector('#currentlyInfected');
  const iLabel = document.querySelector('#infectionsLabel');
  const infectionsByRT = document.querySelector('#infectionsByTimeRequested');
  const icuCasesLabel = document.querySelector('#icuCasesLabel');
  const casesForICUByRT = document.querySelector('#casesForICUByRequestedTime');
  const hospitalBeds = document.querySelector('#hospitalBeds');
  const BedsByRT = document.querySelector('#hospitalBedsByRequestedTime');
  const ventilators = document.querySelector('#ventilators');
  const cVent = document.querySelector('#casesForVentilatorsByRequestedTime');
  const dollarsInFlight = document.querySelector('#dollarsInFlight');

  cInfected.innerHTML = calculatedData.impact.currentlyInfected;
  iLabel.innerHTML = `Infections in ${timeToElapse.value} ${periodType}: `;
  infectionsByRT.innerHTML = calculatedData.impact.infectionsByRequestedTime;
  icuCasesLabel.innerHTML = `People Needing ICU Care in ${timeToElapse.value} ${periodType}: `;
  casesForICUByRT.innerHTML = calculatedData.impact.casesForICUByRequestedTime;
  hospitalBeds.innerHTML = `Hospital Beds Still Available in ${timeToElapse.value} ${periodType}: `;
  BedsByRT.innerHTML = calculatedData.impact.hospitalBedsByRequestedTime;
  ventilators.innerHTML = `Ventilators Needed in ${timeToElapse.value} ${periodType}: `;
  cVent.innerHTML = calculatedData.impact.casesForVentilatorsByRequestedTime;
  dollarsInFlight.innerHTML = `$ ${calculatedData.impact.dollarsInFlight}`;
}

function removeWarning() {
  const containers = document.getElementById('container');
  const overlayRight = document.querySelector('#overlay-right');
  containers.classList.remove('error');
  overlayRight.classList.remove('error-message-visible');
}

function displayRadioValue() {
  const element = document.getElementsByName('periodType');
  let periodType;
  for (let i = 0; i < element.length; i += 1) {
    if (element[i].checked) {
      periodType = element[i].value;
    }
  }
  return periodType;
}

// eslint-disable-next-line no-unused-vars
function handleSave() {
  const container = document.getElementById('container');
  const population = document.querySelector('#population');
  const timetoElapse = document.querySelector('#timeToElapse');
  const reportedCases = document.querySelector('#reportedCases');
  const totalHospitalBeds = document.querySelector('#totalHospitalBeds');
  const periodType = displayRadioValue();

  const checkArray = [];
  checkArray.push(
    population.value,
    timetoElapse.value,
    reportedCases.value,
    totalHospitalBeds.value,
    periodType
  );
  checkArray.forEach((item) => {
    if (Number.isNaN(item) || item === '') {
      const overlayRight = document.querySelector('#overlay-right');
      container.classList.add('error');
      overlayRight.classList.add('error-message-visible');
      container.classList.remove('right-panel-active');
    } else {
      removeWarning();
      const data = {
        region: {
          name: 'Africa',
          avgAge: 19.7,
          avgDailyIncomeInUSD: 5,
          avgDailyIncomePopulation: 0.71
        },
        periodType,
        timeToElapse: timetoElapse.value,
        reportedCases: reportedCases.value,
        population: population.value,
        totalHospitalBeds: totalHospitalBeds.value
      };
      const calculatedData = covid19ImpactEstimator(data);
      container.classList.add('right-panel-active');
      fillData(calculatedData, timetoElapse, periodType);
    }
  });
}

export default covid19ImpactEstimator;
