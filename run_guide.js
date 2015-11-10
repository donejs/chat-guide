var automate = require("guide-automation");
var streamWhen = require("stream-when");

var guide = automate({ spinner: true, log: true });

/**
 * @Step 1
 */

guide.step("Install donejs", function(){
	return guide.executeCommand("npm", ["install", "donejs", "-g"]);
});

// Move to a temp folder for the rest of the guide
guide.moveToTmp();

/**
 * @Step 2
 */
guide.step("Run donejs init", function(){
	var init = guide.answerPrompts("donejs", ["init", "donejs-chat"]);
	var answer = init.answer;

	answer(/Project name/, "\n");
	answer(/Project main folder/, "src\n");
	answer(/Description/, "\n");
	answer(/Project homepage url/, "\n");
	answer(/GitHub username or organization/, "\n");
	answer(/Author's Name/, "\n");
	answer(/Author's Email/, "\n");
	answer(/Author's Homepage/, "\n");
	answer(/Application keywords/, "\n");

	return init.promise;
});

/**
 * @Step 3
 */
guide.step("Move to donejs-chat folder", function(){
	process.chdir("donejs-chat");
	return guide.injectSpy("src/index.stache");
});

/**
 * @Step 4
 */
guide.step("Start donejs develop", function(){
	var child = this.canServe = guide.executeCommand("donejs", ["develop"]).childProcess;

	var server = streamWhen(child.stdout, /can-serve starting on/);
	var liveReload = streamWhen(child.stderr, /Live-reload server/);
	return Promise.all([server, liveReload]).then(function(){
		return guide.wait(2000);
	});
});

/*
guide.test(function(){
	return guide.nodeTest(__dirname + "/steps/3-donejs-develop/test.js");
});
*/

guide.launchBrowser("http://localhost:8080");

/**
 * @Step 5
 */
guide.step("Install bootstrap", function(){
	return guide.executeCommand("npm", ["install", "bootstrap", "--save"])
		.then(function(){
			return guide.wait(500);
		})
		.then(function(){
			return guide.replaceFile("src/index.stache",
									 __dirname +"/steps/4-bootstrap/index.stache");
		})
		.then(function(){
			return guide.wait(5000);
		});
});

guide.test(function(){
	return guide.functionalTest(__dirname +"/steps/4-bootstrap/test.js");
});

/**
 * @Step 6
 */
guide.step("Generate custom elements", function(){
	return guide.executeCommand("donejs", ["add","component","home.component","chat-home"])
		.then(function(){
			return guide.executeCommand("donejs", ["add","component","messages",
								  "chat-messages"]);
		});
});

/**
 * @Step 7
 */
guide.step("Navigate between pages", function(){
	return guide.replaceFile("src/home.component",
					   __dirname+"/steps/7-navigate/home.component")
		.then(function(){
			return guide.replaceFile("src/messages/messages.stache",
							   __dirname+"/steps/7-navigate/messages.stache");
		})
		.then(function(){
			return guide.replaceFile("src/app.js",
							   __dirname+"/steps/7-navigate/app.js");
		})
		.then(function(){
			return guide.replaceFile("src/index.stache",
							   __dirname+"/steps/7-navigate/index.stache");
		});
});



guide.test(function(){
	return guide.functionalTest(__dirname+"/steps/7-navigate/test.js");
});

guide.test(function(){
	return guide.nodeTest(__dirname+"/steps/7-navigate/ssr_test.js");
});

/**
 * @Step 8
 */
guide.step("Install and use bit-tabs", function(){
	return guide.executeCommand("npm", ["install", "bit-tabs", "--save"])
		.then(function(){
			return guide.wait(500);
		})
		.then(function(){
			return guide.replaceFile("src/home.component",
									 __dirname+"/steps/8-bit-tabs/home.component");
		});
});

guide.test(function(){
	// Check that the tabs have appeared.
	return guide.functionalTest(__dirname+"/steps/8-bit-tabs/tabs_test.js");
});

/**
 * @Step 9
 */
guide.step("Generate the Message model", function(){
	var supermodel = guide.answerPrompts("donejs", ["add", "supermodel", "message"]);
	var answer = supermodel.answer;

	answer(/URL endpoint/, "http://chat.donejs.com/api/messages\n");
	answer(/property name/, "\n");

	return supermodel.promise;
});

/**
 * @Step 10
 */
guide.step("Use the connection", function(){
	return guide.replaceFile("src/messages/messages.stache",
							 __dirname+"/steps/10-use-connection/messages.stache")
		.then(function(){
			return guide.wait(500);
		});
});

guide.test(function(){
	return guide.functionalTest(__dirname+"/steps/10-use-connection/test.js");
});

/** Step 11
 *
 */
guide.step("Create messages", function(){
	return guide.replaceFile("src/messages/messages.stache",
							 __dirname+"/steps/11-create-messages/messages.stache")
		.then(function(){
			return guide.replaceFile("src/messages/messages.js",
									 __dirname+"/steps/11-create-messages/messages.js");
		});
});

guide.test(function(){
	return guide.functionalTest(__dirname+"/steps/11-create-messages/test.js");
});


guide.skipTo(3);

guide.run().then(
	function(){
		console.log("All done!");
	},
	function(err){
		console.error("Oh no", err.message, err.stack, err);
	}
);


return;

