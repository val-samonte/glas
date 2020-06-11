/**
 * @author bhouston / http://clara.io
 * @author WestLangley / http://github.com/WestLangley
 * @author Joe Pea / http://github.com/trusktr
 */
import {Vector3} from './Vector3'
// import {Object3D} from '../core/Object3D'
// import {Sphere} from './Sphere'
// import {Plane} from './Plane'
import {Matrix4} from './Matrix4'

var points: Vector3[] = [
	new Vector3(),
	new Vector3(),
	new Vector3(),
	new Vector3(),
	new Vector3(),
	new Vector3(),
	new Vector3(),
	new Vector3(),
]

export class Box3 {
	max: Vector3
	min: Vector3
	readonly isBox3: boolean = true

	constructor(
		min: Vector3 = new Vector3(+Infinity, +Infinity, +Infinity),
		max: Vector3 = new Vector3(-Infinity, -Infinity, -Infinity)
	) {
		this.min = min
		this.max = max
	}

	// expandByVector(vector: Vector3): this
	// expandByObject(object: Object3D): this
	// containsPoint(point: Vector3): boolean
	// containsBox(box: Box3): boolean
	// getParameter(point: Vector3): Vector3
	// intersectsBox(box: Box3): boolean
	// intersectsSphere(sphere: Sphere): boolean
	// intersectsPlane(plane: Plane): boolean
	// clampPoint(point: Vector3, target: Vector3): Vector3
	// distanceToPoint(point: Vector3): f32
	// getBoundingSphere(target: Sphere): Sphere
	// intersect(box: Box3): this
	// union(box: Box3): this

	set(min: Vector3, max: Vector3): this {
		this.min.copy(min)
		this.max.copy(max)

		return this
	}

	// setFromArray(array: ArrayLike<f32>): this {
	// 	var minX = +Infinity
	// 	var minY = +Infinity
	// 	var minZ = +Infinity

	// 	var maxX = -Infinity
	// 	var maxY = -Infinity
	// 	var maxZ = -Infinity

	// 	for (var i = 0, l = array.length; i < l; i += 3) {
	// 		var x = array[i]
	// 		var y = array[i + 1]
	// 		var z = array[i + 2]

	// 		if (x < minX) minX = x
	// 		if (y < minY) minY = y
	// 		if (z < minZ) minZ = z

	// 		if (x > maxX) maxX = x
	// 		if (y > maxY) maxY = y
	// 		if (z > maxZ) maxZ = z
	// 	}

	// 	this.min.set(minX, minY, minZ)
	// 	this.max.set(maxX, maxY, maxZ)

	// 	return this
	// },

	// setFromBufferAttribute: function(attribute) {
	// 	var minX = +Infinity
	// 	var minY = +Infinity
	// 	var minZ = +Infinity

	// 	var maxX = -Infinity
	// 	var maxY = -Infinity
	// 	var maxZ = -Infinity

	// 	for (var i = 0, l = attribute.count; i < l; i++) {
	// 		var x = attribute.getX(i)
	// 		var y = attribute.getY(i)
	// 		var z = attribute.getZ(i)

	// 		if (x < minX) minX = x
	// 		if (y < minY) minY = y
	// 		if (z < minZ) minZ = z

	// 		if (x > maxX) maxX = x
	// 		if (y > maxY) maxY = y
	// 		if (z > maxZ) maxZ = z
	// 	}

	// 	this.min.set(minX, minY, minZ)
	// 	this.max.set(maxX, maxY, maxZ)

	// 	return this
	// },

	setFromPoints(points: Vector3[]): this {
		this.makeEmpty()

		for (var i = 0, il = points.length; i < il; i++) {
			this.expandByPoint(points[i])
		}

		return this
	}

	// setFromCenterAndSize(center: Vector3, size: Vector3): this
	// setFromCenterAndSize: (function() {
	// 	var v1 = new Vector3()

	// 	return function setFromCenterAndSize(center, size) {
	// 		var halfSize = v1.copy(size).multiplyScalar(0.5)

	// 		this.min.copy(center).sub(halfSize)
	// 		this.max.copy(center).add(halfSize)

	// 		return this
	// 	}
	// })(),

	// setFromObject(object: Object3D): this {
	// 	this.makeEmpty()

	// 	return this.expandByObject(object)
	// },

	clone(): Box3 {
		const b = new Box3()
		b.copy(this)
		return b
	}

	copy(box: Box3): this {
		this.min.copy(box.min)
		this.max.copy(box.max)

		return this
	}

	makeEmpty(): this {
		this.min.x = this.min.y = this.min.z = +Infinity
		this.max.x = this.max.y = this.max.z = -Infinity

		return this
	}

	isEmpty(): boolean {
		// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes

		return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z
	}

	getCenter(target: Vector3): Vector3 {
		return this.isEmpty() ? target.set(0, 0, 0) : target.addVectors(this.min, this.max).multiplyScalar(0.5)
	}

	getSize(target: Vector3): Vector3 {
		return this.isEmpty() ? target.set(0, 0, 0) : target.subVectors(this.max, this.min)
	}

	expandByPoint(point: Vector3): this {
		this.min.min(point)
		this.max.max(point)

		return this
	}

	// expandByVector: function(vector) {
	// 	this.min.sub(vector)
	// 	this.max.add(vector)

	// 	return this
	// },

	expandByScalar(scalar: f32): this {
		this.min.addScalar(-scalar)
		this.max.addScalar(scalar)

		return this
	}

	// expandByObject: (function() {
	// 	// Computes the world-axis-aligned bounding box of an object (including its children),
	// 	// accounting for both the object's, and children's, world transforms

	// 	var scope, i, l

	// 	var v1 = new Vector3()

	// 	function traverse(node) {
	// 		var geometry = node.geometry

	// 		if (geometry !== undefined) {
	// 			if (geometry.isGeometry) {
	// 				var vertices = geometry.vertices

	// 				for (i = 0, l = vertices.length; i < l; i++) {
	// 					v1.copy(vertices[i])
	// 					v1.applyMatrix4(node.matrixWorld)

	// 					scope.expandByPoint(v1)
	// 				}
	// 			} else if (geometry.isBufferGeometry) {
	// 				var attribute = geometry.attributes.position

	// 				if (attribute !== undefined) {
	// 					for (i = 0, l = attribute.count; i < l; i++) {
	// 						v1.fromBufferAttribute(attribute, i).applyMatrix4(node.matrixWorld)

	// 						scope.expandByPoint(v1)
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}

	// 	return function expandByObject(object) {
	// 		scope = this

	// 		object.updateMatrixWorld(true)

	// 		object.traverse(traverse)

	// 		return this
	// 	}
	// })(),

	// containsPoint: function(point) {
	// 	return point.x < this.min.x ||
	// 		point.x > this.max.x ||
	// 		point.y < this.min.y ||
	// 		point.y > this.max.y ||
	// 		point.z < this.min.z ||
	// 		point.z > this.max.z
	// 		? false
	// 		: true
	// },

	// containsBox: function(box) {
	// 	return (
	// 		this.min.x <= box.min.x &&
	// 		box.max.x <= this.max.x &&
	// 		this.min.y <= box.min.y &&
	// 		box.max.y <= this.max.y &&
	// 		this.min.z <= box.min.z &&
	// 		box.max.z <= this.max.z
	// 	)
	// },

	// getParameter: function(point, target) {
	// 	// This can potentially have a divide by zero if the box
	// 	// has a size dimension of 0.

	// 	if (target === undefined) {
	// 		console.warn('THREE.Box3: .getParameter() target is now required')
	// 		target = new Vector3()
	// 	}

	// 	return target.set(
	// 		(point.x - this.min.x) / (this.max.x - this.min.x),
	// 		(point.y - this.min.y) / (this.max.y - this.min.y),
	// 		(point.z - this.min.z) / (this.max.z - this.min.z)
	// 	)
	// },

	// intersectsBox: function(box) {
	// 	// using 6 splitting planes to rule out intersections.
	// 	return box.max.x < this.min.x ||
	// 		box.min.x > this.max.x ||
	// 		box.max.y < this.min.y ||
	// 		box.min.y > this.max.y ||
	// 		box.max.z < this.min.z ||
	// 		box.min.z > this.max.z
	// 		? false
	// 		: true
	// },

	// intersectsSphere: (function() {
	// 	var closestPoint = new Vector3()

	// 	return function intersectsSphere(sphere) {
	// 		// Find the point on the AABB closest to the sphere center.
	// 		this.clampPoint(sphere.center, closestPoint)

	// 		// If that point is inside the sphere, the AABB and sphere intersect.
	// 		return closestPoint.distanceToSquared(sphere.center) <= sphere.radius * sphere.radius
	// 	}
	// })(),

	// intersectsPlane: function(plane) {
	// 	// We compute the minimum and maximum dot product values. If those values
	// 	// are on the same side (back or front) of the plane, then there is no intersection.

	// 	var min, max

	// 	if (plane.normal.x > 0) {
	// 		min = plane.normal.x * this.min.x
	// 		max = plane.normal.x * this.max.x
	// 	} else {
	// 		min = plane.normal.x * this.max.x
	// 		max = plane.normal.x * this.min.x
	// 	}

	// 	if (plane.normal.y > 0) {
	// 		min += plane.normal.y * this.min.y
	// 		max += plane.normal.y * this.max.y
	// 	} else {
	// 		min += plane.normal.y * this.max.y
	// 		max += plane.normal.y * this.min.y
	// 	}

	// 	if (plane.normal.z > 0) {
	// 		min += plane.normal.z * this.min.z
	// 		max += plane.normal.z * this.max.z
	// 	} else {
	// 		min += plane.normal.z * this.max.z
	// 		max += plane.normal.z * this.min.z
	// 	}

	// 	return min <= -plane.constant && max >= -plane.constant
	// },

	// intersectsTriangle: (function() {
	// 	// triangle centered vertices
	// 	var v0 = new Vector3()
	// 	var v1 = new Vector3()
	// 	var v2 = new Vector3()

	// 	// triangle edge vectors
	// 	var f0 = new Vector3()
	// 	var f1 = new Vector3()
	// 	var f2 = new Vector3()

	// 	var testAxis = new Vector3()

	// 	var center = new Vector3()
	// 	var extents = new Vector3()

	// 	var triangleNormal = new Vector3()

	// 	function satForAxes(axes) {
	// 		var i, j

	// 		for (i = 0, j = axes.length - 3; i <= j; i += 3) {
	// 			testAxis.fromArray(axes, i)
	// 			// project the aabb onto the seperating axis
	// 			var r =
	// 				extents.x * Mathf.abs(testAxis.x) +
	// 				extents.y * Mathf.abs(testAxis.y) +
	// 				extents.z * Mathf.abs(testAxis.z)
	// 			// project all 3 vertices of the triangle onto the seperating axis
	// 			var p0 = v0.dot(testAxis)
	// 			var p1 = v1.dot(testAxis)
	// 			var p2 = v2.dot(testAxis)
	// 			// actual test, basically see if either of the most extreme of the triangle points intersects r
	// 			if (Mathf.max(-Mathf.max(p0, p1, p2), Mathf.min(p0, p1, p2)) > r) {
	// 				// points of the projected triangle are outside the projected half-length of the aabb
	// 				// the axis is seperating and we can exit
	// 				return false
	// 			}
	// 		}

	// 		return true
	// 	}

	// 	return function intersectsTriangle(triangle) {
	// 		if (this.isEmpty()) {
	// 			return false
	// 		}

	// 		// compute box center and extents
	// 		this.getCenter(center)
	// 		extents.subVectors(this.max, center)

	// 		// translate triangle to aabb origin
	// 		v0.subVectors(triangle.a, center)
	// 		v1.subVectors(triangle.b, center)
	// 		v2.subVectors(triangle.c, center)

	// 		// compute edge vectors for triangle
	// 		f0.subVectors(v1, v0)
	// 		f1.subVectors(v2, v1)
	// 		f2.subVectors(v0, v2)

	// 		// test against axes that are given by cross product combinations of the edges of the triangle and the edges of the aabb
	// 		// make an axis testing of each of the 3 sides of the aabb against each of the 3 sides of the triangle = 9 axis of separation
	// 		// axis_ij = u_i x f_j (u0, u1, u2 = face normals of aabb = x,y,z axes vectors since aabb is axis aligned)
	// 		var axes = [
	// 			0,
	// 			-f0.z,
	// 			f0.y,
	// 			0,
	// 			-f1.z,
	// 			f1.y,
	// 			0,
	// 			-f2.z,
	// 			f2.y,
	// 			f0.z,
	// 			0,
	// 			-f0.x,
	// 			f1.z,
	// 			0,
	// 			-f1.x,
	// 			f2.z,
	// 			0,
	// 			-f2.x,
	// 			-f0.y,
	// 			f0.x,
	// 			0,
	// 			-f1.y,
	// 			f1.x,
	// 			0,
	// 			-f2.y,
	// 			f2.x,
	// 			0,
	// 		]
	// 		if (!satForAxes(axes)) {
	// 			return false
	// 		}

	// 		// test 3 face normals from the aabb
	// 		axes = [1, 0, 0, 0, 1, 0, 0, 0, 1]
	// 		if (!satForAxes(axes)) {
	// 			return false
	// 		}

	// 		// finally testing the face normal of the triangle
	// 		// use already existing triangle edge vectors here
	// 		triangleNormal.crossVectors(f0, f1)
	// 		axes = [triangleNormal.x, triangleNormal.y, triangleNormal.z]
	// 		return satForAxes(axes)
	// 	}
	// })(),

	// clampPoint: function(point, target) {
	// 	if (target === undefined) {
	// 		console.warn('THREE.Box3: .clampPoint() target is now required')
	// 		target = new Vector3()
	// 	}

	// 	return target.copy(point).clamp(this.min, this.max)
	// },

	// distanceToPoint: (function() {
	// 	var v1 = new Vector3()

	// 	return function distanceToPoint(point) {
	// 		var clampedPoint = v1.copy(point).clamp(this.min, this.max)
	// 		return clampedPoint.sub(point).length()
	// 	}
	// })(),

	// getBoundingSphere: (function() {
	// 	var v1 = new Vector3()

	// 	return function getBoundingSphere(target) {
	// 		if (target === undefined) {
	// 			console.error('THREE.Box3: .getBoundingSphere() target is now required')
	// 			//target = new Sphere(); // removed to avoid cyclic dependency
	// 		}

	// 		this.getCenter(target.center)

	// 		target.radius = this.getSize(v1).length() * 0.5

	// 		return target
	// 	}
	// })(),

	// intersect: function(box) {
	// 	this.min.max(box.min)
	// 	this.max.min(box.max)

	// 	// ensure that if there is no overlap, the result is fully empty, not slightly empty with non-inf/+inf values that will cause subsequence intersects to erroneously return valid values.
	// 	if (this.isEmpty()) this.makeEmpty()

	// 	return this
	// },

	// union: function(box) {
	// 	this.min.min(box.min)
	// 	this.max.max(box.max)

	// 	return this
	// },

	applyMatrix4(matrix: Matrix4): this {
		// transform of empty box is an empty box.
		if (this.isEmpty()) return this

		// NOTE: I am using a binary pattern to specify all 2^3 combinations below
		points[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(matrix) // 000
		points[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(matrix) // 001
		points[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(matrix) // 010
		points[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(matrix) // 011
		points[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(matrix) // 100
		points[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(matrix) // 101
		points[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(matrix) // 110
		points[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(matrix) // 111

		this.setFromPoints(points)

		return this
	}

	translate(offset: Vector3): this {
		this.min.add(offset)
		this.max.add(offset)

		return this
	}

	equals(box: Box3): boolean {
		return box.min.equals(this.min) && box.max.equals(this.max)
	}
}

export function compareBox(a: Box3, b: Box3, threshold: f32 = 0.0001): bool {
	return a.min.distanceTo(b.min) < threshold && a.max.distanceTo(b.max) < threshold
}
