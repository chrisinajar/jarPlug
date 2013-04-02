/*
Copyright 2012, Coding Soundtrack
All rights reserved.

Authors:
Chris Vickery <chrisinajar@gmail.com>

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met: 

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer. 
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution. 

I am not responsible for any anal troubles

*/

// LOAD FIRST, YEAH!

// jarPlug

(function($, undefined) {
var _jarPlug = window.jarPlug;

if ("jarPlug" in window)
	delete window.jarPlug;

// Don't edit this directly in source. Use the localStorage.jarplug_devurl value instead.
var baseUrl = "https://rawgithub.com/chrisinajar/jarPlug/master/";

// Yeah, this one.
if (typeof localStorage.jarplug_devurl === 'string')
	baseUrl = localStorage.jarplug_devurl; // <-- that

// Alright, so one time someone made a pull request, and I pulled in his
// change to the baseUrl value, and then COULD NOT figure out why my changes 
// weren't working for like an hour. I was going insane.
// Please and thankyou.

// converts native arguments object to an array and applies function
function applyArgs(func, thisObj, args) {
	return func.apply(thisObj, Array.prototype.slice.call(args));
}

// defines a flow given any number of functions as arguments
function define() {
	var deferr = new $.Deferred;
	var thisFlow = function() {
		applyArgs(thisFlow.exec, thisFlow, arguments);

		return deferr.promise();
	}
	
	thisFlow.blocks = arguments;
	
	thisFlow.exec = function() {
		// The flowState is the actual object each step in the flow is applied to. It acts as a
		// callback to the next function. It also maintains the internal state of each execution
		// and acts as a place for users to save values between steps of the flow.
		var retVal = null;
		var flowState = function() {
			if (flowState.__frozen) return;
			
			if (flowState.__timeoutId) {
				clearTimeout(flowState.__timeoutId);
				delete flowState.__timeoutId;
			}
			
			var blockIdx = flowState.__nextBlockIdx ++;
			var block = thisFlow.blocks[blockIdx];
			
			if (block === undefined) {
				deferr.resolve(retVal);
				return;
			}
			else {
				retVal = applyArgs(block, flowState, arguments);
				if (typeof flowState.__multiFinished === 'function' && flowState.__multiCount === 0)
					flowState.__multiFinished();
				flowState.__multiFinished = true;
			}
		}
		
		// __nextBlockIdx specifies which function is the next step in the flow.
		flowState.__nextBlockIdx = 0;
		
		// __multiCount is incremented every time MULTI is used to createa a multiplexed callback
		flowState.__multiCount = 0;
		
		flowState.__multiFinished = false;
		
		// __multiOutputs accumulates the arguments of each call to callbacks generated by MULTI
		flowState.__multiOutputs = [];
		
		// REWIND signals that the next call to thisFlow should repeat this step. It allows you
		// to create serial loops.
		flowState.REWIND = function() {
			flowState.__nextBlockIdx -= 1;
		}
		
		// MULTI can be used to generate callbacks that must ALL be called before the next step
		// in the flow is executed. Arguments to those callbacks are accumulated, and an array of
		// of those arguments objects is sent as the one argument to the next step in the flow.
		// @param {String} resultId An identifier to get the result of a multi call.
		flowState.MULTI = function(resultId) {
			flowState.__multiCount += 1;
			return function() {
				flowState.__multiCount -= 1;
				flowState.__multiOutputs.push(arguments);

				if (resultId) {
					var result = arguments.length <= 1 ? arguments[0] : arguments
					flowState.__multiOutputs[resultId] = result;
				}
				
				if (flowState.__multiCount === 0) {
					var finish = function() {
						var multiOutputs = flowState.__multiOutputs;
						flowState.__multiOutputs = [];
						flowState(multiOutputs);
					};
					if (flowState.__multiFinished !== true) {
						flowState.__multiFinished = finish;
					} else {
						finish();
					}
				}
			}
		}
					
		// TIMEOUT sets a timeout that freezes a flow and calls the provided callback. This
		// timeout is cleared if the next flow step happens first.
		flowState.TIMEOUT = function(milliseconds, timeoutCallback) {
			if (flowState.__timeoutId !== undefined) {
				throw new Error("timeout already set for this flow step");
			}
			
			flowState.__timeoutId = setTimeout(function() {
				flowState.__frozen = true;
				timeoutCallback();
			}, milliseconds);
		}
		
		applyArgs(flowState, this, arguments);
	}
	
	return thisFlow;
}

// defines a flow and evaluates it immediately. The first flow function won't receive any arguments.
function exec() {
	return applyArgs(jarPlug.define, jarPlug, arguments)();
}

// a very useful flow for serial execution of asynchronous functions over a list of values
// (idea suggested by John Wright, http://github.com/mrjjwright)
var serialForEach = define(
	function(items, job, between, finish) {
		this.items = items;
		this.curItem = 0;
		this.job = job;
		this.between = between;
		this.finish = finish;
		this();
 
	},function() {
		if (this.curItem > 0 && this.between) {
			applyArgs(this.between, this, arguments);
		}
		
		if (this.curItem >= this.items.length) {
			this();
		}
		else {
			this.REWIND();
			this.curItem += 1;
			this.job(this.items[this.curItem - 1]);
		}
 
	},function() {
		if (this.finish) this.finish();
	}
);

var loadedModules = {};

// define global object
var jarPlug = window.jarPlug = {
	modules: {
		'main': {
			dependencies: [],
			// something else? Think of more options!
			url: baseUrl + "main.js",
			load: true, // i have a load function!
			unload: false, // fuck unloading, fuck you!,
			loadInPopout: true
		}
	},
	define: define,
	exec: exec,
	serialForEach: serialForEach,
	baseUrl: baseUrl,
	loadModule: function(name) {
		console.log('Loading ' + name);
		if (name in loadedModules) {
			console.log('Already loaded')
			return loadedModules[name];
		}
		var deferr = loadedModules[name] = new $.Deferred;
		if (!(name in jarPlug.modules)) {
			throw new Error("Module must be in jarPlug.modules before loading");
		}
		var module = jarPlug.modules[name];
		
		if (jarPlug.isInPopout() && !module.loadInPopout) {
			console.log("Not loading module " + name + " because its loadInPopout setting is false.");
			return deferr.reject();
		}

		exec(function() {
			console.log('Flow step one');
			var flow = this;
			$.each(module.dependencies, function(i, dep) {
				jarPlug.loadModule(dep).done(flow.MULTI(dep));
			});
			flow.MULTI()();
		},function() {
			console.log('Flow step two');
			var flow = this;

			loadScript(module.url).done(function() {
				console.log('Flow step three');
				if (module.load === true) {
					var ret = jarPlug[name].load(); // example: jarPlug.main.load()
					if (typeof ret === 'object')
						ret.done(deferr.resolve);
					else
						deferr.resolve();
				} else {
					deferr.resolve();
				}
			});
		})

		return deferr.promise();
	},
	unloadModule: function(name) {
		if (!(name in loadedModules) || !(name in jarPlug.modules)) {
			return false;
		}

		var module = jarPlug.modules[name];
		delete loadedModules[name];

		if (module.unload === true && jarPlug[name] && typeof jarPlug[name].unload === 'function')
			return jarPlug[name].unload();
		else
			return true;
	},
	reloadModule: function(name) {
		var ret = jarPlug.unloadModule(name);
		if (ret === true || ret === false || ret === undefined)
			return jarPlug.loadModule(name);
		var d = new $.Deferred;
		ret.done(function() {
			jarPlug.loadModule(name).done(d.resolve);
		});
		return d.promise();
	},
	// unload everything!
	unload: function() {
		return exec(function() {
			var flow = this;
			$.each(loadedModules, function(name, deff) {
				console.log('Unloading ' + name);
				var callback = flow.MULTI();
				var ret = jarPlug.unloadModule(name);
				if (ret === true || ret === false || ret === undefined)
					callback();
				else
					ret.done(callback);
			})
			flow.MULTI()();
		})
	},
	reload: function() {
		$.getScript(jarPlug.baseUrl + "/init.js");
	},
	isInPopout: function() {
		return document.URL == 'http://plug.dj/_/popout/';
	}
	// PROFIT
}


// Code borrowed and altered from LABjs, http://labjs.com/
// Specifically: https://gist.github.com/603980
// Credit where credit is due.
var loadScript = (function(url) {
	var deferr = new $.Deferred,
		global = window,
		oDOC = document,
		head = oDOC.head || oDOC.getElementsByTagName("head");

	var handler = function() {
		deferr.resolve(url);
	};

	setTimeout(function () {
		if ("item" in head) { // check if ref is still a live node list
			if (!head[0]) { // append_to node not yet ready
				setTimeout(arguments.callee, 25);
				return;
			}
			head = head[0]; // reassign from live node list ref to pure node ref -- avoids nasty IE bug where changes to DOM invalidate live node lists
		}
		var scriptElem = oDOC.createElement("script"),
			scriptdone = false;
		scriptElem.onload = scriptElem.onreadystatechange = function () {
			if ((scriptElem.readyState && scriptElem.readyState !== "complete" && scriptElem.readyState !== "loaded") || scriptdone) {
				return false;
			}
			scriptElem.onload = scriptElem.onreadystatechange = null;
			scriptdone = true;
			handler();
		};
		scriptElem.src = url + '?_=' + (new Date()).getTime();
		head.insertBefore(scriptElem, head.firstChild);
	}, 0);

	// required: shim for FF <= 3.5 not having document.readyState
	if (oDOC.readyState === null && oDOC.addEventListener) {
		oDOC.readyState = "loading";
		oDOC.addEventListener("DOMContentLoaded", handler = function () {
			oDOC.removeEventListener("DOMContentLoaded", handler, false);
			oDOC.readyState = "complete";
		}, false);
	}

	return deferr.promise();
});

// unload old jarPlug if it's there
// Load main and get this party started
if (_jarPlug !== undefined) {
	if (typeof _jarPlug.unload === 'function') {
		_jarPlug.unload().done(function() {
			jarPlug.loadModule('main');
		})
	} else {
		jarPlug.loadModule('main');
	}
} else {
	jarPlug.loadModule('main');
}

})(jQuery);

