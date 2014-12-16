
var Caps = function(){};
Caps.getFaces = function( geometry, startIndex, endIndex )
{
    var vertices, i;
    if( startIndex == null || endIndex == null ) {
        vertices = geometry.vertices.concat();
        startIndex = 0;
        endIndex = vertices.length;
    }
    else
    {

        vertices = [];
        endIndex = endIndex || vertices.length;
        for( i = startIndex; i<  endIndex; i++ )
        {
            vertices.push( geometry.vertices[ i ] );
        }
    }
    var tesselation;
    try
    {
        tesselation = POLYGON.tessellate( vertices, [[]] );
    }
    catch( e )
    {

        try {
            vertices.reverse();
            tesselation = POLYGON.tessellate(vertices, [[]]);
        }
        catch( e )
        {
            geometry.computeFaceNormals();
            geometry.computeVertexNormals();
            return;
        }
    }

    //console.log( geometry.uvs )
    //console.log( geometry.uvs.length )

    for( i = 0; i < tesselation.length; i++ )
    {
        var f = tesselation[i];
        if( f == null )break;

        var i0 = startIndex + f[0];
        var i1 = startIndex + f[1];
        var i2 = startIndex + f[2];
        //console.log( "-------uvs" )
        //console.log( geometry.uvs[i0] )
        //console.log( geometry.uvs[i1] )
        //console.log( geometry.uvs[i2] )
        //console.log( "-------" )

        geometry.faces.push( new THREE.Face3( i0, i1, i2 ) );
        if( geometry.uvs != null ) geometry.faceVertexUvs[ 0 ].push( [ geometry.uvs[ i0 ], geometry.uvs[ i1 ], geometry.uvs[ i2 ] ] );

        geometry.faces.push( new THREE.Face3( i1, i0, i2 ) );
        if( geometry.uvs != null ) geometry.faceVertexUvs[ 0 ].push( [ geometry.uvs[ i1 ], geometry.uvs[ i0 ], geometry.uvs[ i2 ] ] );

        //console.log( i, "tess", f[0],f[1],f[2]);
        //console.log( i, "tess", i0,i1,i2);
        //console.log( geometry.faceVertexUvs[ 0].length, [ geometry.uvs[ i1 ], geometry.uvs[ i0 ], geometry.uvs[ i2 ] ] );
        //console.log( geometry.faceVertexUvs[ 0].length, [ geometry.uvs[ i0 ], geometry.uvs[ i1 ], geometry.uvs[ i2 ] ] );

    }
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    return geometry;
};
