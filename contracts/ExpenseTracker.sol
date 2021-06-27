pragma solidity >=0.5.0 <0.6.0;
contract ExpenseTracker{
    
    //@define Variables
    uint public balance;
    uint public income;
    uint public expense;
    
    struct transactionList{
        uint tId;
        string tName;
        uint tAmount;
    }
    
    // Read/write candidates
    mapping(uint => transactionList) public trnList;
    
    // Store Transactions Count
    uint public trnCount;
    
    constructor() public{
        balance = 0;
        income = 0;
        expense = 0;
    }
    
    function setTransaction(string memory _tName, uint _tAmount, uint16 tType) public
    {
        trnCount++;
        trnList[trnCount] = transactionList(trnCount,_tName,_tAmount);

        if(tType == 0){
            income = income + _tAmount;
        }
        else{
            expense = expense + _tAmount;
        }
        
        balance = (income - expense);
    }
    
    function getValues() public view returns(uint, uint, uint){
     return(balance, income, expense);   
    }
}