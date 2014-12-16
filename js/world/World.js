
var World = function( parent )
{

    this.container = new THREE.Object3D();
    parent.add( this.container );

    World.GlobeGeometry = new THREE.SphereGeometry( 1, 128,64 );

    this.globe = new THREE.Mesh( World.GlobeGeometry, Materials.GLOBE  );
    //this.globe.rotation.y = -Math.PI / 2;
    this.container.add( this.globe );

    var worldScale = this.worldScale = 100;

    this.container.scale.multiplyScalar( worldScale );

    //this.globe = new THREE.Mesh( new THREE.IcosahedronGeometry( 1, 3 ), this.getMaterial()  );

    World.globe = this.globe;

    this.monuments =
    {

        united_kingdom: {
            type: T.MONUMENT,
            scale: 1,
            id: "Stonehenge",
            latlng: [51.179010, -1.826227],
            url: "assets/monuments/stonehenge.js"
        },
        italia: {
            type: T.MONUMENT,
            scale:.35,
            name: "Colosseo",
            latlng: [41.890434, 12.492167],
            url: "assets/monuments/colosseum.js"
        },
        egypt: {
            type: T.MONUMENT,
            id: "Giza Sphinx",
            scale: 1.5,
            latlng: [29.975255, 31.137304],
            url: "assets/monuments/sphinx.js"
        },
        india: {
            type: T.MONUMENT,
            scale:.75,
            id: "Taj Mahal",
            latlng: [27.175130, 78.042134],
            url: "assets/monuments/taj_mahal.js"
        },
        australia: {
            type: T.MONUMENT,
            scale:.4,
            id: "Sydney Opera House",
            latlng: [-33.856684, 151.215292],
            url: "assets/monuments/sydney_opera_house.js"
        },
        mexico: {
            type: T.MONUMENT,
            scale: .85,
            id: "Chichen Itza",
            latlng: [20.684576, -88.567762],
            url: "assets/monuments/chichen_itza.js"
        },
        usa: {
            type: T.MONUMENT,
            scale:.75,
            id: "statue of liberty",
            latlng: [40.689461, -74.044511],
            url: "assets/monuments/statue_of_liberty.js"
        }
    };

    var path = [], pos;

    for( key in this.monuments )
    {
        var current = this.monuments[ key ];
        pos = MathUtils.lonLatToVector3( current.latlng[1] * RAD, current.latlng[0] * RAD);
        path.push( pos.clone() );

    }

    for( var i = 0; i < Math.PI * 2 - ( 20*RAD ); i+=( RAD * 20 ) )
    {
        var x = i;
        var y = Math.random() * Math.PI / 4 - Math.PI / 8;
        pos = MathUtils.lonLatToVector3( x, y );
        path.push( pos.clone() );
    }

    var ups = [];
    path = CatmullRom.compute( path, .01, true );
    path.forEach( function( v)
    {

        v.normalize( ).multiplyScalar( worldScale * 1.115 );

    });


    //var g = new THREE.Geometry();
    //g.vertices = path;
    //g.verticesNeedUpdate = true;
    //var line = new THREE.Line( g);
    //line.scale.set(.1,.1,.1)
    //Stage3d.add( line );
    //this.path = path;
    //this.ups = ups;

    var curve = new THREE.SplineCurve3(path);
    this.curve = curve;


};
World.prototype =
{
    set visible (value )
    {
        this.container.visible = value;
    },
    get visible()
    {
        return this.container.visible;
    },

    init : function()
    {

        var scope = this;
        var urls = [];
        for( var key in this.monuments )
        {

            urls.push( this.monuments[ key ] );
        }

        var loader = new GeometryLoader( urls, scope, "onMeshLoaded", "onLoadComplete" );

    },
    onMeshLoaded : function( current, geometry )
    {
        geometry.computeFaceNormals();
        //geometry.computeVertexNormals();

        var m = new THREE.Mesh( geometry, Materials.MONUMENT );
        var s = 0.000035 * current.scale;
        m.scale.multiplyScalar( 0.000000001 );
        m.rotation.x = -Math.PI / 2;

        TweenLite.to(m.scale, 1, { x:s, y:s, z:s }  );

        var obj = new THREE.Object3D();
        obj.add( m );

        var pos = MathUtils.lonLatToVector3( current.latlng[1] * RAD, current.latlng[0] * RAD).multiplyScalar( 1.0035 );
        obj.position.copy( pos );
        obj.lookAt( ZERO );
        this.container.add( obj );

    },

    onLoadComplete : function()
    {
        new Sound();

    }

};
