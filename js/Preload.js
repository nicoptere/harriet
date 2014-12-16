
// render
var img;
var scale = 1;
var out = document.createElement( "canvas" );
document.body.appendChild( out );
var context = out.getContext( "2d" );


var tex;

var Preload = function( )
{

    var can = document.createElement( "canvas" );
    //document.body.appendChild( can );
    var ctx = can.getContext( "2d" );


    Stage3d.init();
    new Skybox();
    tex = new THREE.Texture( out );
    var ma =new THREE.MeshPhongMaterial(
        {
            color:0xFFFFFF,
            ambient:0,
            //color      :  new THREE.Color("rgb(155,196,30)"),
            //emissive   :  new THREE.Color("rgb(7,3,5)"),
            specular   :  new THREE.Color("rgb(0,90,192)"),
            shininess  :    50,
            normalScale : new THREE.Vector2( 1,1 ),
            normalMap    :  tex,
            //map        :  tex,
            //bumpMap    :  tex,
            //bumpScale  :  .45,
            transparent: true,
            side : THREE.DoubleSide,
            envMap:Skybox.material
        }
    );
    var me = new THREE.Mesh( new THREE.PlaneGeometry( 1,1,1,1), ma );

    Stage3d.add( me );

    /* Lightening */
    var light = new THREE.PointLight( new THREE.Color("rgb(255,255,255)"), 1 );
    light.position.set( 25, 50, 5000 );
    Stage3d.add( light );

    var light = new THREE.PointLight( new THREE.Color("rgb(255,255,255)"), 1  );
    light.position.set( 150, 0, 2000 );
    Stage3d.add( light );

    function update()
    {
        light.position.copy( Stage3d.camera.position );
        light.position.y += 10;

        Stage3d.render();
    }
    setInterval( update, 30 );

    img = new Image();
    img.onload = function( e )
    {
        var w = e.target.width;
        var h = e.target.height;
        can.width  = w;
        can.height = h;
        ctx.drawImage(e.target, 0, 0 );

        me.scale.set( w, h ,1 );
        out.width  = w * scale;
        out.height = h * scale;
        context.scale( scale, scale );
        context.drawImage(e.target, 0, 0,w * scale,h * scale );

        //tex.needsUpdate = true;
        //threshold = 0,1,2,3
        //var threshold = 2;
        //tex = new THREE.Texture( out )
        //ma.normalMap = ma.bumpMap =tex;
        //ma.normalMap = ma.bumpMap =tex;
        setTimeout( MAT, 1, ctx, 0, w, h, invert, onMATComplete );
        //setTimeout( MAT, 1, ctx, 2, w, h, normal, onMATComplete );
        //centralDIfference( ctx, tex );

    }
    img.src = "img/bw_harriet.png";
    //img.src = "img/harriet_bw.jpg";


};

//context.fillStyle  ="#000";
//context.fillRect( 0,0,context.canvas.width,context.canvas.height );

function centralDIfference( ctx, tex )
{

    var w = ctx.canvas.width;
    var h = ctx.canvas.height;

    var imgData = ctx.getImageData( 0,0, w,h );
    var data = imgData.data;

    var outImgData = ctx.getImageData( 0,0, w,h );
    var outData = outImgData.data;

    var i, l, r, t, b, _r, _g;
    for( i =0; i< data.length; i+= 4)
    {

        l = Math.abs( data[i - 1] ) / 0xFF;
        r = Math.abs( data[i + 1] ) / 0xFF;

        t = Math.abs( data[i - w * 4 ] ) / 0xFF;
        b = Math.abs( data[i + w * 4 ] ) / 0xFF;

        _r = parseInt( 0x80 + ( l-r ) * 0x80 );
        _g = parseInt( 0x80 + ( t-b ) * 0x80 );

        outData[ i ]    = _r;
        outData[ i+1 ]  = _g;
        outData[ i+2 ]  = 0x80;
        outData[ i+3 ]  = 0xFF;

    }

    ctx.putImageData( outImgData, 0,0 );

    tex.needsUpdate = true;
}


function normal( value )
{
    return  value;
}
function invert( value )
{
    return  255 - value;
}
function MAT( context, threshold,  width, height, metric, callback )
{

    threshold = threshold || 2;

    //collect the binary values
    var imgData = context.getImageData( 0,0,width,height );
    var iData = imgData.data;

    //creates an INT buffer ( allows to store negative values )
    var data = new Int16Array( width * height );
    for( var i = 0; i < width * height; i++ )
    {
        // iData[ i * 4 ] = 0 (black) or anything else (white)
        data[ i ] = metric( iData[ i * 4 ] );
    }

    //decimate the outer pixels
    function iterate( data, iteration )
    {

        var count = 0;
        var remove = [];
        for( i = 0; i< width * height; i++ )
        {

            if( data[ i ] <= 0 )continue;

            count = 0;
            count += ( data[ i - width - 1  ] <= 0 ) ? 1 : 0;
            if( count > threshold )remove.push( i );

            count += ( data[ i - width      ] <= 0 ) ? 1 : 0;
            if( count > threshold )remove.push( i );

            count += ( data[ i - width + 1  ] <= 0 ) ? 1 : 0;
            if( count > threshold )remove.push( i );

            count += ( data[ i - 1      ] <= 0 ) ? 1 : 0;
            if( count > threshold )remove.push( i );

            count += ( data[ i + 1      ] <= 0 ) ? 1 : 0;
            if( count > threshold )remove.push( i );

            count += ( data[ i + width - 1  ] <= 0 ) ? 1 : 0;
            if( count > threshold )remove.push( i );

            count += ( data[ i + width      ] <= 0 ) ? 1 : 0;
            if( count > threshold )remove.push( i );

            count += ( data[ i + width + 1  ] <= 0 ) ? 1 : 0;
            if( count > threshold )remove.push( i );

        }

        //stores the current iteration
        remove.forEach( function( i )
        {
            data[ i ] = -iteration ;
        });

        if( remove.length > 0 && iteration < 128 )
        {
            //console.log( "iteration" );
            iteration++;
            iterate( data, iteration )
            //setTimeout( iterate, 0, data, iteration )
        }
        else
        {
            console.log( "MAT complete", iteration );
            if( callback != null )callback( width, metric, data, iteration );
        }

    }
    iterate( data, 1 );

}


function onMATComplete( width, metric, data, iteration )
{
    //context.clearRect( 0,0,width, width);

    var i, value, l, r, t, b, _r, _g;
    for( i = 0; i < data.length; i++ )
    {
        if( data[i] == 0  ) continue;

        value = parseInt( ( Math.abs( metric( data[i] ) ) / iteration ) * 0xFF );

        l = Math.abs( data[i - 1] ) / iteration;
        r = Math.abs( data[i + 1] ) / iteration;

        t = Math.abs( data[i - width] ) / iteration;
        b = Math.abs( data[i + width] ) / iteration;


        _r = parseInt( 0x80 + ( l-r ) * 0x80 );
        _g = parseInt( 0x80 + ( t-b ) * 0x80 );


        //context.fillStyle = "rgba( " + value +"," + value +"," + value +", 1 )";
        context.fillStyle = "rgba( " + _r +"," + _g +"," + 0x80 +", 1 )";//+ ( data[i] > 0 ? "1" : "0" ) +" )";

        context.fillRect( ( i % width ), parseInt( i / width ), 1,1 );

    }
    tex.needsUpdate = true;

    //me.geometry.verticesNeedUpdate = true;
    //context.globalAlpha = .25;
    //context.globalCompositeOperation = "destination-atop";
    //context.drawImage( img, 0, 0,width,width );
    //context.globalAlpha = 1;
    //context.globalCompositeOperation = "source-over";
}
