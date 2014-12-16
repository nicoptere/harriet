/**
 * @param axis  the rotation axis
 * @param section the shape to lathe around the axis
 * @param count the number of steps
 * @param material optional the object's material
 * @constructor
 */
var Lathe = function( axis, section, count, material, angleMax )
{
    var geometry = new THREE.Geometry();

    count = count || 3;
    var vertices = section.geometry == null ? section : section.geometry.vertices;
    console.log( )
    var sides = vertices.length;
    var uvs = Array.expand2D( [0, 1], [0, 1], count + 1, sides );


    //orientation
    var v, n, step = 0, back, i, j, i0, i1, i2, i3;

    var vs = [];
    var angle = 0;
    var angleStep = ( angleMax || Math.PI * 2 ) / count;
    var mat = new THREE.Matrix4();
    for ( i = 0; i <= count; i++ )
    {

        angle = i * angleStep + Math.PI;
        mat.identity();
        mat.makeRotationAxis( axis, angle );

        //push transformed vertices
        vertices.forEach( function( vector )
        {
            var nv = new THREE.Vector3( vector.x, vector.y, vector.z );
            nv.applyMatrix4( mat );
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

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    THREE.Mesh.call( this, geometry, material );

};

Lathe.prototype = Object.create( THREE.Mesh.prototype );
