# Stock Ledger

A small React + Tailwind CSS app to list products, compare buying and selling prices, and download the list as a PDF (jsPDF).

## Features

- Add, edit and delete products (full CRUD)
- Fields: product name, number of products, buying price, selling price
- Calculated for every row: total buying, total selling, profit
- Totals: total products, total quantity, total buying, total selling, expected profit
- Duplicate name checker: a repeated name turns the input red while you type and cannot be saved. Duplicates already in the list are marked red in the table and in the PDF
- Search by name
- Download PDF
- Data is saved in the browser (localStorage)

## Run it in VS Code

1. Install Node.js 18 or newer from https://nodejs.org
2. Unzip the project and open the `stock-ledger` folder in VS Code
3. Open the terminal in VS Code (Terminal > New Terminal) and run:

```bash
npm install
npm run dev
```

4. Open the address it prints (usually http://localhost:5173)

## Push to GitHub

Create an empty repository on GitHub first, then in the project folder:

```bash
git init
git add .
git commit -m "Stock Ledger"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/stock-ledger.git
git push -u origin main
```

## Deploy to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click Add New > Project and import the `stock-ledger` repository
3. Vercel detects Vite automatically (build command `npm run build`, output folder `dist`). Click Deploy

Every later `git push` redeploys the site.

## Change the currency

Open `src/utils.js` and change `CURRENCY = "ETB"` to another label, for example `"USD"`.

## Project structure

```
src/
  App.jsx                    state, CRUD, search, storage
  pdf.js                     PDF export
  utils.js                   currency, totals, duplicate matching
  components/
    ProductForm.jsx          add / edit form with the live duplicate check
    ProductTable.jsx         table with edit and delete
    Summary.jsx              totals at the top
```
