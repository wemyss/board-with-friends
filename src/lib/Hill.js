import PL, { Vec2 } from 'planck-js'
import { OFF_WHITE, TREE_DARK, TREE_LIGHT, SCALE, OBSTACLE_GROUP_INDEX, HILL_TAG } from './constants'
import { calculateAngle } from './utils'

const NUM_SEGMENTS = 20
const RUN_LENGTH = 50
const START_HILL = [
	new Vec2(-200,-100),
	new Vec2(200,200),
	new Vec2(500,100),
	new Vec2(800,500)
]

const MIN_TREE_WIDTH = 32
const MIN_TREE_HEIGHT = 50
const MIN_TREE_DISTANCE = 1
const MIN_TREE_DISTANCE_FROM_SLOPE = 20
const TREE_DISTANCE_MULTIPLIER = 20
const TREE_SIZE_MULTIPLIER = 30
const SLOPE_DISTANCE_MULTIPLIER = 100

const MIN_OBSTACLE_DISTANCE = 10
const MIN_OBSTACLE_SLOPE_DISTANCE = 0.1
const OBSTACLE_DISTANCE_MULTIPLIER = 60
const OBSTACLES = [
	{sprite: 'rock1', height: 25, width: 45},
	{sprite: 'rock2', height: 43, width: 41},
]

export default class Hill {
	constructor(scene) {
		this.scene = scene
	}

	create() {
		const gx = this.scene.add.graphics()
		gx.lineStyle(1, OFF_WHITE)
		gx.fillStyle(OFF_WHITE)


		const curves = Hill.generateBezierCurves(START_HILL)
		for (const curve of curves) {
			curve.draw(gx)
			Hill.drawSegment(gx, curve, this.scene.cameras.main.displayHeight)
		}
		// last x position of hill
		// curves.length - 1 = actual length ( minus another 2 for offset segment)
		this.endX = curves[curves.length-3].p3.x/SCALE
		
		this.body = this.scene.world.createBody({
			position: Vec2(0, 0),
			type: 'static',
			restitution: 0,
		})

		const {x, y} = this.body.getPosition()
		gx.setPosition(x * SCALE, y * SCALE)

		const vertices = Hill.generateVertices(curves)

		this.body.createFixture(PL.Chain(vertices), {
			friction: 0.5,
			userData: HILL_TAG
		})

		// decorate the hill
		this.addObstacles(vertices)
		Hill.drawTrees(gx, vertices)

	}

	/*
	 * Get the bounding vertices on the hill for a given x coordinate
	 *
	 * @param {Number} x - horizontal coordinate to get bounds for. Must be in physics scaling
	 * @return {Maybe<Object>} - left and right Vec2 bounds for point. Return null if x is out of bounds of the hill
	 */
	getBounds(x) {
		const vertices = this.body.m_fixtureList.m_shape.m_vertices
		let lo = 0
		let hi = vertices.length - 1


		if (x < vertices[0].x || x > vertices[hi].x) {
			// out of bounds
			return null
		}

		while (lo < hi) {
			const mid = Math.floor((lo + hi) / 2)
			if (vertices[mid].x > x) {
				hi = mid
			} else {
				lo = mid + 1
			}
		}

		const left = vertices[lo-1]
		const right = vertices[lo]

		return {left, right}
	}


	static drawSegment(gx, curve, displayHeight) {
		const P = Phaser.Geom.Point
		const curve_points = curve.getSpacedPoints(NUM_SEGMENTS).map(v => new P(v.x, v.y))

		for (let i = 0; i < curve_points.length-1; ++i) {
			const start = curve_points[i]
			const end = curve_points[i+1]

			const points = [
				start,
				new P(start.x, start.y + displayHeight),
				new P(end.x, end.y + displayHeight),
				end
			]
			gx.fillPoints(points, true)
		}
	}

	/*
	 * Generates the list of bezier curves to represent the whole mountain
	 *
	 * @param {Array<Vec2>} starting bezier curve
	 *
	 * @return {Array<Phaser.Curves.Curve>}
	 */
	static generateBezierCurves(start) {
		const points = [start]
		for (let i = 0; i < RUN_LENGTH + 2; ++i) {
			// Get the previous control point and endpoint
			const [last_c, last_p] = points[i].slice(-2)

			// Calculate how much to move from last point for this curve
			const dx = 700 + Math.floor(Math.srand() * 400)
			let dy = Math.floor(300 * Math.srand())
			
			// Flatten hill
			if (i >= RUN_LENGTH) {
				dy = Math.floor(dy/300)
			}
			
			// Next point in this bezier curve
			const to = last_p.clone().add(new Vec2(dx, dy))

			// Calculate control points
			const tmp = last_p.clone().sub(last_c)
			tmp.normalize()

			const c1 = last_p.clone().add(tmp.mul(0.4 * dx))
			const c2 = to.clone().sub(
				new Vec2(
					Math.floor(dx * (.3 + Math.srand() * .4)),
					0
				)
			)
			// Add bezier to our list of points
			points.push([last_p, c1, c2, to])
			
		}
		
		return points.map(curve_points =>
			new Phaser.Curves.CubicBezier(
				curve_points.flatMap(vec => [vec.x, vec.y])
			)
		)
	}

	/*
	 * Generates an array of vertices to represent the path formed by
	 * joining the curves passed in
	 *
	 * @param {Array<Phaser.Curves.Curve>} list of bezier curves
	 *
	 * @return {Array<Vec2>}
	 */
	static generateVertices(curves) {
		return curves
			.flatMap(curve => curve.getSpacedPoints(NUM_SEGMENTS).slice(0, -2))
			.map(p => new Vec2(p.x / SCALE, p.y / SCALE))
	}

	/*
	 * Draws trees using the given scene graphics, underneath the vertices given
	 *
	 * @param {Phaser.GameObjects.Graphics} gx - scene graphics
	 * @param {Array<Vec2>} vertices to place the trees underneath
	 *
	 */
	static drawTrees(gx, vertices) {
		gx.fillGradientStyle(TREE_DARK, TREE_LIGHT, TREE_DARK, TREE_DARK)
		const trees = Hill.generateTreeTriangles(vertices)
		for (const tree of trees){
			gx.fillTriangleShape(tree)
		}
	}

	/*
	 * Generates an array of triangles to draw trees from. The bases
	 * of all trees will fall underneath the vertices horizontally.
	 *
	 * @param {Array<Vec2>} vertices to place the trees underneath
	 *
	 * @return {Array<Phaser.Geom.Triangle>}
	 */
	static generateTreeTriangles(vertices) {
		// Base our next tree position off of the minimum required seperation between two trees
		// added to a random value between 0 and TREE_DISTANCE_MULTIPLIER.
		// next will then be used as the index of the vertex to line the tree up with
		let next = MIN_TREE_DISTANCE + Math.floor(Math.srand() * TREE_DISTANCE_MULTIPLIER)
		const trees = []
		while (next < vertices.length) {
			let vertex = vertices[next]
			let distanceX = vertex.x * SCALE
			let distanceY = MIN_TREE_DISTANCE_FROM_SLOPE + vertex.y * SCALE
			distanceY += Math.floor(Math.srand() * SLOPE_DISTANCE_MULTIPLIER)
			let width = MIN_TREE_WIDTH + Math.floor(Math.srand() * TREE_SIZE_MULTIPLIER)
			let height = MIN_TREE_HEIGHT + Math.floor(Math.srand() * TREE_SIZE_MULTIPLIER)
			trees.push(
				new Phaser.Geom.Triangle(
					distanceX, distanceY,
					distanceX + Math.floor(width/2), distanceY - height,
					distanceX + width, distanceY
				)
			)
			next += MIN_TREE_DISTANCE + Math.floor(Math.srand() * TREE_DISTANCE_MULTIPLIER)
		}
		return trees
	}

	/*
	 * Adds the obstacles using the given scene graphics, on top of the vertices given
	 *
	 * @param {Array<Vec2>} vertices to place the obstacles on
	 *
	 */
	addObstacles(vertices) {
		// Base our next obstacles position off of the minimum required seperation between two obstacles
		// added to a random value between 0 and OBSTACLE_DISTANCE_MULTIPLIER.
		// next will then be used as the index of the vertex to line the obstacle up with
		let next = MIN_OBSTACLE_DISTANCE + Math.floor(Math.srand() * OBSTACLE_DISTANCE_MULTIPLIER)
		while (next < vertices.length - 1) {
			const vertex = vertices[next]
			const angle = calculateAngle(vertices[next - 1], vertices[next + 1])
			const obstacle = OBSTACLES[Math.floor(Math.srand() * OBSTACLES.length)]

			const x = vertex.x
			const y = vertex.y - (Math.srand() * (obstacle.height/SCALE)/2) + MIN_OBSTACLE_SLOPE_DISTANCE

			const obstacleBody = this.scene.world.createBody({
				position: Vec2(x, y),
				type: 'static',
				angle
			})
			obstacleBody.createFixture(PL.Box((obstacle.width/SCALE)/2, (obstacle.height/SCALE)/2), {
				filterGroupIndex: OBSTACLE_GROUP_INDEX,
				isSensor: true,
			})

			this.scene.add.image(x * SCALE, y * SCALE, obstacle.sprite).setRotation(angle)

			next += MIN_OBSTACLE_DISTANCE + Math.floor(Math.srand() * OBSTACLE_DISTANCE_MULTIPLIER)
		}
	}

}
