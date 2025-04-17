
import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../App.css';
import Navbar from './Navbar'

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const [initialBudget, setInitialBudget] = useState('');
  const [isBudgetSet, setIsBudgetSet] = useState(false);

  const options = {
    plugins: {
      legend: {
        labels: {
          color: 'white', // Change label text color
          font: {
            size: 16,    // Change label font size
            family: 'Arial', // Optional: change font family
          },
        },
      },
    },
  };
  

  const [expenses, setExpenses] = useState({
    credit: 0,
    food: 0,
    grocery: 0,
    medication: 0,
    education: 0,
    other: 0,
  });

  const [transactions, setTransactions] = useState([]);

  // Temporary input state per category
  const [inputs, setInputs] = useState({
    food: '',
    grocery: '',
    medication: '',
    education: '',
    other: '',
  });

  const handleSetCredit = () => {
    const creditAmount = parseFloat(initialBudget);
    if (!creditAmount || creditAmount <= 0) {
      alert('Enter a valid budget amount.');
      return;
    }
    if (isBudgetSet) {
      alert('Initial budget is already set.');
      return;
    }
    setExpenses(prev => ({
      ...prev,
      credit: creditAmount,
    }));
    setIsBudgetSet(true);
    setInitialBudget('');
  };
  const handleExpenseSubmit = (category) => {
    const value = parseFloat(inputs[category]) || 0;

    if (value <= 0) {
      alert('Please enter a valid expense amount.');
      return;
    }

    const totalOtherExpenses = Object.entries(expenses)
      .filter(([key]) => key !== 'credit')
      .reduce((acc, [key, val]) => acc + val, 0);

    const currentCredit = expenses.credit;

    if (value > currentCredit) {
      alert('You do not have enough credit!');
      return;
    }

    const newAmount = expenses[category] + value;
    const newCredit = currentCredit - value;

    const timestamp = new Date().toLocaleString();

    setExpenses(prev => ({
      ...prev,
      [category]: newAmount,
      credit: newCredit,
    }));

    setTransactions(prev => [
      {
        category,
        amount: value,
        time: timestamp,
      },
      ...prev,
    ]);

    setInputs(prev => ({
      ...prev,
      [category]: '',
    }));
  };
  // Recalculate expenses and credit from transaction history
const recalculateExpenses = (updatedTransactions, initialCredit) => {
  const newExpenses = {
    credit: initialCredit,
    food: 0,
    grocery: 0,
    medication: 0,
    education: 0,
    other: 0,
  };

  updatedTransactions.forEach(({ category, amount }) => {
    newExpenses[category] += amount;
    newExpenses.credit -= amount;
  });

  return newExpenses;
};

// Delete a transaction
const handleDeleteTransaction = (index) => {
  const updatedTransactions = [...transactions];
  const removed = updatedTransactions.splice(index, 1)[0];

  const updatedExpenses = recalculateExpenses(updatedTransactions, isBudgetSet ? expenses.credit + removed.amount : 0);

  setTransactions(updatedTransactions);
  setExpenses(updatedExpenses);
};

// Edit a transaction
const handleEditTransaction = (index) => {
  const newAmount = prompt('Enter new amount:');
  const parsed = parseFloat(newAmount);

  if (isNaN(parsed) || parsed <= 0) {
    alert('Please enter a valid number.');
    return;
  }

  const updatedTransactions = [...transactions];
  const oldTx = updatedTransactions[index];

  updatedTransactions[index] = {
    ...oldTx,
    amount: parsed,
    time: new Date().toLocaleString(),
  };

  const updatedExpenses = recalculateExpenses(updatedTransactions, expenses.credit + oldTx.amount);

  // Ensure budget is not exceeded
  if (updatedExpenses.credit < 0) {
    alert('Edited value exceeds total budget!');
    return;
  }

  setTransactions(updatedTransactions);
  setExpenses(updatedExpenses);
};


  const handleInputChange = (e, category) => {
    setInputs(prev => ({
      ...prev,
      [category]: e.target.value,
    }));
  };

  const data = {
    labels: ['Remaining Credit', 'Food', 'Grocery', 'Medication', 'Education', 'Other'],
    datasets: [
      {
        data: [
          expenses.credit,
          expenses.food,
          expenses.grocery,
          expenses.medication,
          expenses.education,
          expenses.other,
        ],
        backgroundColor: [
          '#36A2EB',
          '#FF6384',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        borderColor: 'black',
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
     
    <div className="piecontainer">
      <div className='intialbudgetcontainer'>
          {!isBudgetSet ? (
            <>
            <div className='intialbudget'>
              <h3>Set Initial Credit:</h3>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter budget"
                value={initialBudget}
                onChange={(e) => setInitialBudget(e.target.value)}
                className="setinput"
              />
              <button className="setbtn" onClick={handleSetCredit}>
                Set Credit
              </button>
              </div>
            </>
          ) : (
            <h3>Total Initial Credit Available: &#8377;{expenses.credit}</h3>
          )}
    </div>
      <div className="row-1">
        <Pie  className="piechart" data={data} options={options}/>
        <div className="expense-inputs">
          <h3>Enter Expenses:</h3>
          <div className="row">
            {/* Column 1: Labels */}
            <div className="col">
              {['food', 'grocery', 'medication', 'education', 'other'].map(category => (
                <div className='expense-label' key={category}>
                  <label >{category}:</label>
                </div>
              ))}
            </div>

            {/* Column 2: Inputs */}
            <div className="col">
              {['food', 'grocery', 'medication', 'education', 'other'].map(category => (
                <div key={category}>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={inputs[category]}
                    onChange={(e) => handleInputChange(e, category)}
                    className="plain-input"
                  />
                </div>
              ))}
            </div>

            {/* Column 3: Buttons */}
            <div className="col">
              {['food', 'grocery', 'medication', 'education', 'other'].map(category => (
                <div key={category}>
                  <button className="btn add-btn" onClick={() => handleExpenseSubmit(category)}>Add</button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="total-expenses">
          <h4>Current Status:</h4>
          <div className="row">
            {/* Column 1: Labels */}
            <div className="col">
              <div className="expense-label">
                <label>Remaining Credit:</label>
              </div>
              {['food', 'grocery', 'medication', 'education', 'other'].map(cat => (
                <div className="expense-label" key={cat}>
                  <label>{cat.charAt(0).toUpperCase() + cat.slice(1)}:</label>
                </div>
              ))}
            </div>

            {/* Column 2: Values */}
            <div className="col">
              <div className="expense-value">
                ₹{expenses.credit.toFixed(2)}
              </div>
              {['food', 'grocery', 'medication', 'education', 'other'].map(cat => (
                <div className="expense-value" key={cat}>
                  ₹{expenses[cat].toFixed(2)}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="row-2">
        

        <div className="transactions">
          <h4>Recent Transactions:</h4>
          {transactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <ul>
              {transactions.map((tx, idx) => (
                <li key={idx}>
                  <strong>{tx.category}</strong> - &#8377;{tx.amount.toFixed(2)} at {tx.time}
                  <button onClick={() => handleEditTransaction(idx)} className="edit-btn btn">Edit</button>
                  <button onClick={() => handleDeleteTransaction(idx)} className="dlt-btn btn">Delete</button>
                </li>
              ))}
            </ul>

          )}
        </div>
      </div>
    </div>
   
    </>
  );
};

export default PieChart;
