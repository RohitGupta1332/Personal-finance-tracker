# TrackIt - Financial Management System

TrackIt is a comprehensive financial management system designed to help users manage their daily transactions, set budgets for specific expenses, and track their financial health. The platform offers a user-friendly interface combined with real-time insights into spending habits.

## Features

* Daily Transactions: Add, edit, and manage daily transactions with ease.
* Budget Management: Set budgets for individual expense categories and monitor your spending.
* Cleared & Uncleared Balances: Automatically calculate and display cleared, uncleared balances, and working capital.
* Spending Analytics:
* Category-wise spending breakdown.
* Category-type spending insights (e.g., Bills, Needs, Wants).
* Dynamic Updates: Real-time data fetching and visualization for up-to-date financial tracking.

## Tech Stack

* Frontend:

    * HTML, CSS, JavaScript

* Backend:

    * PHP

* Database:

    * MySQL

## Database Design

## Tables Overview

* User: Stores user credentials and information.
* Accounts: Tracks user accounts and balances.
* Category: Defines spending categories and subcategories:
    * Category Types: Bills, Needs, Wants.
* Transaction: Records inflow and outflow details for each account.
* Budget: Stores user-defined budgets for specific categories.

## Key Functionalities

1. Cleared and Uncleared Balances
    * Users can tag transactions as "cleared" or "uncleared."
    * The system calculates:
        * Cleared Balance: Sum of all cleared transactions.
        * Uncleared Balance: Sum of all uncleared transactions.
        * Working Capital: Total of cleared + uncleared balances.

2. Category-wise Spending
    * Users can view total spending for each subcategory.
    * Provides detailed insights into how money is spent across subcategories like Electricity, Groceries, or Dining Out.

3. Category-type Spending Insights
    * Spending is grouped into three main types:
        * Bills: Mandatory recurring expenses.
        * Needs: Essential but variable expenses.
        * Wants: Non-essential, discretionary expenses.

4. Real-time Updates
    * JavaScript handles real-time data fetching and DOM updates for seamless user experience.
    * Date inputs are dynamically updated to show the current month and year as defaults.