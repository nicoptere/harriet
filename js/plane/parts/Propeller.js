var Propeller = function( element, radius )
{

    var group = new THREE.Object3D();


    var profile = [

        new THREE.Vector3( 0,0,0 ),
        new THREE.Vector3(-.5,.5 * radius,0 ),
        new THREE.Vector3(-.25, radius * 1.5,0 ),
        new THREE.Vector3( .35, radius,0 ),
        new THREE.Vector3( .25,.5 * radius,0 ),
        new THREE.Vector3( .15,0,0 ),
        new THREE.Vector3( 0,0,0 )


    ];

    var w = PRNG.random() * .1 + .1;
    var min = 10e10;
    profile.forEach( function(v)
    {
        v.x *= w;
        //v.x += PRNG.random() * .05;
        //v.y += PRNG.random() * .25;
        min = min > v.x ? v.x : min;
    });

    var points = CatmullRom.compute( profile,.2  );
    points.forEach( function( v )
    {
        //v.x += min * .5
    });

    var prop = new Extrude( new THREE.Vector3(0,0,1), points, .05, 2, Materials.WOOD );
    try
    {
        Caps.getFaces( prop.geometry, 0, points.length );
    }catch( e )
    {
        return;
    }

    var count = random( 2,6 );
    var step = Math.PI * 2 / count;
    for( var i =0; i< count; i++ )
    {
        var m = prop.clone();
        m.rotation.z = i * step;
        m.castShadow = true;
        group.add( m );
    }
    group.rotation.y = Math.PI / 2;



    var g_cyl = new THREE.CylinderGeometry( radius *.3, radius *.3,.05, 16 )
    var cyl = new THREE.Mesh( g_cyl, Materials.WOOD );
    cyl.rotation.x = Math.PI / 2;
    group.add( cyl );
    g_cyl = new THREE.CylinderGeometry( radius *.1, radius *.1,.65, 16 )
    cyl = new THREE.Mesh( g_cyl, Materials.SEM );
    cyl.rotation.x = Math.PI / 2;
    cyl.position.z = .25;
    group.add( cyl )

    element.add( group );
    element.propeller = group;

};
