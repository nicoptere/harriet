var Wing = function( element, plane )
{


    var profile = [];

    var thickness = Math.random()* .05;
    var center = new THREE.Vector3( -.4 + PRNG.random() *.8, ( PRNG.random() -.5 ) * .2 );
    profile.push(
                    new THREE.Vector3(-.5,0 ),
                    new THREE.Vector3( center.x, center.y -thickness ),
                    new THREE.Vector3( .5,0 ),
                    new THREE.Vector3( center.x, center.y +thickness )
    );

    profile.reverse();
    profile = CatmullRom.compute( profile, .1, true );

    var section = Section.createRegularSection( .005,3 );

    var group = new THREE.Object3D();

    //PRNG.initialize_generator(Math.random() * 0xFFFFFF );

    var length = random( 1,3 ) * 2 + 1;
    var verticalCount = random( 1,3 );
    var verticalOffset = Math.max( 0, random( 0, -verticalCount ) );
    var verticalSpacing = .75 + PRNG.random() * .5;

    var structure = new Loft( profile, section, Materials.SEM );
    var skin = new Extrude( new THREE.Vector3( 0,0,1 ), profile, length, 1, Materials.WING );

    var m, i;
    for( var j = verticalOffset; j < verticalCount + verticalOffset; j++ )
    {

        if( j == 0 )
        {

            for( i = 0; i <= length; i++ )
            {

                m = new THREE.Mesh( structure.geometry, Materials.SEM );
                m.position.y = j * verticalSpacing;
                m.position.z = -length / 2 + i;
                m.castShadow = true;
                group.add(m);

            }

            m = new THREE.Mesh( skin.geometry, Materials.WING );
            m.position.y = j * verticalSpacing;
            m.position.z = -length/2;
            m.castShadow = true;
            m.scale.set( 1,1, ( length - 1 ) / length / 2  );
            group.add( m );


            m = new THREE.Mesh( skin.geometry, Materials.WING );
            m.position.y = j * verticalSpacing;
            m.position.z = .5;
            m.castShadow = true;
            m.scale.set( 1,1, ( length - 1 ) / length / 2  );
            group.add( m );

        }
        else
        {

            for( i = 0; i <= length; i++ )
            {

                m = new THREE.Mesh( structure.geometry, Materials.SEM );
                m.position.y = j * verticalSpacing;
                m.position.z = -length / 2 + i;
                m.castShadow = true;
                group.add(m);

            }

            m = new THREE.Mesh( skin.geometry, Materials.WING );
            m.position.y = j * verticalSpacing;
            m.position.z = -length/2;
            m.castShadow = true;
            group.add( m );

        }

    }
    //poles
    if( verticalCount < 2 ) return;
    var poleSize = 0.01;
    var rotationOffset = 0.01;
    for( i = 1; i <= length - 1; i++ )
    {

        m = new THREE.Mesh( Part.CUBE, Materials.SEM );
        m.position.x = 0.49;
        m.position.y = ( ( verticalCount - 1 ) / 2 + verticalOffset ) * verticalSpacing;
        m.position.z = -length / 2 + i;
        m.scale.set( poleSize, ( verticalCount - 1 ) * verticalSpacing, poleSize );
        m.rotation.set( PRNG.random() * rotationOffset, PRNG.random() * rotationOffset, PRNG.random() * rotationOffset );
        group.add( m );

        m = new THREE.Mesh( Part.CUBE, Materials.SEM );
        m.position.x = -0.49;
        m.position.y = ( ( verticalCount - 1 ) / 2 + verticalOffset ) * verticalSpacing;
        m.position.z = -length / 2 + i;
        m.scale.set( poleSize, ( verticalCount - 1 ) * verticalSpacing,poleSize );
        m.rotation.set( PRNG.random() * rotationOffset, PRNG.random() * rotationOffset, PRNG.random() * rotationOffset );
        group.add( m );

    }

    if( element.type == T.ENGINE )
    {
        group.position.x += .25;
    }

    element.add( group );
};