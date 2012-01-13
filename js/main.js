var gameData = {
	locales : [
		{
			 id:"home"
			 name:"Home"
			,description:"Ah... Home, where most days are spent. All my stuff is here, anyway."
		}
		,{
			 id:"front_yard"
			,name:"Front Yard"
			,description:"The front yard is nice. There's a little patch of grass at the top of the hill that's always yellow from where someone once spilled fertilizer."
		}
		,{
			 id:"back_yard"
			,name:"Back Yard"
			,description:"The back yard isn't that interesting. There's a door to access the basement, though."
		}
		,{
			 id:"gas_station"
			,name:"Gas Station"
			,description:"Sometimes we ride bikes down here to pick up sodas, and whatnot."
		}
		,{
			 id:"creek"
			,name:"Creek"
			,description:"A pretty wimpy creek. Sometimes it stinks like there's sewage in it. There aren't any fish in it, but we like to pretend there are."
		}
		,{
			 id:"tree_house"
			,name:"Tree House"
			,description:"Michael's tree house. His dad built it a long time ago. Really, it's the secret entrance to the bomb shelter."
		}
		,{
			 id:"dirt_hill"
			,name:"Dirt Hill"
			,description:"The dirt hill is the starting place for almost every bike race. We have to set standards after all."
		}
	]
};


window.onload = function(){
	c = document.getElementById("main");

	navigator.geolocation.getCurrentPosition( successCallback, errorCallback, {maximumAge:600000, timeout:0} );

	function successCallback(position) {
      // By using the 'maximumAge' option above, the position
      // object is guaranteed to be at most 10 minutes old.
      // By using a 'timeout' of 0 milliseconds, if there is
      // no suitable cached position available, the user agent 
      // will aynchronously invoke the error callback with code
      // TIMEOUT and will not initiate a new position
      // acquisition process.
      console.log(position.coords);
    }

    function errorCallback(error) {
      switch(error.code) {
        case error.TIMEOUT:
          // Quick fallback when no suitable cached position exists.
//          doFallback();
          // Acquire a new position object.
          navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
          break;
		default: // treat the other error cases.
			console.log("oops");
      };
    }

	m = document.getElementById("messages");
//	m.write();
};


