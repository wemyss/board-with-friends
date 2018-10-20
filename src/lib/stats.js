import { COMPLETED_FLIP_POINTS } from './constants'

var distance
var falls
var flips
var hits
var score

const DISTANCE_SCORE_STEP = 10


export function resetAll() {
	distance = 0
	falls = 0
	flips = 0
	hits = 0
	score = 0
}

export function getStats() {
	return {
		falls,
		flips,
		hits,
		score: getScore(),
	}
}

export function setDistance(_distance) {
	distance = _distance
}

export function increaseHits() {
	hits += 1
}

export function increaseFalls() {
	falls += 1
}

export function addFlips(numFlips) {
	score += Math.pow(numFlips, 2) * COMPLETED_FLIP_POINTS
	flips += numFlips
}

export function getScore() {
	return score + Math.floor(distance / DISTANCE_SCORE_STEP) * DISTANCE_SCORE_STEP
}

export function addScore(increment) {
	score += increment
}

export function reduceScore(decrement) {
	score -= decrement
}

export function getHits() {
	return hits
}

export function getFalls() {
	return falls
}

export function getFlips() {
	return flips
}
