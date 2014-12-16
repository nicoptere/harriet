var Cockpit = function( element )
{

    var r0 = .2 + .15 * Math.random();
    var r1 = .35 + .1 * Math.random();

    var i, a, b, c, i0,i1,i2,i3, x,y;

    var geometry = new THREE.Geometry();

    var points = [];//2D array, laziness...
    var vertices = [];
    var uvs = [];

    var w = 16 - 1;
    var h = 16 - 1;
    var ax = 0;
    var ay = 0;
    for (var j = 1; j < h; j++)
    {
        var tmp = [];
        for ( i = 1; i < w; i++)
        {

            ax = ( i / w ) * Math.PI - Math.PI / 2;
            ay = ( j / h ) * Math.PI - Math.PI / 2;

            x = ( Math.tan(ax) );
            y = ( Math.tan(ay) );

            var p = new THREE.Vector3(-x/w * 2, -y/h * 4, 0);
            tmp.push(p);

            vertices.push(p);
            uvs.push( new THREE.Vector2( x,y ) );

        }
        points.push(tmp);
    }

    var div = 1 / Math.tan( Math.PI/2 * ( w-2 ) / w );
    uvs.forEach( function( v )
    {
        v.x = .5 + v.x * div;
        v.y = .5 + v.y * div;
    });

    geometry.vertices = vertices;
    geometry.uvs = uvs;

    for ( i = 0; i < points.length - 1; i++)
    {
        for ( j = 0; j < points[0].length - 1; j++)
        {

            i0 = vertices.indexOf( points[i][j] ); // < laziness in action.
            i1 = vertices.indexOf( points[i + 1][j] );
            i2 = vertices.indexOf( points[i][j + 1] );
            i3 = vertices.indexOf( points[i + 1][j + 1] );

            geometry.faces.push(new THREE.Face3(i0, i3, i1));
            geometry.faces.push(new THREE.Face3(i0, i2, i3));

        }
    }

    for( i = 0; i < geometry.vertices.length; i++ )
    {
        var v = geometry.vertices[ i ];
        if( Math.abs( v.x ) < r0 && Math.abs( v.y ) < r1 )
        {

            a = Math.atan2( v.y, v.x );
            v.x = Math.cos( a ) * r0;
            v.y = Math.sin( a ) * r1;
            v.inside = 1;

        }
    }

    for( i = 0; i < geometry.faces.length; i++ )
    {

        var f = geometry.faces[ i ];
        f.valid = true;
        i0 = f.a;
        i1 = f.b;
        i2 = f.c;

        a = geometry.vertices[ i0 ].inside;
        b = geometry.vertices[ i1 ].inside;
        c = geometry.vertices[ i2 ].inside;

        if( isNaN( a ) && isNaN( b ) && isNaN(c) )continue;

        var score = 0;
        if( a != null )score++;
        if( b != null )score++;
        if( c != null )score++;

        if( score < 3 )continue;

        //face center
        var fcx = ( geometry.vertices[ i0 ].x + geometry.vertices[ i1 ].x + geometry.vertices[ i2 ].x ) / 3;
        var fcy = ( geometry.vertices[ i0 ].y + geometry.vertices[ i1 ].y + geometry.vertices[ i2 ].y ) / 3;

        //mark face a sinvlaid if too close to the center
        if( Math.abs( fcx ) < r0 && Math.abs( fcy ) < r1 )
        {

            var fcp = new THREE.Vector3( fcx,fcy );

            a = Math.atan2( fcy, fcx );

            var cx = Math.cos( a ) * r0;
            var cy = Math.sin( a ) * r1;
            var cp = new THREE.Vector3( cx, cy );
            if( fcp.length() < cp.length()  )
            {
                f.valid = false;
            }
        }
    }

    var faces = [];
    geometry.faces.forEach( function( f )
    {
        if( f.valid )
        {
            faces.push( f );

            i0 = f.a;
            i1 = f.b;
            i2 = f.c;

            geometry.faceVertexUvs[0].push([uvs[i0], uvs[i3], uvs[i1]]);
            geometry.faceVertexUvs[0].push([uvs[i0], uvs[i2], uvs[i3]]);

        }
    });


    //bend
    var profile = [];
    var minx = 10e10;
    var minz = 10e10;
    for( i = 0; i < geometry.vertices.length; i++ )
    {

        v = geometry.vertices[ i ];

        a = map( v.y, -2, 2, 0, Math.PI * 2 );
        v.y = -Math.cos( a ) * .5 - .25;
        v.z = Math.sin( a ) * .5;

        minx = v.x < minx ? v.x : minx;
        minz = v.y < minz ? v.y : minz;
        if( i % w == 0 ) profile.push( new THREE.Vector3( v.z, v.y ) );

    }

    geometry.verticesNeedUpdate = true;
    geometry.uvsNeedUpdate = true;
    geometry.faces = faces;
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    if( element != null )
    {
        var lathe = new Lathe( new THREE.Vector3(0,1,0), profile, 16, Materials.SEM, Math.PI );
        lathe.rotation.y = Math.PI / 2;
        lathe.position.x = -minx;
        lathe.castShadow = true;
        element.add( lathe );

        var section = new Section( profile, Materials.RING );
        //section = new THREE.Mesh( section.geometry, Materials.SEM );
        section.rotation.y = Math.PI / 2;
        section.position.x = -.5;
        section.castShadow = true;
        element.add( section );


        var ground = new THREE.Mesh( Part.CUBE, Materials.SEM );
        ground.scale.set( minx * 2,.01,1 );
        ground.position.set( 0,minz,0 );
        ground.castShadow = true;
        element.add( ground );

        var m =  new THREE.Mesh( geometry, Materials.SEM );
        m.castShadow = true;
        element.add(m);
    }

    this.faces = geometry.faces;
    this.frame = geometry.vertices;

};
