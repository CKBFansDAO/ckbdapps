import HalvingConfig from '../assets/JsonData/halving_events.json'

// The number of epochs per halving. This should never change.
const EPOCHS_PER_HALVING = 8760;//8760;

export function getNextHalvingEpoch(curEpochNumber) {
    return Math.floor(curEpochNumber / EPOCHS_PER_HALVING) * EPOCHS_PER_HALVING + EPOCHS_PER_HALVING
}

export function getPrevHalvingEpoch(curEpochNumber) {
    return Math.floor(curEpochNumber / EPOCHS_PER_HALVING) * EPOCHS_PER_HALVING;
}

export function number(v) {
    let value = ""
    .concat(v)
    .replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
        return "".concat(s, ",");
    });
    return value;
}