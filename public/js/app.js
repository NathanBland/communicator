(function() { 
	'use strict';
	//get elements and such.
	nunjucks.configure('/views', { autoescape: true });
	var db = new PouchDB('communicator');
	var remoteCouch = 'http://192.168.1.111:5984/communicator';

	db.changes({
		since: 'now',
		live: true
	}).on('change', showAccounts);

	function sync() {
	  //syncDom.setAttribute('data-sync-state', 'syncing');
		var opts = {live: true};
		db.sync(remoteCouch, opts, syncError);
	}
	 function syncError() {
		console.log("err");
  	}
	function addUser(username){
		var user = {
			_id: new Date().toISOString(),
			username: username,
			accounts: {}
		};
		db.put(user).then(function(result){
			//call update UI function.
			console.log('Successfully added user!');
			console.log(result);
		}).catch(function(err){
			console.log("Adding user failed.");
			console.log(err);
		});
	};
	function deleteAccount(user){

	}
	function renderAccounts(results){
		var res = nunjucks.render('accounts.html', {"results":results});
		var target = document.querySelector("#account-list--accounts");
		target.innerHTML = res;
		target.className = 'account-list--accounts__loaded';
		account.className += ' ' + 'form__loaded';
		var accounts = document.querySelectorAll('.account-list--account');
		for (var i = 0; i< accounts.length; i++){
			window.setTimeout(function(acc){
				acc.className += ' ' + 'account-list--account__loaded';
			}, 100+(i*150), accounts[i]);
		}
	
	}
	function showAccounts(){
		db.allDocs({include_docs: true, descending: false})
		.then(function(doc){
			renderAccounts(doc.rows);
		}).catch(function(err){
			console.log(err);
			//warn user?
		})
	}
	function createListener(el, action, callback){
		el.addEventListener(action, callback);
	}
	function createAccount(e){
		e.preventDefault();
		var username = account.querySelector("input");
		console.log("username:", username.value);
		if (username.value !== ''){
			addUser(username.value);
		}
	}

	var account = document.querySelector('#create-account');
	createListener(account, "submit", createAccount);
	showAccounts();
	if (remoteCouch){
		sync();
	}
})();
