import PL, { Vec2 } from 'planck-js'
import { OFF_WHITE, TREE_DARK, TREE_LIGHT, SCALE } from './constants'

const RUN_LENGTH = 50
const START_HILL = [
	new Vec2(0,50),
	new Vec2(300,500),
	new Vec2(450,220),
	new Vec2(800,300)
]
const MIN_TREE_WIDTH = 32
const MIN_TREE_HEIGHT = 50
const MIN_TREE_DISTANCE = 1
const MIN_TREE_DISTANCE_FROM_SLOPE = 20
const TREE_DISTANCE_MULTIPLIER = 20
const TREE_SIZE_MULTIPLIER = 30
const SLOPE_DISTANCE_MULTIPLIER = 100

export default class Hill {
	constructor(scene) {
		const gx = scene.add.graphics()
		gx.lineStyle(8, OFF_WHITE, 1)


		const curves = Hill.generateBezierCurves(START_HILL)
		for (const curve of curves) {
			curve.draw(gx)
		}

		this.body = scene.world.createBody({
			position: Vec2(0, 0),
			type: 'static',
		})


		const {x, y} = this.body.getPosition()
		gx.setPosition(x * SCALE, y * SCALE)

		const vertices = Hill.generateVertices(curves)

		this.body.createFixture(PL.Chain(vertices), {
			friction: 0.05
		})

		// create trees
		gx.fillGradientStyle(TREE_DARK, TREE_LIGHT, TREE_DARK, TREE_DARK)
		const trees = Hill.generateTreeTriangles(vertices)
		for (const tree of trees){
			gx.fillTriangleShape(tree)
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

		for (let i = 0; i < RUN_LENGTH; ++i) {
			// Get the previous control point and endpoint
			const [last_c, last_p] = points[i].slice(-2)

			// Calculate how much to move from last point for this curve
			const dx = 700 + Math.floor(Math.random() * 400)
			const dy = Math.floor(300 * Math.random())

			// Next point in this bezier curve
			const to = last_p.clone().add(new Vec2(dx, dy))


			// Calcuate control points
			const tmp = last_p.clone().sub(last_c)
			tmp.normalize()

			const c1 = last_p.clone().add(tmp.mul(0.4 * dx))
			const c2 = to.clone().sub(
				new Vec2(
					Math.floor(dx * (.3 + Math.random() * .4)),
					dy % 2 ? -dy * Math.random() : dy * Math.random()
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
			.flatMap(curve => curve.getSpacedPoints(20).slice(0, -2))
			.map(p => new Vec2(p.x / SCALE, p.y / SCALE))
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
		let next = MIN_TREE_DISTANCE + Math.floor(Math.random() * TREE_DISTANCE_MULTIPLIER)
		const trees = []
		while (next < vertices.length) {
			let vertex = vertices[next]
			let distanceX = vertex.x * SCALE
			let distanceY = MIN_TREE_DISTANCE_FROM_SLOPE + vertex.y * SCALE
			distanceY += Math.floor(Math.random() * SLOPE_DISTANCE_MULTIPLIER)
			let width = MIN_TREE_WIDTH + Math.floor(Math.random() * TREE_SIZE_MULTIPLIER)
			let height = MIN_TREE_HEIGHT + Math.floor(Math.random() * TREE_SIZE_MULTIPLIER)
			trees.push(
				new Phaser.Geom.Triangle(
					distanceX, distanceY,
					distanceX + Math.floor(width/2), distanceY - height,
					distanceX + width, distanceY
				)
			)
			next += MIN_TREE_DISTANCE + Math.floor(Math.random() * TREE_DISTANCE_MULTIPLIER)
		}
		return trees
	}
}
