var GeometryLoader = function( urls, scope, onMeshLoaded, onLoadComplete )
{
    if( urls == null )return;

    GeometryLoader.urls = urls;
    GeometryLoader.scope = scope;
    GeometryLoader.onMeshLoaded = onMeshLoaded;
    GeometryLoader.onLoadCompleteCallback = onLoadComplete;
    GeometryLoader.loadNext();


};

GeometryLoader.geoms = [];

GeometryLoader.loadNext = function() {
    GeometryLoader.loader = GeometryLoader.loader || new THREE.JSONLoader();
    GeometryLoader.loader.load(GeometryLoader.urls[0].url, function (geometry) {

        var current = GeometryLoader.urls[0];

        if (GeometryLoader.scope != null) {
            GeometryLoader.scope[GeometryLoader.onMeshLoaded](current, geometry);
        }

        GeometryLoader.geoms.push({
            id: current.id || "mesh_" + Date.now().toString(),
            type: current.type || T.EMPTY,
            geom: geometry
        });
        GeometryLoader.urls.shift();

        if (GeometryLoader.urls.length > 0) {
            GeometryLoader.loadNext();
        }
        else {
            if (GeometryLoader.scope != null) {
                GeometryLoader.scope[GeometryLoader.onLoadCompleteCallback]();
            }
        }

    });
}

GeometryLoader.getGeometriesByType = function( type )
{
    var tmp = [];
    GeometryLoader.geoms.forEach( function( g )
    {
        if(g.type == type ) tmp.push( g );
    });
    return tmp;
};

GeometryLoader.getGeometryById = function( array, id )
{
    var tmp = [];
    array.forEach( function( g )
    {
        if( g.id.lastIndexOf( id ) != -1 ) tmp.push( g );
    });
    return tmp[ parseInt( Math.random() * tmp.length )].geom;
};


GeometryLoader.getElement = function( element )
{
    var m, g, i, tmp = GeometryLoader.getGeometriesByType( element.type );

    switch( element.type )
    {
        case T.ENGINE:

            new Engine( element );

            break;

        case T.WHEEL:

            /*
            g = GeometryLoader.getGeometryById( tmp, "wheel" );
            m = new THREE.Mesh( g, Part.MAT );
            m.scale.set( 0.01, 0.01, 0.01 );
            m.castShadow = true;
            element.add( m );
            //*/
            break;

        case T.BLOCK:

            m = new THREE.Mesh( Part.CUBE, Part.MAT );
            m.position.set( -.25,0,0 );
            m.scale.set(.5,.01,1 );
            m.castShadow = true;

            var a_front = new Aileron();
            a_front.rotation.x =  Math.PI / 2;
            a_front.position.x =  -.5;
            a_front.position.z =  .5;
            element.add( a_front );

            var a_back = a_front.clone();
            a_back.rotation.x = -Math.PI / 2;
            a_back.position.x = -.5;
            a_back.position.z = -.5;
            element.add( a_back );

            a_front.scale.set( 1, 2, 1 );
            a_back.scale.set(  1, 2, 1 );



            element.add( m );
            break;

        case T.DIRECTION:

            new Direction( element );

            break;

        case T.COCKPIT:

            new Cockpit( element );

            //m = new THREE.Mesh( Part.CUBE, Part.MAT );
            //m.castShadow = true;
            //element.add( m );


            break;
    }
    return m;


};