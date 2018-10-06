var score
var hits
var distance

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
	return score + distance
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