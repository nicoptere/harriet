
var Section = function( points, material, computeFaces )
{
    this.points = points;
    var vertices =[];
    var uvs = [];

    var min = new THREE.Vector2( Math.POSITIVE_INFINITY, Math.POSITIVE_INFINITY );
    var max = new THREE.Vector2( Math.NEGATIVE_INFINITY, Math.NEGATIVE_INFINITY );

    //make vertices loop for uv mapping
    //if(  points[0].x != points[points.length - 1].x
    //&&   points[0].y != points[points.length - 1].y ) points.push( points[0] );

    // vertices
    for (var i = 0; i < points.length; i++)
    {

        var p = points[ i ];
        var v = new THREE.Vector3( p.x, p.y, 0 );
        vertices.push( v );

        if ( p.x < min.x ) min.x = p.x;
        if ( p.y < min.y ) min.y = p.y;
        if ( p.x > max.x ) max.x = p.x;
        if ( p.y > max.y ) max.y = p.y;

    }

    //console.log( min.x, min.y, max.x, max.y );
    //uvs
    var dx = 1 / ( max.x - min.x );
    var dy = 1 / ( max.y - min.y );
    for( i = 0; i < points.length; i++)
    {
        p = points[ i ];
        //uvs.push( new THREE.Vector2( ( p.x - min.x) * dx, ( p.y - min.y ) * dy ) );
        uvs.push( new THREE.Vector2( norm( p.x, min.x, max.x ), norm( p.y, min.y, max.y ) ) );
    }

    var geometry = new THREE.Geometry();

    geometry.vertices = vertices;
    geometry.uvs = uvs;

    geometry.uvsNeedUpdate =
    geometry.verticesNeedUpdate = true;

    //if( computeFaces != null && computeFaces == true )
    //{
        this.getFaces( geometry );
    //Caps.getFaces( geometry )
    //}

    THREE.Mesh.call( this, geometry, material );

};
Section.prototype = Object.create( THREE.Mesh.prototype );
Section.prototype.getFaces = function( geometry )
{
    var tesselation;
    var vertices = geometry.vertices;
    try
    {
        tesselation = POLYGON.tessellate( vertices, [[]] );
    }catch( e )
    {
            //console.log( "fail 1 ")
        try
        {
            vertices.reverse();
            tesselation = POLYGON.tessellate( vertices, [[]] );
        }
        catch(e)
        {
            //console.log( "fail 2 ")
            vertices.reverse();
            return;
        }
            vertices.reverse();
    }


    for( var i = 0; i < tesselation.length; i++ )
    {
        var f = tesselation[i];
        var i0 = f[0];
        var i1 = f[1];
        var i2 = f[2];

        geometry.faces.push( new THREE.Face3( i0, i1, i2 ) );
        if( geometry.uvs != null ) geometry.faceVertexUvs[ 0 ].push( [ geometry.uvs[ i0 ], geometry.uvs[ i1 ], geometry.uvs[ i2 ] ] );

        geometry.faces.push( new THREE.Face3( i1, i0, i2 ) );
        if( geometry.uvs != null ) geometry.faceVertexUvs[ 0 ].push( [ geometry.uvs[ i1 ], geometry.uvs[ i0 ], geometry.uvs[ i2 ] ] );

    }
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    return geometry;
};

/**
 * shorthand to create a regular polygon
 * @param	radius	the radius of the section
 * @param	sides	the number of sides
 * @param	material [ optional ] a material to assign to the section
 * @return a Section object
 */
Section.createRegularSection = function( radius, sides, material )
{

    radius = radius || 50;
    sides = Math.max( 3, sides || 12 );
    var points = [];
    for ( var i = 0; i < sides;  i++ )
    {
        var a = i * ( Math.PI * 2 ) / sides;
        points.push( new THREE.Vector2( Math.cos( a ) * radius, Math.sin( a ) * radius ) );
    }
    return new Section( points, material, false );

};


Section.offset = function( section, axis, amount )
{
    var i, p, t;
    for( i = 0; i < section.geometry.vertices.length; i++ )
    {
        p = section.geometry.vertices[ i ];
        p[ axis ] += amount;
    }
    section.geometry.verticesNeedUpdate = true;
    return section;
};
Section.switchAxis = function( section, a, b )
{
    var i, p, t;
    for( i = 0; i < section.vertices.length; i++ )
    {
        p = section.vertices[ i ];
        t = p[ b ];
        p[ b ] = p[ a ];
        p[ a ] = t;
    }
    for( i = 0; i < section.structure.length; i++ )
    {
        p = section.structure[ i ];
        t = p[ b ];
        p[ b ] = p[ a ];
        p[ a ] = t;
    }

    return section;
};
Section.flipAxis = function( section, axis )
{
    var i, p, t;
    for( i = 0; i < section.vertices.length; i++ )
    {
        p = section.vertices[ i ];
        p[ axis ] *= -1;
    }
    for( i = 0; i < section.structure.length; i++ )
    {
        p = section.structure[ i ];
        p[ axis ] *= -1;
    }
    return section;
};
