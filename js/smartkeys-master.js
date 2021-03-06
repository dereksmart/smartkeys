(function($, command, action) {
    var k = []; // The pressed key

    /*
    Accepted Commands
     */
    var adminPages   = smartkeysMasterVars.adminPages;
    var currentCombo = smartkeysMasterVars.currentCombo;
    var adminUrl     = smartkeysMasterVars.adminUrl;

    // Init
    $(document).ready(function () {
        trackKeys();
        searchInit();
    });

    // Little function to check if a string ends with something
    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    /*
    Convert the key pressed into a letter!
     */
    function convertToCharacter(e) {
        return String.fromCharCode(e.which);
    }

    /*
    Track which keys are pressed
     */
    function trackKeys() {
        onkeydown = function(e){
            e = e || event; // deal with IE
            k[ e.keyCode ] = e.type == 'keydown';

            // J is the magic key, press thrice to unlock smartness
            if ( e.shiftKey ) {
                currentCombo += 'larry';
				//smartkeysMasterVars.currentCombo += 'go';
            } else {
				currentCombo = '';
            }
            // Larry has been summoned
            if ( currentCombo === 'larrylarrylarry' ) {
                larryBird();
                return;
            }

            //keyboardShortcuts();
        };

        onkeyup = function(e){
            e = e || event; // deal with IE
            k[e.keyCode] = e.type == 'keydown';

            //keyboardShortcuts();
        };
    }

    /*
    Larry Bird for the 3!!!
    If input is empty or not in accepted array, give them another chance.
    If the prompt is accepted, do something.
     */
    function larryBird() {
        currentCombo = '';

        $( '.larry-bird' ).click();
        $( 'input#larry-input' ).select();
    }

    function searchInit() {
        var backupResults = '';

        //_.each( adminPages, function( page ) {
        //    _.each( page, function( p ) {
        //        backupResults +='<li class="smart-result"><a href="' + adminUrl + '">' + page + '</a></li>';
        //        $( '#backup-results' ).html( backupResults );
        //    });
        //});

        // Search commands
        $( '#larry-input' ).on( 'keydown search', function ( event ) {
            var code = event.keyCode;

            // We want to be able to arrow through the dropdown (down and up)
            if ( ! code[40] || ! code[38] ) {
                var term = $(this).val();
                smartSearch(term);
            }
        });

        $( '.see-all' ).click( function() {
            $( '#backup-results' ).toggle();
        });
    }

    function smartSearch( term ) {
        var htmlList = '', searchTerm, allPages = [], subPages = [], parentPages = [];

        _.each( adminPages, function( subs, parent ) {

            if( Object.prototype.toString.call( subs ) === '[object Array]' ) {
                parentTitle = subs[0];
                parentLinky = subs[2];

                searchTerm = parentTitle.toLowerCase();
                parentPages.push( {searchTerm:searchTerm, linky:parentLinky} );
            }

            // Loop through and build the sub pages
            //sub[0] = page title, [1] == page slug, [2] == action
            _.each( subs.sub_pages, function( sub ) {
                subTitle = parent + ' ' + sub[0];
                linky    = adminUrl + sub[2];

                searchTerm = subTitle.toLowerCase();
                subPages.push( {searchTerm:searchTerm, linky:linky} );
            });

        });

        allPages = subPages.concat( parentPages );

        filteredPages = _.filter( allPages, function( page ){
            return page.searchTerm.indexOf( term ) > -1;
        });

        _.each( filteredPages, function( page ) {
            htmlList  += '<li class="smart-result" data-link-target=" '+ page.linky +' " ><a href="' + page.linky + '">' + page.searchTerm + '</a></li>';
        });

        // Show list of results and submit button
        if ( searchTerm.length >= 1 ) {
            $( '#smart-results' ).html( htmlList );
            $( '#for-the-three' ).show();
        } else {
            $('#for-the-three').hide();
        }

        // Select the first result
        $( '.smart-result' ).first().addClass( 'smart-result-selected' );

        // Larry can't find it :(... At least he tries to help.
        if ( '' === htmlList ) {
            larryCantFindAnything( term );
        }

        //// Listen for the form to be submitted
        var form = document.getElementById( 'larry-bird-form' );
        if ( form.attachEvent) {
            form.attachEvent( "submit", processForm );
        } else {
            form.addEventListener( "submit", processForm );
        }
    }

    // Process the form
    function processForm(e) {
        if ( e.preventDefault ) e.preventDefault();
        var input = $( '#larry-input').val(), i;

        // Navigate to the page!
        window.location.href = $( '.smart-result-selected' ).attr( 'data-link-target' );

        // You must return false to prevent the default form behavior
        return false;
    }


    // This is shown when Larry can't find any results.
    function larryCantFindAnything( term ) {
        $( '#for-the-three' ).hide();
        $( '#smart-results' ).html( '<span class="smart-result">Larry can\'t find ' + term
        + '</span><br><h3>Examples: </h3>' + 'command'
        + '<br><a class="see-all" style="cursor: pointer">see all</a>' );

        // Show the backup results.
        $( '.see-all' ).click( function() {
            $( '#backup-results').show();
            $( '#smart-results, #for-the-three').hide();
            $( 'input#larry-input' ).val('').select();
        });
    }

/*
    function smartPrompt() {
		smartkeysMasterVars.currentCombo = ''; // resets currentCombo
        var newTab     = '_self';
        var userInput  = prompt( 'Where do you want to go? \n\n' + data.command.join().replace(/,/g, "\n" ) );
        var hasNew     = userInput.search( /(new)/ );
        var isAccepted = false;

        // Check for a " new" tab requested and strip it from the input
        if ( hasNew > -1 && endsWith( userInput, ' new' ) ) {
            newTab = '_blank';
            userInput = userInput.replace( ' new' , '' );
        }

        if ( _.contains( data.command, userInput ) ) {
            isAccepted = true;
        }

        // If the command is not accepted, try again?
        if ( userInput == '' || ! isAccepted ) {
            if ( confirm( 'That command was not found, try again?' ) ) {
                smartPrompt();
            }
        }

        // Woot! Command accepted: do something
        if ( isAccepted ) {
            var commandKey = _.indexOf( data.command, userInput );
            var action = data.action[commandKey];

            window.open( smartkeysMasterVars.home_url + "/wp-admin/" + action, newTab );
        }
    }
*/

    /*
     Jetpack Commands!!!
     Quickly navigate to any jetpack settings area

     If input is empty or not in accepted array, give them another chance.
     If the prompt is accepted, do something.
     */
/*
    function jetPrompt() {
		currentCombo = ''; // resets currentCombo
        var newTab     = '_self';
        var userInput  = '';
        var userInput  = prompt( 'Blast off where? \n\n' + jetpackCommands.command.join().replace(/,/g, "\n" ) );
        var hasNew     = userInput.search( /(new)/ );
        var isAccepted = false;

        // Check for a " new" tab requested and strip it from the input
        if ( hasNew > -1 && endsWith( userInput, ' new' ) ) {
            newTab = '_blank';
            userInput = userInput.replace( ' new' , '' );
        }

        if ( _.contains( jetpackCommands.command, userInput ) ) {
            isAccepted = true;
        }

        // If the command is not accepted, try again?
        if ( userInput == '' || ! isAccepted ) {
            if ( confirm( 'That command was not found, try again?' ) ) {
                smartPrompt();
            }
        }

        // Woot! Command accepted: do something
        if ( isAccepted ) {
            var commandKey = _.indexOf( jetpackCommands.command, userInput );
            var action = jetpackCommands.action[commandKey];

            window.open( action, newTab );
        }
    }

    ////////////////////////////
    // Keyboard Shortcuts
    ////////////////////////////
    function keyboardShortcuts() {
        // Jetpack: Omnisearch -- cmd / shift / s
        if ( k[16] && k[83] && k[91] ) {
            $( '#adminbar-search' ).focus();
            $( 'input#adminbar-search' ).select();

            k = [];
        }

        // Jetpack: Go to settings page -- j / e / t
        if ( k[69] && k[74] && k[84] ) {
            if ( confirm( 'Blast off to the Jetpack Settings Page?' ) ) {
                window.location.href = smartkeysMasterVars.home_url + "/wp-admin/admin.php?page=jetpack_modules";
            }

            k = [];
        }

        // WordPress: Write a new post -- p / o / s / t
        if ( k[79] && k[80] && k[83] && k[84] ) {
            if ( confirm( 'Take me to write a new post' ) ) {
                window.location.href = smartkeysMasterVars.home_url + "/wp-admin/post-new.php";
            }
            k = [];
        }
    }
*/
})(jQuery);

