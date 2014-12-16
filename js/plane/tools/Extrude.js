/**
 * @param axis  the rotation axis
 * @param section the shape to lathe around the axis
 * @param height the number of steps
 * @param count the number of steps
 * @param material optional the object's material
 * @constructor
 */
var Extrude = function( axis, section, height, count, material )
{
    var geometry = new THREE.Geometry();

    count = count || 2;

    var vertices = section.geometry == null ? section : section.geometry.vertices;
    var sides = vertices.length;
    var uvs = Array.expand2D( [0, 1], [0, 1], sides * count , sides );

    var vs = [];
    //orientation
    var step = 0, back, i, j, i0, i1, i2, i3;
    var heightStep = height / count;
    var dir = new THREE.Vector3();
    for ( i = 0; i <= count; i++ )
    {

        dir.copy( axis );
        dir.multiplyScalar( i * heightStep );

        //push transformed vertices
        vertices.forEach( function( vector )
        {
            var nv = new THREE.Vector3( vector.x, vector.y, vector.z );
            nv.add( dir );
            vs.push( nv );
        });

        //create faces
        if ( step > 0 )
        {
            back = step - sides;
            for ( j = 0; j < sides; j++ )
            {

                i0 = back + j;
                i1 = back + ( j + 1 ) % sides;
                i2 = step + j;
                i3 = step + ( j + 1 ) % sides;

                geometry.faces.push( new THREE.Face3( i1, i0, i2 ) );
                geometry.faces.push( new THREE.Face3( i1, i2, i3 ) );

                geometry.faceVertexUvs[ 0 ].push( [ uvs[ i1 ], uvs[ i0 ], uvs[ i2 ] ] );
                geometry.faceVertexUvs[ 0 ].push( [ uvs[ i1 ], uvs[ i2 ], uvs[ i3 ] ] );

            }
        }
        step += sides;
    }

    //updates geometry
    geometry.vertices = vs;
    geometry.uvs = uvs;
    geometry.verticesNeedUpdate =
    geometry.uvsNeedUpdate = true;

    Caps.getFaces( geometry, 0, sides );
    Caps.getFaces( geometry, vs.length - sides, vs.length );

    THREE.Mesh.call( this, geometry, material );
    this.castShadow = true;

};

Extrude.prototype = Object.create( THREE.Mesh.prototype );
