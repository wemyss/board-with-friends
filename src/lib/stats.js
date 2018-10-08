var score
var hits
var distance

const DISTANCE_SCORE_STEP = 10

export function resetScore() {
	score = 0
}

export function resetHits() {
	hits = 0
}

export function setDistance(_distance) {
	distance = _distance
}

export function increaseHits() {
	hits += 1
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