var Sound = function()
{

    Sound.instance = this;
    Sound.playin = false;
    Sound.soundtrack = new Howl({
        urls: [ 'assets/snd/soundtrack.mp3', 'assets/snd/soundtrack.ogg' ],
        //autoplay: true,
        loop: true,
        volume: 0.5,
        onend: function()
        {

        },
        onload : function(  )
        {
            //console.log( "sound load", this );
            var button = document.getElementById( "sound" );
            TweenLite.to( button, 1, { opacity: 1 } );

            new Hammer( button).on( "tap",

                function( e )
                {
                    if( Sound.playing )
                    {
                        Sound.soundtrack.fadeOut( 0, 1000 );
                    }
                    else
                    {
                        Sound.soundtrack.fadeIn( 0.5, 2000);
                    }
                    Sound.playing = !Sound.playing;
                }

            )
            this.fadeIn(.5, 2000);
            Sound.playing = true;
        }
    });

};

Sound.mute = function()
{
    Sound.soundtrack.fadeOut(0, 500);
};