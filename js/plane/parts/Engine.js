var Engine = function( element )
{


    var radius0 = .1 + PRNG.random() * .1;
    var radius1 = radius0 + PRNG.random() * .25;
    var radius = radius0 + radius1;

    var d0 = .5;
    var d1 = PRNG.random() * .5;
    var depth = d0 + d1;

    var points = [];
    points.push(
                    new THREE.Vector2( 0,       0 ),
                    new THREE.Vector2( 0,       radius0 ),
                    new THREE.Vector2( d0,      radius1 ),
                    new THREE.Vector2( depth,   radius1 ),
                    new THREE.Vector2( depth,   radius0 ),
                    new THREE.Vector2( d0,      radius0 ),
                    new THREE.Vector2( d0,      0 )
    );

    var revolutionsegments = 32;
    var section = new Section( CatmullRom.compute( points, .1, false ) );

    var lathe = new Lathe( new THREE.Vector3( 1,0,0 ), section , revolutionsegments, Materials.RING );
    lathe.castShadow = true;
    lathe.position.x = depth * .5;
    lathe.rotation.y = Math.PI;
    element.add( lathe );


    var circle_section  = Section.createRegularSection( radius * .1 , 3  );
    Section.offset( circle_section, 'x', depth );
    Section.offset( circle_section, 'y', radius1 );
    var circle = new Lathe( new THREE.Vector3( -1,0,0 ), circle_section, revolutionsegments, Materials.SEM  );
    lathe.add( circle );


    var m = new THREE.Mesh( Part.CUBE, Materials.SEM );
    m.scale.set(.5,.01, 1 );
    m.position.x +=.225;
    m.castShadow = true;
    element.add( m );

    //var nose_section  = Section.createRegularSection( radius0, 3  );
    //Section.offset( nose_section, 'x', depth + .1);
    //
    //var nose = new Lathe( new THREE.Vector3( 1,0,0 ), CatmullRom.compute( nose_section.geometry.vertices,.1 ), revolutionsegments, Materials.SEM  );
    //lathe.add( nose );

    var propeller = new Propeller( element, radius  );
    element.propeller.position.x = -depth * .65;

};
