import {Vector4} from '../math/Vector4'
import {Vector3} from '../math/Vector3'
import {Vector2} from '../math/Vector2'
import {Color} from '../math/Color'

/**
 * @author mrdoob / http://mrdoob.com/
 * @author corruptedzulu / http://github.com/corruptedzulu
 * @author Joe Pea / http://github.com/trusktr
 */

/**
 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/core/BufferAttribute.js">src/core/BufferAttribute.js</a>
 */
export class BufferAttribute {
	uuid: string
	array: Float32Array
	itemSize: i32
	dynamic: boolean
	updateRange: Map<string, i32> //{offset: f32; count: f32}
	version: f32
	normalized: boolean
	needsUpdate: boolean
	count: i32
	//onUpload: Function
	//TODO: this is needed per the documentation but I don't know what to do about "Function"
	// onUploadCallback: Function

	constructor(array: Float32Array, itemSize: i32, normalized: boolean = true) {
		// array parameter should be TypedArray.

		this.array = array
		this.itemSize = itemSize
		//undefined is not in AS
		// this.count = array !== undefined ? array.length / itemSize : 0
		this.count = array.length / itemSize
		this.normalized = normalized /*=== true*/ //switched to default parameter

		this.dynamic = false
		this.updateRange = new Map<string, i32>()
		this.updateRange.set('offset', 0)
		this.updateRange.set('count', -1)
		//{offset: 0, count: -1}

		this.version = 0
	}

	// setArray(array: TypedArray<f32>): this {
	//     this.count = array !== undefined ? array.length / this.itemSize : 0;
	// 	this.array = array;

	// 	return this;
	// }

	// setDynamic(dynamic: boolean): this {
	//     this.dynamic = dynamic;

	// 	return this;
	// }

	// clone(): BufferAttribute {
	//     return new BufferAttribute( this.array, this.itemSize ).copy( this );
	// }

	// copy(source: BufferAttribute): this {

	// 	this.array = new Float32Array( source.array.length );

	// 	for (let i = 0, l = source.array.length; i < l; i++) {
	// 		this.array[i] = source.array[i]
	// 	}

	// 	this.itemSize = source.itemSize;
	// 	this.count = source.count;
	// 	this.normalized = source.normalized;

	// 	this.dynamic = source.dynamic;

	// 	return this;
	// }

	// copyAt(index1: f32, attribute: BufferAttribute, index2: f32): this {
	//     index1 *= this.itemSize;
	// 	index2 *= attribute.itemSize;

	// 	for ( var i = 0, l = this.itemSize; i < l; i ++ ) {

	// 		this.array[ index1 + i ] = attribute.array[ index2 + i ];

	// 	}

	// 	return this;
	// }

	copyArray(array: Float32Array): this {
		if (array.length > this.array.length) throw new Error('Source array is bigger than the target array.')

		// TODO, type definitions not working for memory.copy version.
		// memory.copy(array.dataStart, this.array.dataStart, array.length)

		for (let i = 0, l = array.length; i < l; i++) {
			this.array[i] = array[i]
		}

		return this
	}

	copyColorsArray(colors: Color[] /*{r: f32; g: f32; b: f32}[]*/): this {
		var array = this.array,
			offset = 0

		for (var i = 0, l = colors.length; i < l; i++) {
			var color = colors[i]

			//undefined does not exist in As
			// if (color === undefined) {
			// 	//console.warn( 'THREE.BufferAttribute.copyColorsArray(): color is undefined', i );
			// 	color = new Color()
			// }

			array[offset++] = color.r
			array[offset++] = color.g
			array[offset++] = color.b
		}

		return this
	}

	copyVector2sArray(vectors: Vector2[] /*{x: f32; y: f32}[]*/): this {
		var array = this.array,
			offset = 0

		for (var i = 0, l = vectors.length; i < l; i++) {
			var vector = vectors[i]

			//undefined does not exist in AS
			// if (vector === undefined) {
			// 	//console.warn( 'THREE.BufferAttribute.copyVector2sArray(): vector is undefined', i );
			// 	vector = new Vector2()
			// }

			array[offset++] = vector.x
			array[offset++] = vector.y
		}

		return this
	}

	copyVector3sArray(vectors: Vector3[] /*{x: f32; y: f32; z: f32}[]*/): this {
		var array: Float32Array = this.array,
			offset: i32 = 0

		for (var i = 0, l = vectors.length; i < l; i++) {
			var vector = vectors[i]

			//undefined does not exist in AS
			// if (vector === undefined) {
			// 	//console.warn( 'THREE.BufferAttribute.copyVector3sArray(): vector is undefined', i );
			// 	vector = new Vector3()
			// }

			array[offset++] = vector.x
			array[offset++] = vector.y
			array[offset++] = vector.z
		}

		return this
	}

	// copyVector4sArray(vectors: {x: f32; y: f32; z: f32; w: f32}[]): this {
	//     var array = this.array, offset = 0;

	// 	for ( var i = 0, l = vectors.length; i < l; i ++ ) {

	// 		var vector = vectors[ i ];

	// 		if ( vector === undefined ) {

	// 			//console.warn( 'THREE.BufferAttribute.copyVector4sArray(): vector is undefined', i );
	// 			vector = new Vector4();

	// 		}

	// 		array[ offset ++ ] = vector.x;
	// 		array[ offset ++ ] = vector.y;
	// 		array[ offset ++ ] = vector.z;
	// 		array[ offset ++ ] = vector.w;

	// 	}

	// 	return this;
	// }

	// set(value: Float32Array, offset?: f32): this {

	// 	if ( offset === undefined ) offset = 0;

	// 	this.copyArray(value.subarray(offset))

	// 	// this.array.set( value, offset );

	// 	return this;
	// }

	// getX(index: f32): f32 {
	//     return this.array[ index * this.itemSize ];
	// }

	// setX(index: f32, x: f32): this {
	//     this.array[ index * this.itemSize ] = x;

	// 	return this;
	// }

	// getY(index: f32): f32 {
	//     return this.array[ index * this.itemSize + 1 ];
	// }

	// setY(index: f32, y: f32): this {
	//     this.array[ index * this.itemSize + 1 ] = y;

	// 	return this;
	// }

	// getZ(index: f32): f32 {
	//     return this.array[ index * this.itemSize + 2 ];
	// }

	// setZ(index: f32, z: f32): this {
	//     this.array[ index * this.itemSize + 2 ] = z;

	// 	return this;
	// }

	// getW(index: f32): f32 {
	//     return this.array[ index * this.itemSize + 3 ];
	// }

	// setW(index: f32, w: f32): this {
	//     this.array[ index * this.itemSize + 3 ] = w;

	// 	return this;
	// }

	// setXY(index: f32, x: f32, y: f32): this {
	//     index *= this.itemSize;

	// 	this.array[ index + 0 ] = x;
	// 	this.array[ index + 1 ] = y;

	// 	return this;
	// }

	// setXYZ(index: f32, x: f32, y: f32, z: f32): this {
	//     index *= this.itemSize;

	// 	this.array[ index + 0 ] = x;
	// 	this.array[ index + 1 ] = y;
	// 	this.array[ index + 2 ] = z;

	// 	return this;
	// }

	// setXYZW(index: f32, x: f32, y: f32, z: f32, w: f32): this {
	//     index *= this.itemSize;

	// 	this.array[ index + 0 ] = x;
	// 	this.array[ index + 1 ] = y;
	// 	this.array[ index + 2 ] = z;
	// 	this.array[ index + 3 ] = w;

	// 	return this;
	// }

	//TODO: This is needed per the document, but I don't know what to do about "Function"
	// onUpload(callback: Function): this {
	// 	this.onUploadCallback = callback

	// 	return this
	// }

	// toJSON(): any {

	// 	return {
	// 		itemSize: this.itemSize,
	// 		// type: this.array.constructor.name,
	// 		// array: Array.prototype.slice.call( this.array ),
	// 		array: this.array,
	// 		normalized: this.normalized
	// 	};

	// }
}

export class Int8BufferAttribute extends BufferAttribute {
	constructor(array: Int8Array, itemSize: f32, normalized?: boolean) {
		super(array, itemSize, normalized)
	}
}

export class Uint8BufferAttribute extends BufferAttribute {
	constructor(array: Uint8Array, itemSize: f32, normalized?: boolean) {
		super(array, itemSize, normalized)
	}
}

export class Uint8ClampedBufferAttribute extends BufferAttribute {
	constructor(array: Uint8ClampedArray, itemSize: f32, normalized?: boolean) {
		super(array, itemSize, normalized)
	}
}

export class Int16BufferAttribute extends BufferAttribute {
	constructor(array: Int16Array, itemSize: f32, normalized?: boolean) {
		super(array, itemSize, normalized)
	}
}

export class Uint16BufferAttribute extends BufferAttribute {
	constructor(array: Uint16Array, itemSize: f32, normalized?: boolean) {
		super(array, itemSize, normalized)
	}
}

export class Int32BufferAttribute extends BufferAttribute {
	constructor(array: Int32Array, itemSize: f32, normalized?: boolean) {
		super(array, itemSize, normalized)
	}
}

export class Uint32BufferAttribute extends BufferAttribute {
	constructor(array: Uint32Array, itemSize: f32, normalized?: boolean) {
		super(array, itemSize, normalized)
	}
}

export class Float32BufferAttribute extends BufferAttribute {
	constructor(array: Float32Array, itemSize: f32, normalized?: boolean) {
		super(array, itemSize, normalized)
	}
}

export class Float64BufferAttribute extends BufferAttribute {
	constructor(array: Float64Array, itemSize: f32, normalized?: boolean) {
		super(array, itemSize, normalized)
	}
}
