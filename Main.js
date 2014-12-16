/**
 * Created by nico on 06/12/2014.
 * http://www.colourlovers.com/palette/48803/-The_Slide-

 //http://www.freesound.org/people/lucasgonze/sounds/168659/
 //http://www.freesound.org/people/Timbre/sounds/168733/
 */

var left = document.getElementById( "left" );
var right = document.getElementById( "right" );
var down = document.getElementById( "down" );



function webgl_detect(return_context)
{
    if (!!window.WebGLRenderingContext) {
        var canvas = document.createElement("canvas"),
            names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
            context = false;

        for(var i=0;i<4;i++) {
            try {
                context = canvas.getContext(names[i]);
                if (context && typeof context.getParameter == "function") {
                    // WebGL is enabled
                    if (return_context) {
                        // return WebGL object if the function's argument is present
                        return {name:names[i], gl:context};
                    }
                    // else, return just true
                    return true;
                }
            } catch(e) {}
        }

        // WebGL is supported, but disabled
        return false;
    }

    // WebGL not supported
    return false;
}

window.onload = function()
{
    window.hasGL = webgl_detect( false );
    init( window.hasGL  );
};

function init( hasGL )
{

    if( !hasGL )
    {
        var title = document.getElementById("title");

        title.innerHTML = title.innerHTML + "<br>HOP";

        TweenLite.to( title,.8,
            {
                delay:1,
                css:{ left: "-80%" },
                onComplete: function()
                {
                    var intro = document.getElementById( "intro" );
                    intro.innerHTML = '<iframe src="//player.vimeo.com/video/114498077?byline=0&amp;portrait=0" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
                },
                ease:Expo.easeOut

            } );

        new Hammer( title ).on( "tap", function()
        {
            window.open( "http://barradeau.com/blog/?p=428", "_blank" );
        });
        return;
    }


    Stage3d.init();
    //Stage3d.camera.position.z = 20;
    var seed = 1;// Date.now();
    var plane;// = new Plane3d( seed );
    var sun;
    var world;
    var ring;
    var cameraTime = 0;
    var planeTime = 0;
    var MODES = {};
    MODES.intro = 0;
    MODES.workshop = 1;
    MODES.travel = 2;
    var mode = MODES.intro;
    var introTimeOut;

    introTimeOut = setTimeout( initApp, 10000 );

    function update()
    {

        requestAnimationFrame(update);
        ring.position.y = world.container.position.y;
        switch( mode )
        {
            case MODES.intro:
                Materials.GLOBE.uniforms.bumpAmount.value = .025;
                if( world != null ) world.globe.rotation.y -= RAD * .1;
                //Materials.PORTRAIT.uniforms.time.value = .5 + (.5 * ( Math.sin( Date.now() * 0.001 ) ) );
                break;

            case MODES.workshop:

                Stage3d.locked = false;
                world.globe.rotation.y = -Math.PI / 2;
                plane.update();

                break;

            case MODES.travel:
                world.globe.rotation.y = -Math.PI / 2;
                cameraTime += 0.00010;
                cameraTime %= 1;

                planeTime =  cameraTime + 0.035;
                planeTime %= 1;


                //var s = world.worldScale;
                //world.container.scale.set( s, s, s );

                Stage3d.locked = true;

                if( plane != null )
                {
                    locatePlane( world.curve, planeTime, plane );
                    plane.update();
                }

                var cam = Stage3d.camera.position;
                var pla = plane.position;
                var dst = cam.clone().sub( pla ).normalize().multiplyScalar( 20 ).add( pla );

                var l = dst.length() * 1.003;
                dst.normalize().multiplyScalar( l );
                cam.x += ( dst.x - cam.x ) * .2;
                cam.y += ( dst.y - cam.y ) * .2;
                cam.z += ( dst.z - cam.z ) * .2;
                locateCamera( cam, dst, Stage3d.camera );


                break;

        }
        Stage3d.render();

    }
    function locatePlane( curve, t, object )
    {

        var cp = curve.getPointAt( t );
        var np = curve.getPointAt( ( t +.01 ) % 1 );
        var nrm = cp.clone().normalize();
        var dir = np.clone().normalize().sub( nrm ).normalize();
        object.position.copy( cp.multiplyScalar( .95 + Math.sin(Date.now() * 0.001 ) *.02 ) );
        object.matrix.lookAt( cp, dir.add( cp ), nrm );
        object.rotation.setFromRotationMatrix( object.matrix, object.rotation.order );
        object.rotateX( Math.cos(Date.now() * 0.001 ) *.005);
        object.rotateY( -Math.PI  / 2 + Math.cos(Date.now() * 0.001 ) *.015);//+ planeOffset.x * RAD *.1);

    }
    function locateCamera( cp, np, object )
    {

        var nrm = cp.clone().normalize();
        var dir = np.clone().normalize().sub( nrm ).normalize();
        object.position.copy( cp );
        object.matrix.lookAt( cp, dir.add( cp ), nrm );
        object.rotation.setFromRotationMatrix( object.matrix, object.rotation.order );
        object.rotateX( -15*RAD);

    }
    function onShadersLoaded()
    {

        //console.log( "assets loaded")
        new Materials();

        var seed = parseInt( getHashVariable("model") ) || Date.now();
        if( isNaN( seed ) )seed = Date.now();

        var count = random( 2, 5 );
        var cableRatio = random( 3, 6);
        var thickness =  random( 1, 2) * 0.01;

        plane = new Plane3d( seed );
        plane.reset(count, cableRatio, thickness);
        plane.update();


        plane.visible = false;
        //world.visible = false;

        ring = new Ring();
        world = ring.content;
        //world = new World( Stage3d.scene );
        //world.init();

        requestAnimationFrame(update);

        var title = document.getElementById("title")
        TweenLite.to( title,.8, { delay:.5, css:{ bottom: "80%" }, ease:Expo.easeInOut } );

        new Hammer( title).on( "tap", function()
        {
            window.open( "http://barradeau.com/blog/?p=428", "_blank" );
            Sound.mute();
        });


        TweenLite.to( Stage3d.camera.position, 1, { z:15, ease:Expo.easeInOut } );

        TweenLite.to( document.getElementById("intro"),.25, {opacity:0, onComplete:function()
        {
            document.body.removeChild( document.getElementById("intro") );

        }});

        requestAnimationFrame(update);


    }

    var hammertime = new Hammer( Stage3d.domElement );
    function initApp(ev)
    {

        clearTimeout( introTimeOut );
        hammertime.off('doubletap', initApp );
        hammertime.on( 'swipe',     resetPlane );

        var d = 1.5;
        var s = 2.5;

        TweenLite.to( Stage3d.camera.position, 2, { x:-15, y:5, z:20, ease:Expo.easeInOut } );

        s = 0.1;
        //TweenLite.to( ring.scale, d, { x:s, y:s, z:s, ease:Expo.easeOut });
        TweenLite.to( ring.rotation, d, { x:-Math.PI/2, ease:Expo.easeOut });

        s = 2.5;
        TweenLite.to( world.container.scale, d *.5, { x:s, y:s, z:s, ease:Expo.easeOut, onComplete:initPlane } );

        TweenLite.to( world.container.position, 2, { delay:d *.5, y:-5, ease:Expo.easeOut });

        //TweenLite.to( ring.position, d, { delay y:-5, ease:Expo.easeOut });
        //TweenLite.to( world.container.position, d*.5, { y:-5 } );

    }
    function initPlane()
    {
        var d = 1;
        //ring.visible = false;


        TweenLite.to( right, d, { opacity:1, ease:Expo.easeOut } );
        TweenLite.to( left, d, { opacity:1, ease:Expo.easeOut } );
        TweenLite.to( down, d, { opacity:1, ease:Expo.easeOut } );

        new Hammer( left ).on( "tap", resetPlane );
        new Hammer( right ).on( "tap", resetPlane );
        new Hammer( down ).on( "tap", switchMode );

        mode = MODES.workshop;

        plane.visible = true;
        plane.position.y = 100;
        plane.update();
        TweenLite.to( plane.position, d, { y:0, ease:Expo.easeOut } );
        TweenLite.to( Materials.GLOBE.uniforms.bumpAmount, 1, { value:.05, ease:Expo.easeInOut, onComplete:function()
        {
            world.init();


        }} );
    }

    function switchMode()
    {
        if( mode == MODES.workshop )
        {
            initTravel();
        }
        else
        {
            initWorkshop();
        }
    }

    function initWorkshop()
    {
        //var s = 1;
        //TweenLite.to( ring.scale, d, { x:s, y:s, z:s, ease:Expo.easeOut });

        mode = MODES.workshop;
        TweenLite.to( Stage3d.camera.position, 2, { x:-15, y:5, z:20, ease:Expo.easeInOut } );

        plane.visible = true;

        plane.position.x = 0;
        plane.position.y = 100;
        plane.position.z = 0;

        plane.rotation.set( 0,0,0 );

        plane.update();
        TweenLite.to( plane.position, d, { y:0, ease:Expo.easeOut } );

        Stage3d.locked = false;
        s = 2.5;
        TweenLite.to( world.container.scale, 0, { x:s, y:s, z:s, ease:Expo.easeOut } );

        TweenLite.to( world.container.position, 2, { delay:d *.5, y:-5, ease:Expo.easeOut });
        TweenLite.to( Materials.GLOBE.uniforms.bumpAmount, 1, { value:.005, ease:Expo.easeInOut } );

        TweenLite.to( right, d, { opacity:1, ease:Expo.easeOut } );
        TweenLite.to( left, d, { opacity:1, ease:Expo.easeOut } );

    };

    function initTravel()
    {
        //var s = .0001;
        //TweenLite.to( ring.scale, d, { x:s, y:s, z:s, ease:Expo.easeOut });
        TweenLite.to( Materials.GLOBE.uniforms.bumpAmount, 1, { value:.05, ease:Expo.easeInOut } );
        cameraTime = 0;
        planeTime =  cameraTime + 0.035;

        mode = MODES.travel;
        TweenLite.to( right, d, {  opacity:0, ease:Expo.easeOut } );
        TweenLite.to( left, d, {  opacity:0, ease:Expo.easeOut } );

        Stage3d.locked = true;

        locatePlane( world.curve, planeTime, plane );
        plane.update();

        var s = world.worldScale;
        TweenLite.to( world.container.scale, 4, {x:s,y:s,z:s});

    }


    function resetPlane(ev)
    {
        if( mode != MODES.workshop )return;

        console.log("resetPlane", ev );
        if( plane == null )return;
        //            var seed = Date.now();
        plane.seed++;// = seed;
        PRNG.initialize_generator(plane.seed);

        var count = random( 2, 5 );
        var cableRatio = random( 3, 6 );
        var thickness =  random( 1, 2)*0.01;
        plane.reset(count, cableRatio, thickness );


    }

    hammertime.on('doubletap', initApp );


    window.onresize = function()
    {
        Stage3d.resize();
    };



    Stage3d.camera.position.set( 0, 0, 25 )
    Stage3d.renderer.shadowMapType = THREE.PCFSoftShadowMap;
    Stage3d.renderer.shadowMapEnabled = true;
    Stage3d.renderer.shadowMapSoft = true;

    var light;
    light = new THREE.DirectionalLight(0xdfebff, 1.2 );
    light.position.set( 3, 4,-2.5);
    light.position.multiplyScalar(103.3);

    light.castShadow = true;
    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;

    var d = 4;

    light.shadowCameraLeft = -d;
    light.shadowCameraRight = d;
    light.shadowCameraTop = d;
    light.shadowCameraBottom = -d;

    light.shadowCameraFar = 10000;
    light.shadowDarkness = 0.2;

    Stage3d.scene.add( light );

    var sl = new ShaderLoader();
    sl.loadShaders( "./assets/glsl/", onShadersLoaded );


};

