/**
 * creates a 3D Loft object.
 * @param	path		a series of Vector3D objects describing the path
 * @param 	section		specifies a Section object to Extrude along the path
 * @param	material [optional]		specifies a material to assign to the renderable spline mesh
 */
var Loft = function( path, section, material )
{
    var geometry = new THREE.Geometry();

    var vertices = section.geometry == null ? section : section.geometry.vertices;
    var sides = vertices.length;
    var uvs = Array.expand2D( [0, 1], [0, 1], path.length, sides );

    this.sectionVertices = vertices;
    this.sides = sides;

    //orientation
    var WORLD_UP_AXIS = new THREE.Vector3( 0,0,1 );
    var v, n, step = 0, back, i, j, i0, i1, i2, i3;

    var vs = [];
    var mat = new THREE.Matrix4();
    for ( i = 0; i < path.length; i++ )
    {

        v = path[ i ];
        n = path[ ( i + 1 ) >= path.length ? i : ( i+1 ) ];

        //find the orientation of the section at this location
        mat.identity();
        mat.setPosition( v );
        mat.lookAt( v,n, WORLD_UP_AXIS );

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

    Caps.getFaces( geometry, 0, sides );
    Caps.getFaces( geometry, vs.length - sides, vs.length );

    THREE.Mesh.call( this, geometry, material );

};
Loft.prototype = Object.create( THREE.Mesh.prototype );
Loft.prototype.update = function( path )
{

    var vertices = this.geometry.vertices;

    //orientation
    var v, n,  WORLD_UP_AXIS = new THREE.Vector3( 0,0,1 );
    var mat = new THREE.Matrix4();
    for ( i = 0; i < path.length; i++ )
    {

        v = path[ i ];
        n = path[ ( i + 1 ) >= path.length ? i : ( i+1 ) ];

        //find the orientation of the section at this location
        mat.identity();
        mat.setPosition( v );
        mat.lookAt( v,n, WORLD_UP_AXIS );

        //update transformed vertices
        for( var j = 0; j < this.sectionVertices.length; j++ )
        {
            //reset & update
            vertices[ i * this.sides + j ].copy( this.sectionVertices[ j ] );
            vertices[ i * this.sides + j ].applyMatrix4( mat );
        }
    }

    //updates geometry
    this.geometry.verticesNeedUpdate = true;
    this.geometry.computeFaceNormals();
    this.geometry.computeVertexNormals();

};