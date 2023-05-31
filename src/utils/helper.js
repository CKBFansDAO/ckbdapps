import HalvingConfig from '../assets/JsonData/halving_events.json'

// The number of epochs per halving. This should never change.
const EPOCHS_PER_HALVING = 8760;

export function getNextHalvingEpoch(curEpochNumber) {
    return Math.floor(curEpochNumber / EPOCHS_PER_HALVING) * EPOCHS_PER_HALVING + EPOCHS_PER_HALVING
}

export function getPrevHalvingEpoch(curEpochNumber) {
    return Math.floor(curEpochNumber / EPOCHS_PER_HALVING) * EPOCHS_PER_HALVING;
}
