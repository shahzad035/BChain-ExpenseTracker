	
	const Web3 = require('web3');
	const ExpenseTracker = require('../../build/contracts/ExpenseTracker.json');
	const HDWalletProvider = require('@truffle/hdwallet-provider');
	
	const address='0x99671fD21E9ab3CBeea4a796b474c6C09EfeB1A7';
	const privateKey='0xb0953d2694f776d46ef6a7c337feb0c89b1e773b50e53346e63e652a40d06713';

	const init = async () => {
		const provider = new HDWalletProvider(
			privateKey,
			'https://ropsten.infura.io/v3/9d4ea5dfc99c4831ab6b94955ddcf79a'
			);
		
		const web3 = new Web3(provider);
		
		let expContract = web3.eth.Contract(
			ExpenseTracker.abi,
		);

		expContract= await expContract
			.deploy({data: ExpenseTracker.bytecode})
			.send({from: address});		
	};

	// Load Contract Transaction List Data
	const getTrnList = async() =>{
		ExpenseTracker.deployed().then(function(instance)
		{
			trnInstance = instance;
			return trnInstance.trnCount();

		}).then(function(trnCount)
		{
			var usrList = $("#list");
      		usrList.empty();
			
			  for(var i = 1; i <= trnCount; i++)
			{
				trnInstance.trnList(i).then(function(transactionList)
				{
					var tId = transactionList[0];
					var tName = transactionList[1];
					var trnAmount = transactionList[2];
				    
					var tClass = "plus";
					// Render candidate Result
				    if(tName != "Income / Salary"){
						tClass = "minus";	
					}
					var trnTemplate = "<li class ="+ tClass +">" + tName + "<span> $"+ trnAmount +"</span></li>"
					usrList.append(trnTemplate);
				})	
			}
		}).catch(function(error) {
			console.warn(error);
		  });
	};

	//Load Balance/Income/Expense Count
	const getSummary = async()=>{
		ExpenseTracker.deployed().then(function(instance){
			instance.getValues.call(3).then(function(val){
				$('balance').html(val[0].toString());
				$('income').html(val[1].toString());
				$('expense').html(val[2].toString());
			})
		}).catch(function(error){
			console.warn(error);
		});
	};

	//Add Transactions
	const addTransaction = async() =>{
		var e = document.getElementById("ddltransactions");
		var trnId = e.options[e.selectedIndex].value;
		var trnName = e.options[e.selectedIndex].text;
		var trnAmount = $('#txtAmount').text;
		var trnType = 0;
		
		if(trnId != 0){
			trnType = 1;
		}
		ExpenseTracker.deployed().then(function(instance){
			return instance.setTransaction(trnName,trnAmount,trnType);
		}).then(function(result){
			
			getTrnList();
			getSummary();

		}).catch(function(err){
			console.error(err);
		});
	};

	$(function(){
		$(window).load(function(){
			init();
		});
	});
